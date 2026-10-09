import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { ESEMPI } from "@/lib/contenuti/esempi";
import { contenutiIt } from "@/lib/contenuti/it";
import { FUNZIONI, GUIDE, MESTIERI, percorsiPubblici, SLUG_MESTIERE } from "@/lib/contenuti/registro";
import { CHIAVI_FISSE } from "@/lib/contenuti/tipi";
import { LINGUE_INDICIZZATE, LINGUE_SITO, percorso, togliLingua } from "@/lib/i18n/lingue";
import { SEZIONI_CLIENT_PUBBLICHE } from "@/lib/i18n/server";
import { decidi } from "@/proxy";

type Albero = string | number | boolean | null | Albero[] | { [k: string]: Albero };

function foglie(nodo: Albero, via: string[] = [], out = new Map<string, string>()): Map<string, string> {
  if (typeof nodo === "string") out.set(via.join("."), nodo);
  else if (Array.isArray(nodo)) nodo.forEach((n, i) => foglie(n, [...via, String(i)], out));
  else if (nodo && typeof nodo === "object") for (const [k, v] of Object.entries(nodo)) foglie(v, [...via, k], out);
  return out;
}

const IT = foglie(contenutiIt as unknown as Albero);
const leggi = (l: string) => JSON.parse(readFileSync(path.join("lib/contenuti", `${l}.json`), "utf8")) as Albero;
const fissa = (chiave: string) => chiave.split(".").some((k) => (CHIAVI_FISSE as readonly string[]).includes(k));

describe("contenuti delle pagine: italiano", () => {
  it("nessuna lineetta lunga, nessun luogo vietato, niente tecnologia interna", () => {
    for (const [k, v] of IT) {
      expect(v, k).not.toMatch(/—|\s–\s/);
      expect(v, k).not.toMatch(/Monza|Brianza/i);
      expect(v, k).not.toMatch(/intelligenza artificiale|\bClaude\b|\bAnthropic\b/i);
    }
  });

  it("nelle pagine mestiere nessuna cifra in euro: i prezzi sono dell'artigiano", () => {
    for (const m of MESTIERI) for (const [k, v] of foglie(contenutiIt.mestieri[m] as unknown as Albero)) expect(v, `${m}.${k}`).not.toMatch(/€|\beuro\b/i);
  });

  it("ogni pagina mestiere è completa e i suoi meta stanno nelle misure", () => {
    for (const id of MESTIERI) {
      const m = contenutiIt.mestieri[id];
      expect(m.meta.titolo.length, id).toBeLessThanOrEqual(52);
      expect(m.meta.descrizione.length, id).toBeGreaterThanOrEqual(110);
      expect(m.meta.descrizione.length, id).toBeLessThanOrEqual(160);
      expect(m.voci.righe.length, id).toBeGreaterThanOrEqual(10);
      expect(m.domande.voci.length, id).toBeGreaterThanOrEqual(5);
      expect(m.prezzare.punti.length, id).toBeGreaterThanOrEqual(4);
      expect(m.documenti.punti.length, id).toBeGreaterThanOrEqual(3);
    }
  });

  it("nessuna domanda è uguale su due pagine mestiere diverse", () => {
    const viste = new Map<string, string>();
    for (const id of MESTIERI)
      for (const q of contenutiIt.mestieri[id].domande.voci) {
        const chiave = q.d.toLowerCase();
        expect(viste.get(chiave), `«${q.d}» in ${id} e ${viste.get(chiave)}`).toBeUndefined();
        viste.set(chiave, id);
      }
  });

  it("funzioni e guide hanno meta nelle misure", () => {
    for (const pg of [...FUNZIONI.map((f) => contenutiIt.funzioni[f]), ...GUIDE.map((g) => contenutiIt.guide[g])]) {
      expect(pg.meta.titolo.length, pg.nome).toBeLessThanOrEqual(52);
      expect(pg.meta.descrizione.length, pg.nome).toBeLessThanOrEqual(160);
    }
  });

  it("i link interni portano solo a pagine che esistono", () => {
    const esistenti = new Set(percorsiPubblici());
    for (const [k, v] of IT)
      for (const m of v.matchAll(/\]\((\/[^)\s#]*)/g)) {
        expect(esistenti.has(m[1]), `${k}: ${m[1]}`).toBe(true);
      }
  });

  it("l'esempio di ogni mestiere è stato ricavato dal racconto che la pagina mostra", () => {
    for (const id of MESTIERI) {
      const e = ESEMPI[id];
      expect(e, id).toBeDefined();
      expect(e!.dettatura, id).toBe(contenutiIt.mestieri[id].esempio.dettatura);
      expect(e!.righe.length, id).toBeGreaterThan(0);
    }
  });

  it("ogni mestiere ha il suo modello in PDF ed Excel", () => {
    for (const id of MESTIERI) for (const est of ["pdf", "xlsx"]) expect(existsSync(`public/modelli/${SLUG_MESTIERE[id]}.${est}`), `${id}.${est}`).toBe(true);
  });
});

describe("contenuti delle pagine: traduzioni", () => {
  for (const l of LINGUE_SITO.filter((x) => x !== "it")) {
    it(`${l}: stesse chiavi dell'italiano, parole fisse identiche, segni intatti`, () => {
      const T = foglie(leggi(l));
      expect([...T.keys()].sort()).toEqual([...IT.keys()].sort());
      for (const [k, v] of IT) {
        const t = T.get(k)!;
        if (fissa(k)) expect(t, k).toBe(v);
        expect(t, k).not.toMatch(/—/);
        expect([...t.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]).sort(), k).toEqual([...v.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]).sort());
        expect((t.match(/\*\*/g) ?? []).length, k).toBe((v.match(/\*\*/g) ?? []).length);
      }
    });
  }
});

