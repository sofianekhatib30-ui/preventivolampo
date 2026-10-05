import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/candidatura/route";
import { limitatoreCandidature } from "@/lib/candidatura/limite";

// Chiama direttamente l'handler della route, con l'archivio su file in una cartella temporanea.
// Dati di prova inventati.

let dir: string;
let ipSeq = 0;

beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "candidature-"));
  process.env.CANDIDATURE_DIR = dir;
  process.env.CANDIDATURE_APERTE = "1";
});

afterAll(async () => {
  delete process.env.CANDIDATURE_DIR;
  delete process.env.CANDIDATURE_APERTE;
  await rm(dir, { recursive: true, force: true });
});

beforeEach(async () => {
  limitatoreCandidature.azzera();
  for (const f of await readdir(dir)) await rm(path.join(dir, f));
});

afterEach(() => {
  vi.restoreAllMocks();
});

const campiValidi = {
  nome: "Mario Prova",
  mestiere: "Piastrellista",
  comune: "Lissone",
  telefono: "+39 333 123 4567",
  volume: "1 o 2",
  privacy: "on",
};

function richiesta(
  campi: Record<string, string>,
  { ip = `10.0.0.${++ipSeq}`, json = true, iniziatoMsFa = 5000 }: { ip?: string; json?: boolean; iniziatoMsFa?: number | null } = {},
): Request {
  const fd = new FormData();
  for (const [k, v] of Object.entries(campi)) fd.set(k, v);
  fd.set("sito_web", campi.sito_web ?? "");
  if (iniziatoMsFa !== null) fd.set("compilato_da", String(Date.now() - iniziatoMsFa));
  const headers = new Headers({ "x-forwarded-for": `${ip}, 192.168.1.1` });
  if (json) headers.set("accept", "application/json");
  return new Request("http://localhost/api/candidatura", { method: "POST", body: fd, headers });
}

async function salvate() {
  const files = await readdir(dir);
  return Promise.all(files.map(async (f) => JSON.parse(await readFile(path.join(dir, f), "utf8"))));
}

describe("POST /api/candidatura", () => {
  it("invio valido: 200, conferma col nome, salvata con cellulare normalizzato", async () => {
    const res = await POST(richiesta(campiValidi));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, nome: "Mario Prova" });
    const archivio = await salvate();
    expect(archivio).toHaveLength(1);
    expect(archivio[0]).toMatchObject({
      nome: "Mario Prova",
      mestiere: "Piastrellista",
      comune: "Lissone",
      telefono: "+393331234567",
      volume: "1 o 2",
      privacy: "on",
    });
    expect(archivio[0].id).toMatch(/^[0-9a-f-]{36}$/);
    expect(Number.isNaN(Date.parse(archivio[0].ricevutaIl))).toBe(false);
  });

  it("invio valido non scrive dati personali nei log", async () => {
    const spie = (["log", "info", "warn", "error", "debug"] as const).map((m) =>
      vi.spyOn(console, m).mockImplementation(() => {}),
    );
    await POST(richiesta(campiValidi));
    await POST(richiesta({ ...campiValidi, telefono: "abc" }));
    const scritto = spie.flatMap((s) => s.mock.calls.flat().map(String)).join("\n");
    for (const dato of ["Mario", "Lissone", "333", "10.0.0."]) expect(scritto).not.toContain(dato);
  });

  it("campo esca riempito: risponde come un successo ma non salva niente", async () => {
    const res = await POST(richiesta({ ...campiValidi, sito_web: "https://spam.example" }));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(await salvate()).toHaveLength(0);
  });

  it("invio troppo rapido (meno di 3 secondi): 400, non salva", async () => {
    const res = await POST(richiesta(campiValidi, { iniziatoMsFa: 1000 }));
    expect(res.status).toBe(400);
    const corpo = await res.json();
    expect(corpo.ok).toBe(false);
    expect(corpo.messaggio).toMatch(/\S/);
    expect(await salvate()).toHaveLength(0);
  });

  it("momento di inizio nel futuro o non numerico: trattato come troppo rapido", async () => {
    expect((await POST(richiesta(campiValidi, { iniziatoMsFa: -60_000 }))).status).toBe(400);
    const fd = richiesta({ ...campiValidi, compilato_da: "ieri" }, { iniziatoMsFa: null });
    expect((await POST(fd)).status).toBe(400);
    expect(await salvate()).toHaveLength(0);
  });

  it("sesto invio in un'ora dallo stesso IP: 429, e gli altri IP passano", async () => {
    const ip = "10.9.9.9";
    for (let i = 0; i < 5; i++) {
      expect((await POST(richiesta(campiValidi, { ip }))).status).toBe(200);
    }
    const sesto = await POST(richiesta(campiValidi, { ip }));
    expect(sesto.status).toBe(429);
    expect((await sesto.json()).messaggio).toMatch(/\S/);
    expect(await salvate()).toHaveLength(5);
    expect((await POST(richiesta(campiValidi, { ip: "10.9.9.10" }))).status).toBe(200);
  });

  it("anche gli invii falliti contano per il limite", async () => {
    const ip = "10.8.8.8";
    for (let i = 0; i < 5; i++) await POST(richiesta({ ...campiValidi, nome: "" }, { ip }));
    expect((await POST(richiesta(campiValidi, { ip }))).status).toBe(429);
  });

  it("campi non validi: 422 con un errore per campo, niente salvato", async () => {
    const res = await POST(richiesta({ ...campiValidi, nome: "", telefono: "02 123", privacy: "" }));
    expect(res.status).toBe(422);
    const corpo = await res.json();
    expect(Object.keys(corpo.errori).sort()).toEqual(["nome", "privacy", "telefono"]);
    expect(await salvate()).toHaveLength(0);
  });

  it("senza JavaScript (niente Accept JSON, niente tempo di inizio) risponde con una pagina HTML", async () => {
    const res = await POST(richiesta(campiValidi, { json: false, iniziatoMsFa: null }));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    const html = await res.text();
    expect(html).toContain("Grazie, Mario Prova. Ti richiamiamo entro due giorni lavorativi.");
    expect(await salvate()).toHaveLength(1);
  });

  it("la pagina HTML di errore elenca gli errori ed esegue l'escape dei valori", async () => {
    const res = await POST(
      richiesta({ ...campiValidi, comune: "" }, { json: false, iniziatoMsFa: null }),
    );
    expect(res.status).toBe(422);
    const html = await res.text();
    expect(html).toContain("Scrivi il comune.");
    expect(html).toContain('href="/#candidatura"');

    const ok = await POST(
      richiesta({ ...campiValidi, nome: "<b>Mario</b>" }, { json: false, iniziatoMsFa: null }),
    );
    const okHtml = await ok.text();
    expect(okHtml).not.toContain("<b>Mario</b>");
    expect(okHtml).toContain("&lt;b&gt;Mario&lt;/b&gt;");
  });
});
