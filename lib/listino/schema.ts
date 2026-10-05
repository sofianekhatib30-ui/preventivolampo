import { z } from "zod";

// Il listino di prova: ogni voce ha prezzo, unità e fonte. Una voce senza fonte non entra.

export const CATEGORIES = [
  "demolizioni",
  "smaltimento",
  "bagno",
  "cucina",
  "tinteggiature",
  "pavimenti",
  "idraulico",
  "elettrico",
  "opere_varie",
] as const;

export const UNITS = ["m2", "m", "m3", "cad", "h", "100kg"] as const;

export const Category = z.enum(CATEGORIES);
export const Unit = z.enum(UNITS);

export const Source = z.strictObject({
  document: z.string().min(5),
  edition: z.string().min(4),
  sourceCode: z.string().min(1),
  url: z.url({ protocol: /^https$/ }),
  reference: z.string().min(1).optional(),
});

export const PriceListItem = z.strictObject({
  code: z.string().regex(/^[A-Z]{3}-\d{2}$/),
  category: Category,
  name: z.string().min(5).max(70),
  description: z.string().min(10),
  unit: Unit,
  priceCents: z.number().int().positive(),
  synonyms: z.array(z.string().min(2)),
  // Bene significativo ai fini IVA (DM 29/12/1999): classificazione di Maestro, da verificare.
  significantGood: z.boolean(),
  // Materiale che il cliente può comprare da sé: in quel caso il prezzo del listino (fornitura e posa) non vale più.
  clientSuppliable: z.boolean(),
  source: Source,
});

export const Company = z.strictObject({
  name: z.string().min(3),
  fictitiousNotice: z.string().min(10),
  address: z.string().min(5),
  vatNumber: z.string().min(5),
  phone: z.string().min(5),
  email: z.email(),
  defaultVatRatePercent: z.number().min(0).max(100),
  quoteValidityDays: z.number().int().positive(),
});

export const PriceList = z.strictObject({
  company: Company,
  priceBasis: z.string().min(10),
  items: z.array(PriceListItem).min(1),
});

export type PriceListItem = z.infer<typeof PriceListItem>;
export type PriceList = z.infer<typeof PriceList>;
