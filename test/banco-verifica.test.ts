import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ExpectedCase } from "@/lib/banco/schema";
import { PriceList } from "@/lib/listino/schema";

// Banco di verifica: 6 casi nuovi scritti dopo le modifiche al motore e prima di misurarle.
const list = PriceList.parse(JSON.parse(readFileSync("dati/listino.json", "utf8")));
const codici = new Map(list.items.map((i) => [i.code, i]));
const files = readdirSync("testset/verifica/atteso").filter((f) => f.endsWith(".json")).sort();

describe("banco di verifica", () => {
  it("ha 6 casi, ognuno col suo copione, e non riusa gli id del banco principale", () => {
    expect(files).toHaveLength(6);
    for (const f of files) {
      expect(existsSync(`testset/verifica/copioni/${f.replace(".json", ".md")}`), f).toBe(true);
      expect(existsSync(`testset/atteso/${f}`), f).toBe(false);
    }
  });

  it.each(files)("%s: atteso valido e coerente col listino", (f) => {
    const c = ExpectedCase.parse(JSON.parse(readFileSync(`testset/verifica/atteso/${f}`, "utf8")));
    for (const l of c.lines) {
      if (l.match.kind !== "listino") continue;
      const voce = codici.get(l.match.code);
      expect(voce, l.match.code).toBeDefined();
      if (l.unit) expect(l.unit, l.match.code).toBe(voce!.unit);
    }
  });
});
