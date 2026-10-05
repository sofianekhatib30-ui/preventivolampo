import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ExpectedCase } from "@/lib/banco/schema";
import { PriceList } from "@/lib/listino/schema";
import { elabora } from "@/lib/motore";
import { candidatesFor } from "@/lib/motore/candidati";
import type { ToolCaller } from "@/lib/motore/claude";
import { scoreCase } from "@/lib/motore/confronto";
import { splitVat, vatRegime } from "@/lib/motore/iva";
import type { Draft } from "@/lib/motore/tipi";

// Test del motore senza rete: Claude è sostituito da un finto che restituisce uscite scritte qui.

const list = PriceList.parse(JSON.parse(readFileSync("dati/listino.json", "utf8")));
const byCode = new Map(list.items.map((i) => [i.code, i]));

function fakeClaude(extraction: unknown, choices: (lines: number) => unknown): ToolCaller {
  return async ({ tool, user }) => {
    if (tool.name === "registra_sopralluogo") return { input: extraction, inputTokens: 1000, outputTokens: 300 };
    const n = (user.match(/^Riga \d+:/gm) ?? []).length;
    return { input: { choices: choices(n) }, inputTokens: 2000, outputTokens: 200 };
  };
}

const case03 = {
  customer: { name: "Galli", address: "via Cavour 21, Seregno" },
  vat: { dwelling: true, intervention: "manutenzione_ordinaria", goodsBoughtBy: "cliente" },
  lines: [
    { spoken: "smonto el cess vecchio", work: "rimozione vaso", quantity: 1, unit: "cad", quantityNote: null, clientSuppliesMaterial: false },
    { spoken: "monto quello nuovo", work: "posa vaso a pavimento", quantity: 1, unit: "cad", quantityNote: null, clientSuppliesMaterial: true },
  ],
  exclusions: ["Cassetta esterna: non si tocca"],
  notes: [],
};

describe("motore", () => {
  it("prezzi solo dal listino, «solo posa» quando il cliente fornisce il materiale", async () => {
    const draft = await elabora("…", list, fakeClaude(case03, () => [
      { index: 0, code: "DEM-08", confidence: 0.95, reason: "rimozione sanitario" },
      { index: 1, code: "BAG-01", confidence: 0.9, reason: "vaso a pavimento" },
    ]));
    expect(draft.lines[0].match).toMatchObject({ kind: "listino", code: "DEM-08" });
    expect(draft.lines[0].unitPriceCents).toBe(byCode.get("DEM-08")!.priceCents);
    expect(draft.lines[1].match).toMatchObject({ kind: "da_prezzare", suggestedCode: "BAG-01" });
    expect(draft.lines[1].unitPriceCents).toBeNull();
    expect(draft.vat.regime).toBe("agevolata_10");
    expect(draft.usage).toEqual({ inputTokens: 3000, outputTokens: 500, calls: 2 });
  });

  it("uscita del modello fuori schema = errore, non bozza", async () => {
    const bad = { ...case03, lines: [{ spoken: "x", quantity: "tre" }] };
    await expect(elabora("…", list, fakeClaude(bad, () => []))).rejects.toThrow(/non valida/);
  });

  it("abbinamento con righe mancanti = errore", async () => {
    await expect(
      elabora("…", list, fakeClaude(case03, () => [{ index: 0, code: "DEM-08", confidence: 0.9, reason: "ok ok" }])),
    ).rejects.toThrow(/righe mancanti/);
  });

  it("un codice fuori dai candidati o sotto soglia diventa «da prezzare»", async () => {
    const draft = await elabora("…", list, fakeClaude(case03, () => [
      { index: 0, code: "ELE-12", confidence: 0.99, reason: "codice non proposto dal filtro" },
      { index: 1, code: "BAG-01", confidence: 0.4, reason: "incerto" },
    ]));
    expect(draft.lines.every((l) => l.match.kind === "da_prezzare" && l.unitPriceCents === null)).toBe(true);
  });

  it("misura mancante → domanda; unità diversa dal listino → domanda, mai una conversione", async () => {
    const ex = {
      ...case03,
      vat: { dwelling: true, intervention: null, goodsBoughtBy: null },
      lines: [
        { spoken: "antimuffa su tutto il soffitto del bagno", work: "trattamento antimuffa", quantity: null, unit: "m2", quantityNote: null, clientSuppliesMaterial: false },
        { spoken: "tre crepe da stuccare", work: "stuccatura crepe", quantity: 3, unit: "cad", quantityNote: null, clientSuppliesMaterial: false },
      ],
    };
    const draft = await elabora("…", list, fakeClaude(ex, () => [
      { index: 0, code: "TIN-07", confidence: 0.95, reason: "antimuffa" },
      { index: 1, code: "TIN-08", confidence: 0.9, reason: "stuccatura" },
    ]));
    expect(draft.questions.map((q) => [q.lineIndex, q.kind])).toEqual([
      [0, "quantita_mancante"],
      [1, "unita_mancante"],
    ]);
    expect(draft.lines[1].unit).toBeNull();
    expect(draft.vat.regime).toBeNull();
    expect(draft.vat.missing).toHaveLength(2);
  });
});

