import { z } from "zod";
import { Unit, UNITS } from "@/lib/listino/schema";
import { VatContext, VatRegime } from "@/lib/banco/schema";

// Contratti del motore. L'uscita del modello si valida qui: uscita non valida = errore, non bozza.

export const INTERVENTIONS = ["manutenzione_ordinaria", "manutenzione_straordinaria", "ristrutturazione"] as const;

// Quello che il modello estrae dal sopralluogo, prima di toccare il listino.
export const ExtractedLine = z.strictObject({
  spoken: z.string().min(2),
  work: z.string().min(3),
  quantity: z.number().positive().nullable(),
  unit: Unit.nullable(),
  quantityNote: z.string().nullable(),
  clientSuppliesMaterial: z.boolean(),
});

export const Extraction = z.strictObject({
  customer: z.strictObject({ name: z.string().nullable(), address: z.string().nullable() }),
  vat: VatContext,
  lines: z.array(ExtractedLine).min(1),
  exclusions: z.array(z.string()),
  notes: z.array(z.string()),
});

export type ExtractedLine = z.infer<typeof ExtractedLine>;
export type Extraction = z.infer<typeof Extraction>;

// La scelta del modello fra i candidati del listino, una per riga.
export const MatchChoice = z.strictObject({
  index: z.number().int().nonnegative(),
  code: z.string().min(1).max(40).nullable(),
  confidence: z.number().min(0).max(1),
  reason: z.string().min(3),
});
export const MatchChoices = z.strictObject({ choices: z.array(MatchChoice) });
export type MatchChoice = z.infer<typeof MatchChoice>;

export type DraftMatch =
  | { kind: "listino"; code: string; confidence: number }
  | { kind: "da_prezzare"; reason: string; suggestedCode: string | null; confidence: number };

export type DraftLine = ExtractedLine & {
  match: DraftMatch;
  // Prezzo unitario: solo dal listino, oppure null («da prezzare» o in attesa dell'artigiano).
  unitPriceCents: number | null;
  candidates: string[];
};

export type DraftQuestion = { lineIndex: number; kind: "quantita_mancante" | "unita_mancante"; text: string };

export type Usage = { inputTokens: number; outputTokens: number; calls: number };

export type Draft = {
  customer: Extraction["customer"];
  vat: { context: z.infer<typeof VatContext>; regime: z.infer<typeof VatRegime> | null; missing: string[] };
  lines: DraftLine[];
  questions: DraftQuestion[];
  exclusions: string[];
  notes: string[];
  usage: Usage;
  model: string;
  elapsedMs: number;
};

export { UNITS };
