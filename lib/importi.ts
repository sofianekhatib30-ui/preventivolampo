// Importi del preventivo in centesimi interi: mai euro in virgola mobile.
// L'aliquota IVA è un dato del preventivo scelto dall'artigiano: qui si fa solo aritmetica,
// nessuna logica fiscale (quale aliquota spetta a quale lavoro non lo decide il codice).

export type Line = {
  quantity: number;
  unitPriceCents: number;
};

export type Totals = {
  taxableCents: number;
  vatCents: number;
  totalCents: number;
};

export function lineAmountCents(line: Line): number {
  if (!Number.isFinite(line.quantity) || line.quantity < 0) {
    throw new Error(`Quantità non valida: ${line.quantity}`);
  }
  if (!Number.isInteger(line.unitPriceCents) || line.unitPriceCents < 0) {
    throw new Error(`Prezzo unitario non valido (centesimi interi): ${line.unitPriceCents}`);
  }
  return Math.round(line.quantity * line.unitPriceCents);
}

export function computeTotals(lines: Line[], vatRatePercent: number): Totals {
  if (!Number.isFinite(vatRatePercent) || vatRatePercent < 0 || vatRatePercent > 100) {
    throw new Error(`Aliquota IVA non valida: ${vatRatePercent}`);
  }
  const taxableCents = lines.reduce((sum, line) => sum + lineAmountCents(line), 0);
  const vatCents = Math.round((taxableCents * vatRatePercent) / 100);
  return { taxableCents, vatCents, totalCents: taxableCents + vatCents };
}

export function formatEuro(cents: number): string {
  // useGrouping "always": in it-IT il CLDR non separa le migliaia sotto 10.000 («3992,50 €»).
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    useGrouping: "always",
  }).format(cents / 100);
}
