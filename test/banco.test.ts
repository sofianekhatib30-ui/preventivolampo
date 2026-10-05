import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ExpectedCase } from "@/lib/banco/schema";

// Misura di chiusura di F2: 30 copioni e 30 attesi coerenti con il listino.

const listino: { items: Array<{ code: string; unit: string; significantGood: boolean }> } = JSON.parse(
  readFileSync("dati/listino.json", "utf8"),
);
const byCode = new Map(listino.items.map((i) => [i.code, i]));

const expectedFiles = existsSync("testset/atteso")
  ? readdirSync("testset/atteso").filter((f) => f.endsWith(".json")).sort()
  : [];
const cases = expectedFiles.map((file) => ({ file, raw: JSON.parse(readFileSync(`testset/atteso/${file}`, "utf8")) }));

describe("banco di prova", () => {
  it("ha 30 attesi, da 01 a 30, ognuno con il suo copione", () => {
    const ids = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, "0"));
    expect(expectedFiles).toEqual(ids.map((id) => `${id}.json`));
    for (const id of ids) expect(existsSync(`testset/copioni/${id}.md`), id).toBe(true);
  });

  it.each(cases)("$file rispetta lo schema e l'id coincide col nome del file", ({ file, raw }) => {
    const parsed = ExpectedCase.safeParse(raw);
    expect(parsed.error?.issues ?? []).toEqual([]);
    expect(`${raw.id}.json`).toBe(file);
  });

  it.each(cases)("$file abbina solo codici che esistono nel listino, con l'unità del listino", ({ raw }) => {
    for (const line of raw.lines ?? []) {
      if (line.match?.kind !== "listino") continue;
      const item = byCode.get(line.match.code);
      expect(item, line.match.code).toBeDefined();
      if (line.unit !== null) expect(line.unit, `${line.match.code}: ${line.spoken}`).toBe(item?.unit);
    }
  });

  it("copre i casi che il prodotto promette di gestire", () => {
    const count = (tag: string) => cases.filter((c) => c.raw.tags?.includes(tag)).length;
    expect(count("misura_mancante")).toBeGreaterThanOrEqual(5);
    expect(count("bene_significativo")).toBeGreaterThanOrEqual(5);
    expect(count("fuori_listino")).toBeGreaterThanOrEqual(5);
    expect(count("esclusione")).toBeGreaterThanOrEqual(3);
    expect(count("materiale_cliente")).toBeGreaterThanOrEqual(3);
    expect(count("dialetto")).toBeGreaterThanOrEqual(5);
    expect(count("misura_approssimata")).toBeGreaterThanOrEqual(5);
  });

  // Regole del regime usate per scrivere gli attesi (da far verificare a Notaio).
  it.each(cases)("$file: il regime IVA atteso discende dal contesto", ({ raw }) => {
    const { dwelling, intervention, goodsBoughtBy } = raw.vat.context;
    const lines: Array<{ match: { kind: string; code?: string } }> = raw.lines;
    const hasSignificant = lines.some((l) => l.match.kind === "listino" && byCode.get(l.match.code ?? "")?.significantGood);
    let expected: string | null;
    if (dwelling === null || intervention === null || goodsBoughtBy === null) expected = null;
    else if (!dwelling) expected = intervention === "ristrutturazione" ? "NON_PREVISTO" : "ordinaria_22";
    else if (intervention === "ristrutturazione") expected = "agevolata_10";
    else if (goodsBoughtBy === "impresa" && hasSignificant) expected = "agevolata_10_beni_significativi";
    else expected = "agevolata_10";
    expect(raw.vat.expectedRegime).toBe(expected);
    expect(raw.tags.includes("non_abitazione")).toBe(dwelling === false);
  });

  it.each(cases)("$file: i tag dichiarati corrispondono al contenuto", ({ raw }) => {
    const lines: Array<{ quantity: unknown; unit: unknown; match: { kind: string; code?: string }; clientSuppliesMaterial: boolean }> =
      raw.lines ?? [];
    const hasMissing = lines.some((l) => l.quantity === null || l.unit === null);
    const hasOffList = lines.some((l) => l.match.kind === "da_prezzare");
    const hasSignificant = lines.some((l) => l.match.kind === "listino" && byCode.get(l.match.code ?? "")?.significantGood);
    const hasClientMaterial = lines.some((l) => l.clientSuppliesMaterial);
    expect(raw.tags.includes("misura_mancante")).toBe(hasMissing);
    expect(raw.tags.includes("fuori_listino")).toBe(hasOffList);
    expect(raw.tags.includes("bene_significativo")).toBe(hasSignificant);
    expect(raw.tags.includes("materiale_cliente")).toBe(hasClientMaterial);
    if (raw.tags.includes("esclusione")) expect(raw.exclusions.length).toBeGreaterThan(0);
  });
});
