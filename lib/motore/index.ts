import type { VoceMotore as PriceListItem } from "@/lib/listino/schema";
import { candidatesFor } from "./candidati";
import { chooseMatches } from "./abbinamento";
import { modelName, type ToolCaller } from "./claude";
import { extract } from "./estrazione";
import { missingVatAnswers, vatRegime } from "./iva";
import { jaccard, tokens } from "./testo";
import type { Draft, DraftLine, DraftQuestion } from "./tipi";

// Il motore: trascrizione → estrazione (Claude) → candidati (codice) → scelta (Claude) → regole (codice).
// L'AI propone, l'artigiano decide: i prezzi vengono solo dal listino, le misure mancanti diventano domande.

export const CONFIDENCE_THRESHOLD = 0.6;

const UNIT_LABEL: Record<string, string> = { m2: "m²", m: "metri", m3: "m³", cad: "pezzi", h: "ore", "100kg": "quintali", kg: "kg", l: "litri", corpo: "a corpo" };

export type ListinoMotore = { items: PriceListItem[] };
export type OpzioniMotore = { impresa?: string };

export async function elabora(transcript: string, list: ListinoMotore, call: ToolCaller, opzioni: OpzioniMotore = {}): Promise<Draft> {
  const started = Date.now();
  const byCode = new Map<string, PriceListItem>(list.items.map((i) => [i.code, i]));
  const ex = await extract(transcript, call, opzioni.impresa);
  const candidates = ex.extraction.lines.map((l) => candidatesFor(`${l.work} ${l.spoken}`, l.unit, list.items));
  const mt = await chooseMatches(ex.extraction.lines, candidates, call);

  const lines: DraftLine[] = ex.extraction.lines.map((line, i) => {
    const choice = mt.choices[i];
    const allowed = new Set(candidates[i].map((c) => c.item.code));
    const item = choice.code && allowed.has(choice.code) ? byCode.get(choice.code) : undefined;
    const base = { ...line, candidates: [...allowed] };
    if (!item || choice.confidence < CONFIDENCE_THRESHOLD) {
      return {
        ...base,
        unitPriceCents: null,
        match: {
          kind: "da_prezzare",
          reason: item ? `abbinamento incerto: ${choice.reason}` : `nessuna voce del listino: ${choice.reason}`,
          suggestedCode: item?.code ?? null,
          confidence: choice.confidence,
        },
      };
    }
    if (line.clientSuppliesMaterial && item.clientSuppliable) {
      return {
        ...base,
        unitPriceCents: null,
        match: { kind: "da_prezzare", reason: "solo posa: il listino ha fornitura e posa", suggestedCode: item.code, confidence: choice.confidence },
      };
    }
    // Un numero detto in un'unità diversa da quella della voce non si converte: si chiede.
    const unit = line.unit !== null && line.unit !== item.unit ? null : item.unit;
    return { ...base, unit, unitPriceCents: item.priceCents, match: { kind: "listino", code: item.code, confidence: choice.confidence } };
  });

  const merged = mergeSameItem(lines);
  lines.length = 0;
  lines.push(...merged);

  const questions: DraftQuestion[] = [];
  lines.forEach((l, i) => {
    if (l.quantity === null) {
      const text = l.unit ? `Quanti ${UNIT_LABEL[l.unit]} di «${l.work}»?` : `Quanto «${l.work}»? Dimmi numero e unità.`;
      questions.push({ lineIndex: i, kind: "quantita_mancante", text });
    }
    if (l.unit === null) questions.push({ lineIndex: i, kind: "unita_mancante", text: `«${l.work}»: ${l.quantity ?? "la quantità"} in che unità?` });
  });

  const hasSignificant = lines.some((l) => l.match.kind === "listino" && byCode.get(l.match.code)?.significantGood);
  const context = ex.extraction.vat;
  return {
    customer: ex.extraction.customer,
    vat: { context, regime: vatRegime(context, hasSignificant), missing: missingVatAnswers(context) },
    lines,
    questions,
    exclusions: ex.extraction.exclusions,
    notes: ex.extraction.notes,
    usage: { inputTokens: ex.inputTokens + mt.inputTokens, outputTokens: ex.outputTokens + mt.outputTokens, calls: 2 },
    model: modelName(),
    elapsedMs: Date.now() - started,
  };
}

// Regola in codice: una voce di listino, una riga. Due righe con la stessa voce e la stessa unità
// si sommano («una presa per il forno, una per la lavastoviglie» = 2 prese); una riga ripetuta
// con le stesse parole e la stessa quantità è un doppione e si toglie. Se manca una quantità
// le righe restano separate: la domanda va fatta su ciascuna.
export function mergeSameItem(lines: DraftLine[]): DraftLine[] {
  const out: DraftLine[] = [];
  for (const line of lines) {
    const code = line.match.kind === "listino" ? line.match.code : null;
    const prev =
      code === null || line.quantity === null
        ? undefined
        : out.find((o) => o.match.kind === "listino" && o.match.code === code && o.unit === line.unit && o.quantity !== null);
    if (!prev) {
      out.push(line);
      continue;
    }
    const sameWords = jaccard(tokens(prev.spoken), tokens(line.spoken)) >= 0.6;
    if (sameWords && prev.quantity === line.quantity) continue;
    const i = out.indexOf(prev);
    out[i] = {
      ...prev,
      spoken: `${prev.spoken} · ${line.spoken}`.slice(0, 400),
      quantity: Math.round((prev.quantity! + line.quantity!) * 100) / 100,
      quantityNote: [prev.quantityNote, line.quantityNote, `somma di due righe con la stessa voce`].filter(Boolean).join("; "),
    };
  }
  return out;
}
