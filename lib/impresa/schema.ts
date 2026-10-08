import { z } from "zod";
import { CODICE, UNITS } from "@/lib/listino/schema";

// Dati dell'impresa e delle voci di listino come arrivano dai moduli. Validati sul server.

export const MESTIERI = [
  "Impresa edile",
  "Muratore",
  "Idraulico",
  "Elettricista",
  "Imbianchino",
  "Piastrellista",
  "Cartongessista",
  "Serramentista",
  "Termoidraulico",
  "Giardiniere",
] as const;

// Partita IVA italiana: 11 cifre con la cifra di controllo (algoritmo dell'Agenzia delle Entrate).
export function partitaIvaValida(piva: string): boolean {
  if (!/^\d{11}$/.test(piva)) return false;
  let s = 0;
  for (let i = 0; i < 10; i++) {
    let n = Number(piva[i]);
    if (i % 2 === 1) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    s += n;
  }
  return (10 - (s % 10)) % 10 === Number(piva[10]);
}

// IBAN: controllo modulo 97 (ISO 13616).
export function ibanValido(iban: string): boolean {
  const s = iban.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(s)) return false;
  const r = (s.slice(4) + s.slice(0, 4)).replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let resto = 0;
  for (const d of r) resto = (resto * 10 + Number(d)) % 97;
  return resto === 1;
}

const testo = (min: number, max: number) => z.string().trim().min(min).max(max);
const facoltativo = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => (s === "" ? null : s))
    .nullable()
    .optional()
    .transform((s) => s ?? null);

export const DatiImpresa = z.strictObject({
  ragione_sociale: testo(2, 160),
  piva: z
    .string()
    .trim()
    .transform((s) => s.replace(/^IT/i, "").replace(/\s/g, ""))
    .refine(partitaIvaValida, "Partita IVA non valida"),
  cf: facoltativo(16),
  indirizzo: testo(5, 200),
  telefono: testo(6, 30),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  iban: facoltativo(40).refine((s) => s === null || ibanValido(s), "IBAN non valido").transform((s) => (s ? s.replace(/\s/g, "").toUpperCase() : null)),
  condizioni_pagamento: facoltativo(300),
  validita_giorni: z.coerce.number().int().min(1).max(365),
  mestieri: z.array(z.enum(MESTIERI)).max(MESTIERI.length),
});
export type DatiImpresa = z.infer<typeof DatiImpresa>;

export const DatiVoce = z.strictObject({
  codice: z.string().trim().regex(CODICE, "Codice: lettere, numeri e . _ / - (massimo 24)"),
  nome: testo(2, 200),
  descrizione: facoltativo(600),
  unita: z.enum(UNITS),
  prezzo_cents: z.number().int().min(0).max(100_000_000),
  categoria: facoltativo(60),
  sinonimi: z.array(z.string().trim().min(2).max(60)).max(20),
  bene_significativo: z.boolean(),
  fornibile_dal_cliente: z.boolean(),
});
export type DatiVoce = z.infer<typeof DatiVoce>;

// Riga di listino come esce dal database.
export type Voce = DatiVoce & { id: string; origine: "manuale" | "import" | "appreso" | "demo"; attiva: boolean; aggiornata_il: string };

export const MESSAGGI_CAMPI: Record<string, string> = {
  ragione_sociale: "Ragione sociale",
  piva: "Partita IVA",
  indirizzo: "Indirizzo",
  telefono: "Telefono",
  email: "Email",
  iban: "IBAN",
  validita_giorni: "Validità del preventivo",
  codice: "Codice",
  nome: "Nome della voce",
  unita: "Unità di misura",
  prezzo_cents: "Prezzo",
};

// Il primo errore di un modulo, in parole: «Partita IVA: Partita IVA non valida».
export function primoErrore(e: z.ZodError): string {
  const i = e.issues[0];
  const campo = MESSAGGI_CAMPI[String(i?.path[0] ?? "")] ?? "Dati";
  const msg = i?.message && !/^(Invalid|Too|String|Expected)/.test(i.message) ? i.message : "da controllare";
  return msg.startsWith(campo) ? msg : `${campo}: ${msg.charAt(0).toLowerCase()}${msg.slice(1)}`;
}
