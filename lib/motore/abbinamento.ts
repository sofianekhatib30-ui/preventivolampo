import type { VoceMotore as PriceListItem } from "@/lib/listino/schema";
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
          required: ["index", "code", "alsoCode", "quantityCalc", "confidence", "reason"],
          properties: {
            index: { type: "integer" },
            code: { type: ["string", "null"], description: "Codice del candidato scelto, oppure null" },
            alsoCode: { type: ["string", "null"], description: "Solo se la lavorazione è divisa nel listino in due voci che servono entrambe: la seconda" },
            quantityCalc: { type: ["string", "null"], description: "Solo se la voce si misura diversamente dalla quantità della riga: il calcolo nella misura della voce" },
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
- Una voce va bene solo se la sua descrizione copre la lavorazione detta: stesso tipo di lavoro, stesso materiale, stessa misura quando conta (es. lavabo 65 cm, piatto doccia 80x80, spessore del tramezzo). Non va bene nemmeno una voce che comprende cose in più non dette (es. acqua calda e fredda quando è detta solo la fredda). Somiglianze vaghe = null.
- confidence: 0.9 o più se la voce è proprio quella; sotto 0.6 se hai dubbi.
- Il lavoro a ore dell'impresa («lo faccio a ore», «un paio d'ore») va sulla voce di manodopera a ore fra i candidati che corrisponde al mestiere, se ce n'è una.
- Se la riga dice che il cliente fornisce il materiale, scegli comunque la voce che corrisponde: l'impresa gestisce il caso «solo posa».
- alsoCode: quasi sempre null. Solo quando il listino divide la lavorazione detta in due voci che servono tutte e due e nessuna voce le comprende insieme (es. «attacco con acqua e scarico» e il listino ha una voce per l'acqua e una per lo scarico, ma nessuna per entrambi): code è la prima, alsoCode la seconda, entrambe fra i candidati. In quel caso non ripiegare sulla voce più vicina che comprende di più.
- quantityCalc: quasi sempre null. Solo se la voce scelta si misura in un modo diverso dalla quantità della riga (unità diversa, oppure «al m² di porta», «per ogni lastra») e le misure che servono sono dette nella riga: scrivi il calcolo nella misura della voce con soli numeri e + - * / (es. due porte 80x210 al m² = «2*0.8*2.1»). Se le misure non ci sono, null: non stimare mai.
- reason: una frase breve.`;

export function matchPrompt(lines: ExtractedLine[], candidates: Candidate[][]): string {
  return lines
    .map((l, i) => {
      const cands = candidates[i].length
        ? candidates[i].map((c) => `  - ${c.item.code} [${c.item.unit}] ${c.item.name}: ${c.item.description}`).join("\n")
        : "  (nessun candidato)";
      const qty = l.quantity === null ? "quantità non detta" : `${l.quantity} ${l.unit ?? "(unità non detta)"}`;
      const mat = l.clientSuppliesMaterial ? " — materiale fornito dal cliente" : "";
      const nota = l.quantityNote ? ` [${l.quantityNote}]` : "";
      return `Riga ${i}: «${l.spoken}» → ${l.work} (${qty})${nota}${mat}\nCandidati:\n${cands}`;
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
