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
    expect(mergeSameItem([riga("carotaggio", null, 1), riga("carotaggio", null, 1)])).toHaveLength(2);
  });
});
