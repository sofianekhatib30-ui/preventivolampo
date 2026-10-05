import type { PriceListItem } from "@/lib/listino/schema";
import type { ToolCaller, ToolSpec } from "./claude";
import type { Candidate } from "./candidati";
import { MatchChoices, type ExtractedLine } from "./tipi";

export const MATCH_TOOL: ToolSpec = {
  name: "abbina_listino",
  description: "Per ogni riga sceglie una voce fra i candidati del listino, oppure nessuna.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["choices"],
    properties: {
      choices: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["index", "code", "confidence", "reason"],
          properties: {
            index: { type: "integer" },
            code: { type: ["string", "null"], description: "Codice del candidato scelto, oppure null" },
            confidence: { type: "number", description: "Da 0 a 1" },
            reason: { type: "string" },
          },
        },
      },
    },
  },
};

export const MATCH_SYSTEM = `Abbini le lavorazioni di un preventivo edile alle voci del listino dell'impresa.

Regole:
- Per ogni riga scegli SOLO fra i suoi candidati. Se nessun candidato descrive davvero quella lavorazione, code = null.
- Una voce va bene solo se la sua descrizione copre la lavorazione detta: stesso tipo di lavoro, stesso materiale, stessa misura quando conta (es. lavabo 65 cm, piatto doccia 80x80, spessore del tramezzo). Somiglianze vaghe = null.
- confidence: 0.9 o più se la voce è proprio quella; sotto 0.6 se hai dubbi.
- Se la riga dice che il cliente fornisce il materiale, scegli comunque la voce che corrisponde: l'impresa gestisce il caso «solo posa».
- reason: una frase breve.`;

export function matchPrompt(lines: ExtractedLine[], candidates: Candidate[][]): string {
  return lines
    .map((l, i) => {
      const cands = candidates[i].length
        ? candidates[i].map((c) => `  - ${c.item.code} [${c.item.unit}] ${c.item.name}: ${c.item.description}`).join("\n")
        : "  (nessun candidato)";
      const qty = l.quantity === null ? "quantità non detta" : `${l.quantity} ${l.unit ?? "(unità non detta)"}`;
      const mat = l.clientSuppliesMaterial ? " — materiale fornito dal cliente" : "";
      return `Riga ${i}: «${l.spoken}» → ${l.work} (${qty})${mat}\nCandidati:\n${cands}`;
    })
    .join("\n\n");
}

export async function chooseMatches(lines: ExtractedLine[], candidates: Candidate[][], call: ToolCaller) {
  const result = await call({ system: MATCH_SYSTEM, user: matchPrompt(lines, candidates), tool: MATCH_TOOL });
  const parsed = MatchChoices.safeParse(result.input);
  if (!parsed.success) throw new Error("Uscita dell'abbinamento non valida");
  const byIndex = new Map(parsed.data.choices.map((c) => [c.index, c]));
  if (byIndex.size !== lines.length || lines.some((_, i) => !byIndex.has(i))) {
    throw new Error("Uscita dell'abbinamento non valida: righe mancanti o doppie");
  }
  return { choices: lines.map((_, i) => byIndex.get(i)!), inputTokens: result.inputTokens, outputTokens: result.outputTokens };
}

export type { PriceListItem };
