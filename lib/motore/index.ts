import type { VoceMotore as PriceListItem } from "@/lib/listino/schema";
import { candidatesFor } from "./candidati";
import { chooseMatches } from "./abbinamento";
import { modelName, type ToolCaller } from "./claude";
import { calcola } from "./calcolo";
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

  const lines: DraftLine[] = ex.extraction.lines.flatMap((line, i) => {
    const choice = mt.choices[i];
    const allowed = new Set(candidates[i].map((c) => c.item.code));
    const item = choice.code && allowed.has(choice.code) ? byCode.get(choice.code) : undefined;
    const base = { ...line, candidates: [...allowed] };
    if (!item || choice.confidence < CONFIDENCE_THRESHOLD) {
      return [
        {
          ...base,
          unitPriceCents: null,
          match: {
            kind: "da_prezzare",
            reason: item ? `abbinamento incerto: ${choice.reason}` : `nessuna voce del listino: ${choice.reason}`,
            suggestedCode: item?.code ?? null,
            confidence: choice.confidence,
          },
        },
      ];
    }
    const prima = rigaDiListino(rimisura(base, item, choice.quantityCalc), item, choice.confidence);
    // Lavorazione che il listino divide in due voci (acqua e scarico): due righe, stessa quantità.
    const seconda = choice.alsoCode && choice.alsoCode !== item.code && allowed.has(choice.alsoCode) ? byCode.get(choice.alsoCode) : undefined;
    if (!seconda) return [prima];
    return [prima, rigaDiListino({ ...base, work: seconda.name, quantityNote: `stessa lavorazione, seconda voce del listino` }, seconda, choice.confidence)];
  });

  const merged = mergeSameItem(lines);
  lines.length = 0;
  lines.push(...merged);

  const questions: DraftQuestion[] = [];
  lines.forEach((l, i) => {
    if (l.quantity === null) {
      const text = l.unit ? `${l.unit === "h" ? "Quante" : "Quanti"} ${UNIT_LABEL[l.unit]} di «${l.work}»?` : `Quanto «${l.work}»? Dimmi numero e unità.`;
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

type Base = Omit<DraftLine, "match" | "unitPriceCents">;

function rigaDiListino(base: Base, item: PriceListItem, confidence: number): DraftLine {
  if (base.clientSuppliesMaterial && item.clientSuppliable) {
    return { ...base, unitPriceCents: null, match: { kind: "da_prezzare", reason: "solo posa: il listino ha fornitura e posa", suggestedCode: item.code, confidence } };
  }
  // Un numero detto in un'unità diversa da quella della voce non si converte, e un'unità che
  // l'artigiano non ha detto né lasciato intendere non si indovina: in tutti e due i casi si chiede.
  const unit = base.unit === item.unit ? item.unit : null;
  return { ...base, unit, unitPriceCents: item.priceCents, match: { kind: "listino", code: item.code, confidence } };
}

// La voce si misura a modo suo («al m² di porta», «per ogni lastra»): se le misure sono dette,
// il modello scrive il calcolo nella misura della voce e il codice lo fa. Altrimenti resta la domanda.
const MISURA_PROPRIA = /\bper ogni\b|\bal m[²2q]|\bal metro\b|\bal pezzo\b/i;
export function rimisura(base: Base, item: PriceListItem, calcolo: string | null | undefined): Base {
  const v = calcola(calcolo);
  if (v === null) return base;
  if (base.unit === item.unit && !MISURA_PROPRIA.test(`${item.name} ${item.description}`)) return base;
  if (base.unit === item.unit && base.quantity !== null && Math.abs(base.quantity - v) <= 0.011) return base;
  const nota = `nella misura della voce: ${calcolo} = ${String(v).replace(".", ",")} ${UNIT_LABEL[item.unit] ?? item.unit}`;
  return { ...base, quantity: v, unit: item.unit, quantityNote: base.quantityNote ? `${base.quantityNote}; ${nota}` : nota };
}

// Regola in codice: una voce di listino, una riga. Due righe con la stessa voce e la stessa unità
// si sommano («una presa per il forno, una per la lavastoviglie» = 2 prese); una riga ripetuta
// con le stesse parole e la stessa quantità è un doppione e si toglie. Un pezzo staccato che comincia
// con «col», «con la»… («il vaso sospeso» + «col telaio») è un accessorio dello stesso pezzo: non si somma.
// Se manca una quantità o un'unità le righe restano separate: la domanda va fatta su ciascuna.
const ACCESSORIO = /^(e\s+)?(col|coi|colla|con|con\s+(il|lo|la|l'|i|gli|le|un|una|uno|suo|sua|suoi))\b/i;
const normale = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
const chiave = (l: DraftLine) => (l.match.kind === "listino" ? l.match.code : `?${l.match.suggestedCode ?? ""}`);

export function mergeSameItem(lines: DraftLine[]): DraftLine[] {
  const out: DraftLine[] = [];
  for (const line of lines) {
    // Doppione (stesse parole, stessa voce, stessa quantità): si toglie, anche da prezzare.
    // Senza quantità basta che le parole siano quasi le stesse: farebbero la stessa domanda due volte.
    const doppione = (o: DraftLine) =>
      chiave(o) === chiave(line) &&
      o.quantity === line.quantity &&
      (normale(o.spoken) === normale(line.spoken) || (line.quantity === null && jaccard(tokens(o.spoken), tokens(line.spoken)) >= 0.6));
    if (out.some(doppione)) continue;
    const code = line.match.kind === "listino" ? line.match.code : null;
    const prev =
      code === null || line.quantity === null || line.unit === null
        ? undefined
        : out.find((o) => o.match.kind === "listino" && o.match.code === code && o.unit === line.unit && o.quantity !== null);
    if (!prev) {
      out.push(line);
      continue;
    }
    const sameWords = jaccard(tokens(prev.spoken), tokens(line.spoken)) >= 0.6;
    if (sameWords && prev.quantity === line.quantity) continue;
    const i = out.indexOf(prev);
    const accessorio = ACCESSORIO.test(line.spoken.trim()) && !/\baltr[aieo]\b/i.test(line.spoken);
    out[i] = {
      ...prev,
      spoken: `${prev.spoken} · ${line.spoken}`.slice(0, 400),
      quantity: accessorio ? Math.max(prev.quantity!, line.quantity!) : Math.round((prev.quantity! + line.quantity!) * 100) / 100,
      quantityNote: [prev.quantityNote, line.quantityNote, accessorio ? "accessorio dello stesso pezzo, non sommato" : "somma di due righe con la stessa voce"]
        .filter(Boolean)
        .join("; "),
    };
  }
  return out;
}
