import { z } from "zod";

// Schema del modulo di candidatura, condiviso dal modulo nel browser e da POST /api/candidatura.
// Riceve i valori così come arrivano da un FormData (stringhe; la casella spuntata vale "on").
// Messaggi di errore: formulazioni minime, da far riscrivere ad Araldo (vedi consegna).

export const TRADES = [
  "Elettricista",
  "Idraulico",
  "Termoidraulico",
  "Imbianchino",
  "Piastrellista",
  "Muratore",
  "Cartongessista",
  "Serramentista",
  "Falegname",
  "Fabbro",
  "Giardiniere",
  "Impresa edile",
  "Impresa di ristrutturazioni",
  "Altro",
] as const;

export const WEEKLY_VOLUMES = ["1 o 2", "da 3 a 5", "più di 5"] as const;

export const MAX_LENGTH = { name: 100, town: 80, phone: 30 } as const;

// Cellulare italiano: accetta spazi, punti, trattini, parentesi e il prefisso +39 / 0039.
// Restituisce la forma normalizzata «+393XXXXXXXXX», oppure null se non è un cellulare italiano.
export function normalizeItalianMobile(raw: string): string | null {
  let digits = raw.trim().replace(/[\s.\-/()]/g, "");
  if (digits.startsWith("+39")) digits = digits.slice(3);
  else if (digits.startsWith("0039")) digits = digits.slice(4);
  if (!/^3\d{8,9}$/.test(digits)) return null;
  return `+39${digits}`;
}

const requiredText = (max: number, missing: string) =>
  z
    .string({ error: missing })
    .trim()
    .min(1, { error: missing })
    .max(max, { error: `Massimo ${max} caratteri.` });

export const candidaturaSchema = z.object({
  nome: requiredText(MAX_LENGTH.name, "Scrivi nome e cognome."),
  mestiere: z.enum(TRADES, { error: "Scegli il tuo mestiere." }),
  comune: requiredText(MAX_LENGTH.town, "Scrivi il comune."),
  telefono: z
    .string({ error: "Scrivi il numero di cellulare." })
    .trim()
    .min(1, { error: "Scrivi il numero di cellulare." })
    .max(MAX_LENGTH.phone, { error: "Scrivi un cellulare italiano valido." })
    .transform((value, ctx) => {
      const normalized = normalizeItalianMobile(value);
      if (normalized === null) {
        ctx.addIssue({ code: "custom", message: "Scrivi un cellulare italiano valido." });
        return z.NEVER;
      }
      return normalized;
    }),
  volume: z
    .union([z.literal(""), z.enum(WEEKLY_VOLUMES)], {
      error: "Scegli una delle opzioni.",
    })
    .optional()
    .transform((value) => (value ? value : undefined)),
  privacy: z.literal("on", { error: "Serve il consenso per poterti ricontattare." }),
});

export type CandidaturaInput = z.input<typeof candidaturaSchema>;
export type Candidatura = z.output<typeof candidaturaSchema>;
export type CandidaturaField = keyof CandidaturaInput;

export const FIELD_ORDER: readonly CandidaturaField[] = [
  "nome",
  "mestiere",
  "comune",
  "telefono",
  "volume",
  "privacy",
];

export type FieldErrors = Partial<Record<CandidaturaField, string>>;

// Prende i campi del modulo da un FormData, ignorando tutto il resto.
export function formDataToInput(form: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const field of FIELD_ORDER) {
    const value = form.get(field);
    if (typeof value === "string") out[field] = value;
  }
  return out;
}

export type ValidationResult =
  | { ok: true; data: Candidatura }
  | { ok: false; errors: FieldErrors };

export function validateCandidatura(input: unknown): ValidationResult {
  const parsed = candidaturaSchema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && (FIELD_ORDER as readonly string[]).includes(field)) {
      const key = field as CandidaturaField;
      errors[key] ??= issue.message;
    }
  }
  return { ok: false, errors };
}

// Nomi dei campi di difesa, fuori dallo schema dei dati.
export const HONEYPOT_FIELD = "sito_web";
export const STARTED_AT_FIELD = "compilato_da";
export const MIN_FILL_MS = 3000;
