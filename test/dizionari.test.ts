import { describe, expect, it as caso } from "vitest";
import { DIZIONARI } from "@/lib/i18n/dizionari";
import { it } from "@/lib/i18n/it";
import { LINGUE_SITO } from "@/lib/i18n/lingue";
import { impronta } from "../scripts/traduci-dizionario";

// Ogni lingua ha esattamente le chiavi dell'italiano, con gli stessi segnaposto, link e grassetti,
// e senza la lineetta lunga. Un dizionario mancante o vecchio fa fallire qui, non sul sito.

type Albero = string | Albero[] | { [k: string]: Albero };
function foglie(n: Albero, via = "", out = new Map<string, string>()): Map<string, string> {
  if (typeof n === "string") out.set(via, n);
  else if (Array.isArray(n)) n.forEach((x, i) => foglie(x, `${via}.${i}`, out));
  else for (const [k, v] of Object.entries(n)) foglie(v, via ? `${via}.${k}` : k, out);
  return out;
}

const base = foglie(it as unknown as Albero);

describe("dizionari", () => {
  caso("l'italiano non usa la lineetta lunga", () => {
    expect([...base].filter(([, t]) => t.includes("—")).map(([k]) => k)).toEqual([]);
  });
  caso.each(LINGUE_SITO.filter((l) => l !== "it"))("%s: stesse chiavi, stessi segni, niente lineetta lunga", (l) => {
    const d = foglie(DIZIONARI[l] as unknown as Albero);
    expect([...base.keys()].filter((k) => !d.has(k)), "chiavi mancanti").toEqual([]);
    expect([...d.keys()].filter((k) => !base.has(k)), "chiavi in più").toEqual([]);
    const segni = [...base].filter(([k, t]) => impronta(t) !== impronta(d.get(k) ?? "")).map(([k]) => k);
    expect(segni, "segnaposto, link o grassetti diversi").toEqual([]);
    expect([...d].filter(([, t]) => t.includes("—")).map(([k]) => k)).toEqual([]);
    // I tipi di blocco delle pagine legali non si traducono.
    const tipi = [...d].filter(([k]) => k.endsWith(".t"));
    expect(tipi.every(([k, t]) => t === base.get(k))).toBe(true);
  });
});