describe("indirizzi per lingua", () => {
  it("percorso e togliLingua sono uno l'inverso dell'altro", () => {
    expect(percorso("it", "/prezzi")).toBe("/prezzi");
    expect(percorso("ro", "/")).toBe("/ro");
    expect(percorso("ro", "/prezzi")).toBe("/ro/prezzi");
    expect(percorso("sq", "/#candidatura")).toBe("/sq#candidatura");
    expect(togliLingua("/ro/prezzi")).toEqual({ lingua: "ro", resto: "/prezzi" });
    expect(togliLingua("/ro")).toEqual({ lingua: "ro", resto: "/" });
    expect(togliLingua("/prezzi")).toEqual({ lingua: null, resto: "/prezzi" });
    expect(togliLingua("/romania")).toEqual({ lingua: null, resto: "/romania" });
  });

  it("il proxy serve l'italiano senza prefisso e rispetta la lingua scelta", () => {
    expect(decidi("/", undefined)).toEqual({ tipo: "riscrivi", a: "/it" });
    expect(decidi("/preventivo-idraulico", undefined)).toEqual({ tipo: "riscrivi", a: "/it/preventivo-idraulico" });
    expect(decidi("/it/prezzi", undefined)).toEqual({ tipo: "redirect", a: "/prezzi", stato: 301 });
    expect(decidi("/ro/prezzi", undefined)).toEqual({ tipo: "ricorda", lingua: "ro" });
    expect(decidi("/ro/prezzi", "ro")).toEqual({ tipo: "passa" });
    expect(decidi("/prezzi", "ro")).toEqual({ tipo: "redirect", a: "/ro/prezzi", stato: 302 });
    expect(decidi("/prezzi", "it")).toEqual({ tipo: "riscrivi", a: "/it/prezzi" });
    expect(decidi("/prezzi", "xx")).toEqual({ tipo: "riscrivi", a: "/it/prezzi" });
    for (const p of ["/area", "/area/listino", "/accedi", "/accetta/abc", "/api/elabora", "/prova", "/revisione/1", "/progetto"]) expect(decidi(p, "ro"), p).toEqual({ tipo: "passa" });
  });

  it("la sitemap elenca solo le lingue indicizzate, con le alternative e x-default", () => {
    const voci = sitemap();
    expect(voci.length).toBe(percorsiPubblici().length * LINGUE_INDICIZZATE.length);
    for (const v of voci) {
      expect(Object.keys(v.alternates!.languages!).sort()).toEqual([...LINGUE_INDICIZZATE, "x-default"].sort());
      expect(v.url).not.toMatch(/\/(ar|uk|es|fr|de|nl)(\/|$)/);
    }
  });
});

describe("dizionario nel browser delle pagine pubbliche", () => {
  it("i componenti del browser delle pagine pubbliche leggono solo le sezioni che viaggiano", () => {
    const cartelle = ["components/home", "components/sito"];
    const file = [...cartelle.flatMap((c) => readdirSync(c, { recursive: true }).map((f) => path.join(c, String(f)))), "components/SceltaLingua.tsx"].filter((f) => f.endsWith(".tsx"));
    for (const f of file) {
      const s = readFileSync(f, "utf8");
      if (!s.startsWith('"use client"')) continue;
      for (const m of s.matchAll(/\b(?:d|diz)\.([a-zA-Z]+)/g)) expect(SEZIONI_CLIENT_PUBBLICHE as readonly string[], `${f}: d.${m[1]}`).toContain(m[1]);
    }
  });
});
