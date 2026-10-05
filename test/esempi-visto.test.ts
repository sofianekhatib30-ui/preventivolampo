import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { POST as visto } from "@/app/api/accetta/[token]/visto/route";
import { POST as elabora } from "@/app/api/elabora/route";
import { leggi, salva } from "@/lib/preventivi/archivio";
import { creaDaEsempio } from "@/lib/preventivi/servizio";

// Esempi del banco senza chiamate all'API e «visto» del cliente per la linea del tempo.

let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "esempi-"));
  process.env.PREVENTIVI_DIR = path.join(dir, "preventivi");
  process.env.PROVA_CODICE = "cantiere-42";
});
afterAll(async () => {
  delete process.env.PREVENTIVI_DIR;
  delete process.env.PROVA_CODICE;
  await rm(dir, { recursive: true, force: true });
});

describe("esempi del banco di prova", () => {
  it("la bozza nasce dall'uscita registrata, con i prezzi del listino e senza codice", async () => {
    const res = await elabora(
      new Request("http://localhost/api/elabora", { method: "POST", headers: { "x-forwarded-for": "198.51.100.7" }, body: JSON.stringify({ esempio: "03" }) }),
    );
    expect(res.status).toBe(201);
    const { id } = (await res.json()) as { id: string };
    const p = await leggi(id);
    expect(p?.origine).toEqual({ tipo: "esempio", caso: "03" });
    expect(p?.stato).toBe("bozza");
    expect(p!.righe.length).toBeGreaterThan(0);
  });

  it("un esempio inesistente è un errore chiaro, non una bozza vuota", async () => {
    await expect(creaDaEsempio("99")).rejects.toThrow("Esempio inesistente");
    await expect(creaDaEsempio("../x")).rejects.toThrow("Esempio inesistente");
  });

  it("il testo libero chiede ancora il codice", async () => {
    const res = await elabora(
      new Request("http://localhost/api/elabora", { method: "POST", headers: { "x-forwarded-for": "198.51.100.8" }, body: JSON.stringify({ testo: "Bagno della signora Rossi, rifacimento completo del rivestimento." }) }),
    );
    expect(res.status).toBe(401);
  });
});

describe("visto dal cliente", () => {
  it("si segna una volta sola e solo sui preventivi approvati", async () => {
    const p = await creaDaEsempio("03");
    await salva({ ...p, stato: "approvato", approvatoIl: new Date().toISOString(), tokenAccettazione: "tokEsempioVisto0001aaa" });
    const chiama = () => visto(new Request("http://localhost", { method: "POST" }), { params: Promise.resolve({ token: "tokEsempioVisto0001aaa" }) });
    expect((await chiama()).status).toBe(204);
    const primo = (await leggi(p.id))!.vistoIl;
    expect(primo).toBeTruthy();
    await chiama();
    expect((await leggi(p.id))!.vistoIl).toBe(primo);
  });
});
