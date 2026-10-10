import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXTRACTION_SYSTEM } from "@/lib/motore/estrazione";
import type { ToolCaller } from "@/lib/motore/claude";
import { leggi } from "@/lib/preventivi/archivio";
import { demo } from "@/lib/preventivi/demo";
import { LINGUE, mancanzaTraduzione, TESTI, traduzioneAllineata } from "@/lib/preventivi/lingua";
import { generaPdf } from "@/lib/preventivi/pdf";
import { recesso } from "@/lib/preventivi/recesso";
import { aggiornaBozza, approvaIn, creaDaTesto, traduciIn } from "@/lib/preventivi/servizio";
import { istruzioni, traduciVoci } from "@/lib/preventivi/traduzione";

// Preventivo nella lingua del cliente: italiano sempre presente e prevalente, traduzione che
// l'artigiano vede prima di approvare, e che scade se le voci cambiano. Claude è un finto.

let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "lingue-"));
  process.env.PREVENTIVI_DIR = path.join(dir, "preventivi");
});
afterAll(async () => {
  delete process.env.PREVENTIVI_DIR;
  await rm(dir, { recursive: true, force: true });
});

const motore: ToolCaller = async ({ tool }) =>
  tool.name === "registra_sopralluogo"
    ? {
        input: {
          customer: { name: "Müller", address: "via Roma 3" },
          clientKind: "privato",
          vat: { dwelling: true, intervention: "manutenzione_ordinaria", goodsBoughtBy: "impresa" },
          lines: [
            { spoken: "nimm die alten Fliesen weg", work: "rimozione rivestimento in piastrelle", quantity: 12, unit: "m2", quantityNote: null, clientSuppliesMaterial: false },
            { spoken: "zwei Anstriche", work: "tinteggiatura pareti", quantity: 40, unit: "m2", quantityNote: null, clientSuppliesMaterial: false },
          ],
          exclusions: ["Mobili da spostare a cura del cliente"],
          notes: [],
        },
        inputTokens: 100,
        outputTokens: 50,
      }
    : { input: { choices: [{ index: 0, code: "DEM-05", confidence: 0.95, reason: "rivestimento" }, { index: 1, code: "TIN-01", confidence: 0.9, reason: "pittura" }] }, inputTokens: 100, outputTokens: 50 };

const traduttore =
  (righe: string[], esclusioni: string[]): ToolCaller =>
  async ({ tool }) => {
    expect(tool.name).toBe("registra_traduzione");
    return { input: { righe, esclusioni }, inputTokens: 10, outputTokens: 10 };
  };

