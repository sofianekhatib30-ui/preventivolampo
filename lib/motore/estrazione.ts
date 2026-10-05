import { UNITS } from "@/lib/listino/schema";
import type { ToolCaller, ToolSpec } from "./claude";
import { Extraction, INTERVENTIONS } from "./tipi";

// Tipo nullo come array di tipi (anyOf non è supportato dalle uscite strutturate).
// Per gli elenchi chiusi il «non detto» è un valore esplicito, riportato a null prima della validazione.
const NOT_SAID = "non_detto";
const nullable = (schema: { type: string; enum?: string[]; description?: string }) =>
  schema.enum ? { ...schema, enum: [...schema.enum, NOT_SAID] } : { ...schema, type: [schema.type, "null"] };

function notSaidToNull(raw: unknown): unknown {
  if (Array.isArray(raw)) return raw.map(notSaidToNull);
  if (raw && typeof raw === "object") return Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, notSaidToNull(v)]));
  return raw === NOT_SAID ? null : raw;
}

export const EXTRACTION_TOOL: ToolSpec = {
  name: "registra_sopralluogo",
  description: "Registra le lavorazioni, il cliente e il contesto IVA ricavati dal vocale del sopralluogo.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["customer", "vat", "lines", "exclusions", "notes"],
    properties: {
      customer: {
        type: "object",
        additionalProperties: false,
        required: ["name", "address"],
        properties: { name: nullable({ type: "string" }), address: nullable({ type: "string" }) },
      },
      vat: {
        type: "object",
        additionalProperties: false,
        required: ["dwelling", "intervention", "goodsBoughtBy"],
        properties: {
          dwelling: nullable({ type: "boolean" }),
          intervention: nullable({ type: "string", enum: [...INTERVENTIONS] }),
          goodsBoughtBy: nullable({ type: "string", enum: ["impresa", "cliente"] }),
        },
      },
      lines: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["spoken", "work", "quantity", "unit", "quantityNote", "clientSuppliesMaterial"],
          properties: {
            spoken: { type: "string", description: "Le parole dell'artigiano per questa lavorazione, quasi alla lettera" },
            work: { type: "string", description: "La lavorazione in italiano tecnico, breve (es. «rimozione rivestimento in piastrelle»)" },
            quantity: nullable({ type: "number", description: "Maggiore di zero" }),
            unit: nullable({ type: "string", enum: [...UNITS] }),
            quantityNote: nullable({ type: "string", description: "Come si arriva alla quantità, se calcolata" }),
            clientSuppliesMaterial: { type: "boolean" },
          },
        },
      },
      exclusions: { type: "array", items: { type: "string" } },
      notes: { type: "array", items: { type: "string" } },
    },
  },
};

export const EXTRACTION_SYSTEM = `Sei l'assistente di un'impresa edile della Brianza. Ricevi la trascrizione del vocale che l'artigiano manda dopo un sopralluogo e registri i dati per il preventivo.

Regole:
- Una riga per ogni lavorazione da mettere nel preventivo. Non inventare lavorazioni che l'artigiano non dice.
- Autocorrezioni («no aspetta», «anzi», «cioè»): registra solo la versione finale.
- Lavorazioni rimandate o escluse («lo vediamo dopo», «quello no», «non lo tocco») non sono righe: vanno in exclusions se l'artigiano le esclude, in notes se le rimanda.
- Quantità: se l'artigiano dà le misure, calcola tu la quantità (superfici, perimetri per altezza, differenze) e spiega il calcolo in quantityNote. Se dice una misura approssimata, usala e annota che è approssimata.
- Se la quantità non è detta né ricavabile, quantity = null. Non stimare mai.
- unit: m2, m, m3, cad (pezzi), h (ore), 100kg. Usa l'unità in cui la quantità è detta. Se il numero detto non ha un'unità chiara, unit = non_detto.
- clientSuppliesMaterial = true solo se l'artigiano dice che il materiale di quella riga lo compra o lo fornisce il cliente.
- Contesto IVA, solo se detto o evidente dalle parole: dwelling (abitazione: «ci abita», «casa sua»; negozio o ufficio = false), intervention (manutenzione_ordinaria, manutenzione_straordinaria, ristrutturazione), goodsBoughtBy (chi compra i materiali: «li compro io» = impresa, «li ha comprati lei» = cliente). Se non è detto, null (per gli elenchi: non_detto).
- Termini dialettali lombardi: «el cess» = water, «caldana» = massetto, «sciura» = signora, «magütt» = muratore, «minga» = non.
- Non scrivere prezzi.`;

export async function extract(transcript: string, call: ToolCaller) {
  const result = await call({ system: EXTRACTION_SYSTEM, user: transcript, tool: EXTRACTION_TOOL });
  const parsed = Extraction.safeParse(notSaidToNull(result.input));
  if (!parsed.success) {
    throw new Error(`Uscita dell'estrazione non valida: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`);
  }
  return { extraction: parsed.data, inputTokens: result.inputTokens, outputTokens: result.outputTokens };
}
