import { z } from "zod";
import { VatContext } from "@/lib/banco/schema";
import { Unit } from "@/lib/listino/schema";

// Il preventivo salvato: la bozza del motore diventa un documento che l'artigiano corregge e approva.
// Stati: bozza → approvato (PDF) → accettato o rifiutato dal cliente; scaduto dopo la validità.

export const STATI = ["bozza", "approvato", "accettato", "rifiutato"] as const;

export const RigaPreventivo = z.strictObject({
  work: z.string().min(2).max(200),
  spoken: z.string().max(400),
  quantity: z.number().positive().nullable(),
  unit: Unit.nullable(),
  unitPriceCents: z.number().int().nonnegative().nullable(),
  code: z.string().regex(/^[A-Z]{3}-\d{2}$/).nullable(),
  // «listino» se il prezzo è quello della voce; «artigiano» se l'ha scritto lui; null se manca ancora.
  priceSource: z.enum(["listino", "artigiano"]).nullable(),
  flag: z.string().max(300).nullable(), // perché la riga è evidenziata (dubbia, solo posa, domanda)
  significantGood: z.boolean(),
  // Valore del bene significativo compreso nella riga (serve per la ripartizione 10%/22%): lo dice l'artigiano.
  goodsValueCents: z.number().int().nonnegative().nullable(),
  addToPriceList: z.boolean(),
});

export const Preventivo = z.strictObject({
  id: z.string().regex(/^[A-Za-z0-9_-]{22}$/),
  numero: z.string(),
  creatoIl: z.string(),
  stato: z.enum(STATI),
  cliente: z.strictObject({ name: z.string().max(120).nullable(), address: z.string().max(200).nullable() }),
  iva: VatContext,
  righe: z.array(RigaPreventivo).min(1).max(80),
  esclusioni: z.array(z.string().max(300)).max(30),
  note: z.array(z.string().max(300)).max(30),
  approvatoIl: z.string().nullable(),
  tokenAccettazione: z.string().nullable(),
  accettazione: z.strictObject({ nome: z.string(), il: z.string(), esito: z.enum(["accettato", "rifiutato"]) }).nullable(),
  motore: z.strictObject({ model: z.string(), inputTokens: z.number(), outputTokens: z.number(), elapsedMs: z.number() }),
});

export type RigaPreventivo = z.infer<typeof RigaPreventivo>;
export type Preventivo = z.infer<typeof Preventivo>;

// Quello che la pagina di revisione può cambiare: niente stato, niente token.
export const ModificheBozza = z.strictObject({
  cliente: Preventivo.shape.cliente,
  iva: VatContext,
  righe: z.array(RigaPreventivo).min(1).max(80),
  esclusioni: z.array(z.string().max(300)).max(30),
});
export type ModificheBozza = z.infer<typeof ModificheBozza>;