describe("filtro sul listino", () => {
  it("propone la voce attesa per quasi tutte le righe del banco", () => {
    let total = 0;
    let hit = 0;
    for (let n = 1; n <= 30; n++) {
      const c = ExpectedCase.parse(JSON.parse(readFileSync(`testset/atteso/${String(n).padStart(2, "0")}.json`, "utf8")));
      for (const l of c.lines) {
        if (l.match.kind !== "listino") continue;
        total++;
        if (candidatesFor(l.spoken, l.unit, list.items).some((x) => x.item.code === (l.match as { code: string }).code)) hit++;
      }
    }
    expect(hit / total).toBeGreaterThanOrEqual(0.97);
  });
});

describe("IVA edile", () => {
  it("esempio dell'Agenzia delle Entrate: 10.000 € di cui 6.000 di beni significativi", () => {
    expect(splitVat("agevolata_10_beni_significativi", 1_000_000, 600_000)).toEqual({
      taxableCents: 1_000_000,
      at10Cents: 800_000,
      at22Cents: 200_000,
      vatCents: 124_000,
      totalCents: 1_124_000,
    });
  });
  it("beni significativi sotto la metà: tutto al 10%", () => {
    expect(splitVat("agevolata_10_beni_significativi", 1_000_000, 400_000).at22Cents).toBe(0);
  });
  it("regime dalle tre risposte, null se ne manca una", () => {
    expect(vatRegime({ dwelling: false, intervention: "manutenzione_ordinaria", goodsBoughtBy: "impresa" }, true)).toBe("ordinaria_22");
    expect(vatRegime({ dwelling: true, intervention: "ristrutturazione", goodsBoughtBy: "impresa" }, true)).toBe("agevolata_10");
    expect(vatRegime({ dwelling: true, intervention: "manutenzione_straordinaria", goodsBoughtBy: "impresa" }, true)).toBe(
      "agevolata_10_beni_significativi",
    );
    expect(vatRegime({ dwelling: true, intervention: null, goodsBoughtBy: "impresa" }, true)).toBeNull();
  });
});

describe("confronto con l'atteso", () => {
  it("una bozza identica all'atteso prende il massimo", () => {
    const exp = ExpectedCase.parse(JSON.parse(readFileSync("testset/atteso/12.json", "utf8")));
    const draft: Draft = {
      customer: exp.customer,
      vat: { context: exp.vat.context, regime: exp.vat.expectedRegime, missing: [] },
      lines: exp.lines.map((l) => ({
        spoken: l.spoken,
        work: l.spoken,
        quantity: l.quantity,
        unit: l.unit,
        quantityNote: null,
        clientSuppliesMaterial: l.clientSuppliesMaterial,
        candidates: [],
        match:
          l.match.kind === "listino"
            ? { kind: "listino" as const, code: l.match.code, confidence: 1 }
            : { kind: "da_prezzare" as const, reason: l.match.reason, suggestedCode: null, confidence: 1 },
        unitPriceCents: l.match.kind === "listino" ? byCode.get(l.match.code)!.priceCents : null,
      })),
      questions: exp.questions.map((q) => ({ ...q, text: "?" })),
      exclusions: [],
      notes: [],
      usage: { inputTokens: 0, outputTokens: 0, calls: 0 },
      model: "finto",
      elapsedMs: 0,
    };
    const s = scoreCase(exp, draft, byCode);
    expect([s.linesPerfect, s.falseMatches, s.inventedPrices, s.questionsOk, s.questionsExtra, s.regimeOk]).toEqual([
      exp.lines.length, 0, 0, exp.questions.length, 0, true,
    ]);
  });
});
