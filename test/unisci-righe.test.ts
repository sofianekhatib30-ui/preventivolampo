import { describe, expect, it } from "vitest";
import { mergeSameItem } from "@/lib/motore";
import type { DraftLine } from "@/lib/motore/tipi";

const riga = (spoken: string, code: string | null, quantity: number | null, unit: DraftLine["unit"] = "cad"): DraftLine =>
  ({
    spoken,
    work: spoken,
    quantity,
    unit,
    quantityNote: null,
    clientSuppliesMaterial: false,
    candidates: [],
    unitPriceCents: code ? 1000 : null,
    match: code ? { kind: "listino", code, confidence: 0.9 } : { kind: "da_prezzare", reason: "x", suggestedCode: null, confidence: 0 },
  }) as DraftLine;

describe("una voce, una riga", () => {
  it("somma due righe con la stessa voce e la stessa unità", () => {
    const out = mergeSameItem([riga("presa per il forno", "CUC-06", 1), riga("una per la lavastoviglie", "CUC-06", 1)]);
    expect(out).toHaveLength(1);
    expect(out[0].quantity).toBe(2);
    expect(out[0].spoken).toContain("lavastoviglie");
  });

  it("toglie il doppione con le stesse parole e la stessa quantità", () => {
    const out = mergeSameItem([riga("il parquet della sala da lamare", "PAV-07", 39.5, "m2"), riga("Il parquet della sala da lamare", "PAV-07", 39.5, "m2")]);
    expect(out).toHaveLength(1);
    expect(out[0].quantity).toBe(39.5);
  });

  it("lascia separate le righe senza quantità, con unità diverse o da prezzare", () => {
    expect(mergeSameItem([riga("bianco in camera", "TIN-01", 30, "m2"), riga("bianco nel corridoio", "TIN-01", null, "m2")])).toHaveLength(2);
    expect(mergeSameItem([riga("cavo", "ELE-13", 10, "m"), riga("cavo", "ELE-13", 2, "h")])).toHaveLength(2);
    expect(mergeSameItem([riga("carotaggio in cucina", null, 1), riga("carotaggio in bagno", null, 1)])).toHaveLength(2);
  });

  it("toglie il doppione esatto anche senza quantità o da prezzare", () => {
    expect(mergeSameItem([riga("La camera non l'ho misurata", "TIN-01", null, "m2"), riga("la camera non l'ho misurata.", "TIN-01", null, "m2")])).toHaveLength(1);
    expect(mergeSameItem([riga("carotaggio", null, 1), riga("carotaggio", null, 1)])).toHaveLength(1);
    expect(mergeSameItem([riga("la camera non l'ho misurata, pareti e soffitto, stesso bianco", "TIN-01", null, "m2"), riga("la camera non l'ho misurata, pareti uguale, stesso bianco", "TIN-01", null, "m2")])).toHaveLength(1);
  });

  it("un accessorio staccato («col telaio», «con la placca») non raddoppia il pezzo", () => {
    const out = mergeSameItem([riga("il vaso sospeso", "BAG-02", 1), riga("col telaio", "BAG-02", 1)]);
    expect(out).toHaveLength(1);
    expect(out[0].quantity).toBe(1);
    expect(mergeSameItem([riga("la cassetta a incasso", "BAG-03", 1), riga("con la placca", "BAG-03", 1)])[0].quantity).toBe(1);
    // «con altre due» invece aggiunge pezzi.
    expect(mergeSameItem([riga("una presa", "ELE-06", 1), riga("con altre due prese", "ELE-06", 2)])[0].quantity).toBe(3);
  });
});