describe("testi fissi per lingua", () => {
  it("ogni lingua straniera ha tutti i testi, con la clausola che fa prevalere l'italiano", () => {
    for (const l of LINGUE) {
      if (l === "it") continue;
      const t = TESTI[l];
      expect(t.prevalenza.length).toBeGreaterThan(40);
      expect(t.accetta.letto.length).toBeGreaterThan(40);
      expect(t.messaggio("Müller", "2026-001", "1.000,00 €", "https://x/accetta/y")).toContain("https://x/accetta/y");
      expect(t.regime.agevolata_10_beni_significativi).toContain("beni significativi");
    }
  });
  it("il prompt di traduzione fissa i termini a rischio e vieta di aggiungere o togliere", () => {
    const s = istruzioni("en");
    expect(s).toContain("floor screed");
    expect(s).toMatch(/mai unire, dividere, saltare o aggiungere/);
  });
  it("il motore sa che il racconto può essere in un'altra lingua, e scrive le voci in italiano", () => {
    expect(EXTRACTION_SYSTEM).toMatch(/un'altra lingua[\s\S]*work, quantityNote, exclusions e notes sempre in italiano/);
  });
});

describe("recesso", () => {
  const k = { nome: "Edil Prova", indirizzo: "via Roma 1", telefono: "+39 333 0000000", email: "info@example.com" };
  it.each([...LINGUE])("%s: informazioni complete, contatti dell'impresa e numero del preventivo nel modulo", (l) => {
    const r = recesso(l, k, "2026-007");
    expect(r.paragrafi.join(" ")).toMatch(/14/);
    expect(r.paragrafi.join(" ")).toContain("info@example.com");
    expect(r.effetti).toHaveLength(2);
    expect(r.modulo.righe.join(" ")).toContain("2026-007");
    expect(r.modulo.righe[0]).toContain("Edil Prova");
  });
});

describe("traduzione allineata alle voci", () => {
  const base = { righe: [{ work: "tinteggiatura pareti" }], esclusioni: [] as string[] };
  it("in italiano non serve", () => {
    expect(traduzioneAllineata(base)).toBe(true);
    expect(mancanzaTraduzione(base)).toBeNull();
  });
  it("cliente straniero senza traduzione: si chiede di tradurre", () => {
    expect(mancanzaTraduzione({ ...base, lingua: "en" })).toBe("traduci il preventivo in inglese");
  });
  it("voce cambiata dopo la traduzione: è da rifare", () => {
    const t = { lingua: "en" as const, righe: ["wall painting"], esclusioni: [], sorgente: { righe: ["tinteggiatura soffitto"], esclusioni: [] } };
    expect(traduzioneAllineata({ ...base, lingua: "en", traduzione: t })).toBe(false);
    expect(mancanzaTraduzione({ ...base, lingua: "en", traduzione: t })).toMatch(/da rifare/);
  });
  it("traduzione vuota su una voce: non va", () => {
    const t = { lingua: "en" as const, righe: ["  "], esclusioni: [], sorgente: { righe: ["tinteggiatura pareti"], esclusioni: [] } };
    expect(traduzioneAllineata({ ...base, lingua: "en", traduzione: t })).toBe(false);
  });
  it("il modello che salta una voce è un errore, non una traduzione a metà", async () => {
    await expect(traduciVoci({ righe: [{ work: "a" }, { work: "b" }] as never, esclusioni: [] }, "en", traduttore(["only one"], []))).rejects.toThrow(/non è venuta bene/);
  });
});

describe("dal sopralluogo al PDF bilingue", () => {
  it("non si approva senza traduzione; con la traduzione il PDF è bilingue e l'italiano resta", async () => {
    const p = await creaDaTesto("Sopralluogo inventato per un cliente inglese, bagno e pittura.", motore);
    await aggiornaBozza(p.id, { cliente: p.cliente, iva: p.iva, righe: p.righe, esclusioni: p.esclusioni, lingua: "en" });
    await expect(approvaIn(demo, p.id)).rejects.toThrow(/traduci il preventivo in inglese/);

    const tradotto = await traduciIn(demo, p.id, "en", traduttore(["Removal of wall tiles", "Wall painting"], ["Furniture moved by the client"]));
    expect(tradotto.traduzione?.sorgente.righe).toEqual(p.righe.map((r) => r.work));

    // L'artigiano cambia una voce: la traduzione scade e l'approvazione si ferma di nuovo.
    const righe = p.righe.map((r, i) => (i === 1 ? { ...r, work: "tinteggiatura pareti e soffitti" } : r));
    await aggiornaBozza(p.id, { cliente: p.cliente, iva: p.iva, righe, esclusioni: p.esclusioni, lingua: "en", traduzione: tradotto.traduzione });
    await expect(approvaIn(demo, p.id)).rejects.toThrow(/da rifare/);

    await traduciIn(demo, p.id, "en", traduttore(["Removal of wall tiles", "Painting of walls and ceilings"], ["Furniture moved by the client"]));
    const approvato = await approvaIn(demo, p.id);
    expect(approvato.stato).toBe("approvato");

    const salvato = (await leggi(p.id))!;
    const bytes = await generaPdf(salvato, await demo.azienda());
    const doc = await PDFDocument.load(bytes);
    // Preventivo, recesso in italiano, recesso nella lingua del cliente.
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(3);
    await writeFile(path.join(dir, "bilingue.pdf"), bytes);
    if (process.env.PDF_PROVA) await writeFile(process.env.PDF_PROVA, bytes);

    // Lo stesso preventivo in italiano: il PDF bilingue è più lungo, perché aggiunge e non sostituisce.
    const soloItaliano = await generaPdf({ ...salvato, lingua: "it", traduzione: null }, await demo.azienda());
    expect(bytes.length).toBeGreaterThan(soloItaliano.length);
  });

  it("tornare all'italiano toglie la traduzione", async () => {
    const p = await creaDaTesto("Sopralluogo inventato per un cliente che poi parla italiano.", motore);
    await traduciIn(demo, p.id, "en", traduttore(["Removal of wall tiles", "Wall painting"], ["Furniture moved by the client"]));
    const it = await traduciIn(demo, p.id, "it", traduttore([], []));
    expect(it.lingua).toBe("it");
    expect(it.traduzione).toBeNull();
  });
});

describe("totali lunghi nel PDF", () => {
  it("con molte righe, rivalsa, più aliquote e netto nulla esce dalla pagina", async () => {
    const { profiloDa } = await import("@/lib/fisco/profilo");
    const { CONTESTO_VUOTO } = await import("@/lib/fisco/schema");
    const base = await creaDaTesto("Sopralluogo inventato con tante voci da mettere in pagina.", motore);
    const profilo = profiloDa({ regime_fiscale: "ordinario", ritenuta: true, rivalsa_inps: true, mestieri: ["Grafica e siti web"] });
    // Il blocco dei totali cade in punti diversi della pagina secondo quante righe ci sono: si provano tutti.
    const casi = Array.from({ length: 24 }, (_, k) => {
      const righe = Array.from({ length: 26 + k }, (_, i) => ({ ...base.righe[0], work: `voce ${i}`, quantity: 1, unit: "cad" as const, unitPriceCents: 1000, aliquota: (["22", "10", "4", "esente"] as const)[i % 4] }));
      return {
        ...base,
        righe,
        stato: "approvato" as const,
        approvatoIl: new Date().toISOString(),
        lingua: "en" as const,
        traduzione: { lingua: "en" as const, righe: righe.map((r) => `${r.work} EN`), esclusioni: base.esclusioni.map((e) => `${e} EN`), sorgente: { righe: righe.map((r) => r.work), esclusioni: base.esclusioni } },
        fisco: { contesto: { ...CONTESTO_VUOTO, cliente: "impresa" as const, oggetto: "nessuno" as const }, profilo },
      };
    });
    // Ogni testo scritto nel PDF sta dentro la pagina: si registrano le coordinate di ogni drawText.
    const { PDFPage } = await import("pdf-lib");
    const ys: number[] = [];
    const originale = PDFPage.prototype.drawText;
    PDFPage.prototype.drawText = function (t, o) {
      ys.push(o?.y ?? 0);
      return originale.call(this, t, o);
    };
    try {
      for (const p of casi) await generaPdf(p, await demo.azienda());
    } finally {
      PDFPage.prototype.drawText = originale;
    }
    expect(ys.length).toBeGreaterThan(100);
    expect(Math.min(...ys)).toBeGreaterThan(0);
  });
});
