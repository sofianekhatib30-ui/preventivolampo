import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CATEGORIES, PriceList } from "@/lib/listino/schema";

// Misura di chiusura di F1: ogni voce ha prezzo, unità e fonte.

const raw = JSON.parse(readFileSync("dati/listino.json", "utf8"));
const csvRows = readFileSync("ricerca/2026-09-23-prezzi-listino.csv", "utf8").trim().split(/\r?\n/).slice(1);
const csvPriceBySourceCode = new Map(
  csvRows.map((row) => {
    const f = row.split(";");
    return [f[1], f[4]];
  }),
);

describe("listino di prova", () => {
  const parsed = PriceList.safeParse(raw);

  it("rispetta lo schema: ogni voce ha prezzo in centesimi, unità e fonte https", () => {
    expect(parsed.error?.issues ?? []).toEqual([]);
  });

  // Le voci grezze, non quelle validate: se lo schema fallisse, una lista vuota farebbe
  // passare in silenzio i controlli sui prezzi.
  const items: Array<{ code: string; category: string; priceCents: number; source: { sourceCode: string } }> =
    raw.items;

  it("ha circa 80 voci (minimo 75)", () => {
    expect(items.length).toBeGreaterThanOrEqual(75);
  });

  it("copre ogni categoria con almeno 5 voci", () => {
    for (const category of CATEGORIES) {
      expect(items.filter((i) => i.category === category).length, category).toBeGreaterThanOrEqual(5);
    }
  });

  it("non ripete codici interni né codici fonte", () => {
    expect(new Set(items.map((i) => i.code)).size).toBe(items.length);
    expect(new Set(items.map((i) => i.source.sourceCode)).size).toBe(items.length);
  });

  it("ogni prezzo coincide con quello della fonte nel CSV di ricerca (nessun prezzo scritto a mano)", () => {
    for (const item of items) {
      const csvPrice = csvPriceBySourceCode.get(item.source.sourceCode);
      expect(csvPrice, item.code).toBeDefined();
      expect(item.priceCents, item.code).toBe(Math.round(Number(csvPrice) * 100));
    }
  });

  it("marca almeno un bene significativo e almeno un materiale fornibile dal cliente", () => {
    const all: Array<{ significantGood: boolean; clientSuppliable: boolean }> = raw.items;
    expect(all.filter((i) => i.significantGood).length).toBeGreaterThanOrEqual(1);
    expect(all.filter((i) => i.clientSuppliable).length).toBeGreaterThanOrEqual(1);
  });

  it("dichiara che l'impresa è inventata", () => {
    expect(parsed.data?.company.fictitiousNotice).toMatch(/inventata/);
  });
});
