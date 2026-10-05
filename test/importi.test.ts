import { describe, expect, it } from "vitest";
import { computeTotals, formatEuro, lineAmountCents } from "@/lib/importi";

describe("lineAmountCents", () => {
  it("moltiplica quantità decimali per il prezzo in centesimi e arrotonda al centesimo", () => {
    expect(lineAmountCents({ quantity: 7.5, unitPriceCents: 2345 })).toBe(17588);
    expect(lineAmountCents({ quantity: 0.1, unitPriceCents: 3 })).toBe(0);
    expect(lineAmountCents({ quantity: 3, unitPriceCents: 0 })).toBe(0);
  });

  it("rifiuta prezzi non interi o negativi e quantità negative", () => {
    expect(() => lineAmountCents({ quantity: 1, unitPriceCents: 12.5 })).toThrow();
    expect(() => lineAmountCents({ quantity: 1, unitPriceCents: -1 })).toThrow();
    expect(() => lineAmountCents({ quantity: -2, unitPriceCents: 100 })).toThrow();
    expect(() => lineAmountCents({ quantity: Number.NaN, unitPriceCents: 100 })).toThrow();
  });
});

describe("computeTotals", () => {
  const lines = [
    { quantity: 12, unitPriceCents: 1850 },
    { quantity: 2.5, unitPriceCents: 4210 },
  ];

  it("usa l'aliquota passata dal preventivo, qualunque sia", () => {
    expect(computeTotals(lines, 10)).toEqual({ taxableCents: 32725, vatCents: 3273, totalCents: 35998 });
    expect(computeTotals(lines, 22)).toEqual({ taxableCents: 32725, vatCents: 7200, totalCents: 39925 });
    expect(computeTotals(lines, 0)).toEqual({ taxableCents: 32725, vatCents: 0, totalCents: 32725 });
  });

  it("un preventivo senza righe vale zero", () => {
    expect(computeTotals([], 22)).toEqual({ taxableCents: 0, vatCents: 0, totalCents: 0 });
  });

  it("rifiuta un'aliquota fuori intervallo", () => {
    expect(() => computeTotals(lines, -1)).toThrow();
    expect(() => computeTotals(lines, 101)).toThrow();
  });
});

describe("formatEuro", () => {
  it("formatta in euro all'italiana", () => {
    expect(formatEuro(399250).replace(/\s/g, " ")).toBe("3.992,50 €");
  });
});
