import type { z } from "zod";
import type { VatContext, VatRegime } from "@/lib/banco/schema";

// Motore IVA edile. Il regime discende dalle tre risposte dell'artigiano; il codice non indovina:
// una risposta mancante lascia il regime null e diventa una domanda.
// Avviso sempre presente: verifica con il commercialista.

export const VAT_NOTICE =
  "Aliquote calcolate sulle risposte dell'artigiano (L. 488/1999, DM 29/12/1999). Verifica con il tuo commercialista.";

type Ctx = z.infer<typeof VatContext>;
type Regime = z.infer<typeof VatRegime>;

export function missingVatAnswers(ctx: Ctx): string[] {
  const out: string[] = [];
  if (ctx.dwelling === null) out.push("L'immobile è un'abitazione?");
  if (ctx.intervention === null) out.push("È manutenzione ordinaria, straordinaria o ristrutturazione?");
  if (ctx.goodsBoughtBy === null) out.push("I materiali li compri tu o il cliente?");
  return out;
}

export function vatRegime(ctx: Ctx, hasSignificantGoods: boolean): Regime | null {
  if (ctx.dwelling === null || ctx.intervention === null || ctx.goodsBoughtBy === null) return null;
  if (!ctx.dwelling) return "ordinaria_22";
  if (ctx.intervention === "ristrutturazione") return "agevolata_10";
  if (ctx.goodsBoughtBy === "impresa" && hasSignificantGoods) return "agevolata_10_beni_significativi";
  return "agevolata_10";
}

export type VatSplit = {
  taxableCents: number;
  at10Cents: number;
  at22Cents: number;
  vatCents: number;
  totalCents: number;
};

// Beni significativi: il 10% vale sul bene solo fino alla differenza fra il valore complessivo
// dell'intervento e il valore dei beni; l'eccedenza va al 22%.
// Esempio dell'Agenzia delle Entrate: totale 10.000, beni 6.000 → 8.000 al 10% e 2.000 al 22%.
export function splitVat(regime: Regime, taxableCents: number, significantGoodsCents = 0): VatSplit {
  if (!Number.isInteger(taxableCents) || taxableCents < 0) throw new Error("Imponibile non valido");
  if (!Number.isInteger(significantGoodsCents) || significantGoodsCents < 0 || significantGoodsCents > taxableCents) {
    throw new Error("Valore dei beni significativi non valido");
  }
  let at10 = 0;
  let at22 = 0;
  if (regime === "ordinaria_22") at22 = taxableCents;
  else if (regime === "agevolata_10") at10 = taxableCents;
  else {
    const excess = Math.max(0, 2 * significantGoodsCents - taxableCents);
    at22 = excess;
    at10 = taxableCents - excess;
  }
  const vatCents = Math.round(at10 * 0.1) + Math.round(at22 * 0.22);
  return { taxableCents, at10Cents: at10, at22Cents: at22, vatCents, totalCents: taxableCents + vatCents };
}
