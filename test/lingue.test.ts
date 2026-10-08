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
    const s = istruzioni("de");
    expect(s).toContain("Estrich");
    expect(s).toMatch(/mai unire, dividere, saltare o aggiungere/);
  });
  it("il motore sa che il racconto può essere in un'altra lingua, e scrive le voci in italiano", () => {
    expect(EXTRACTION_SYSTEM).toMatch(/un'altra lingua[\s\S]*work, quantityNote, exclusions e notes sempre in italiano/);
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
    const p = await creaDaTesto("Sopralluogo inventato per un cliente tedesco, bagno e pittura.", motore);
    await aggiornaBozza(p.id, { cliente: p.cliente, iva: p.iva, righe: p.righe, esclusioni: p.esclusioni, lingua: "de" });
    await expect(approvaIn(demo, p.id)).rejects.toThrow(/traduci il preventivo in tedesco/);

    const tradotto = await traduciIn(demo, p.id, "de", traduttore(["Entfernung der Wandfliesen", "Anstrich der Wände"], ["Möbel rückt der Kunde selbst"]));
    expect(tradotto.traduzione?.sorgente.righe).toEqual(p.righe.map((r) => r.work));

    // L'artigiano cambia una voce: la traduzione scade e l'approvazione si ferma di nuovo.
    const righe = p.righe.map((r, i) => (i === 1 ? { ...r, work: "tinteggiatura pareti e soffitti" } : r));
    await aggiornaBozza(p.id, { cliente: p.cliente, iva: p.iva, righe, esclusioni: p.esclusioni, lingua: "de", traduzione: tradotto.traduzione });
    await expect(approvaIn(demo, p.id)).rejects.toThrow(/da rifare/);

    await traduciIn(demo, p.id, "de", traduttore(["Entfernung der Wandfliesen", "Anstrich von Wänden und Decken"], ["Möbel rückt der Kunde selbst"]));
    const approvato = await approvaIn(demo, p.id);
    expect(approvato.stato).toBe("approvato");

    const salvato = (await leggi(p.id))!;
    const bytes = await generaPdf(salvato, await demo.azienda());
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
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
