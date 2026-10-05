import type { PriceListItem } from "@/lib/listino/schema";
import { normalize, tokens } from "./testo";

// Filtro deterministico: dalla riga detta ai candidati del listino.
// Il modello sceglie solo fra questi: una voce che il filtro non propone non può comparire.

export type Candidate = { item: PriceListItem; score: number };

// Verbi di cantiere che significano «togliere»: aggiungono le parole del listino per rimozioni e demolizioni.
const REMOVAL = /\b(tolg|togli|tolt|lev[aoi]|smont|rimuov|rimozion|demol|spacc|butt\w* giu|scrost|spiccon)/;

export function expandText(text: string): string {
  return REMOVAL.test(normalize(text)) ? `${text} rimozione demolizione` : text;
}

export function scoreItem(rawText: string, unit: string | null, item: PriceListItem): number {
  const text = expandText(rawText);
  const said = tokens(text);
  if (said.length === 0) return 0;
  const saidSet = new Set(said);
  const norm = normalize(text);
  let score = 0;
  // Sinonimi detti quasi alla lettera: il segnale più forte.
  for (const syn of item.synonyms) {
    const s = normalize(syn);
    if (s.length > 2 && norm.includes(s)) score += 3;
    const st = tokens(syn);
    const hit = st.filter((t) => saidSet.has(t)).length;
    if (st.length > 0) score += (hit / st.length) * 1.5;
  }
  const nameTokens = new Set(tokens(item.name));
  const descTokens = new Set(tokens(item.description));
  for (const t of saidSet) {
    if (nameTokens.has(t)) score += 1;
    else if (descTokens.has(t)) score += 0.4;
  }
  if (unit && unit === item.unit) score += 0.5;
  return score;
}

export function candidatesFor(text: string, unit: string | null, items: PriceListItem[], limit = 8): Candidate[] {
  return items
    .map((item) => ({ item, score: scoreItem(text, unit, item) }))
    .filter((c) => c.score > 0.5)
    .sort((a, b) => b.score - a.score || a.item.code.localeCompare(b.item.code))
    .slice(0, limit);
}
