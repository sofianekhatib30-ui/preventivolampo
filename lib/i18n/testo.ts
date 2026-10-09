// Segnaposto nei testi del dizionario: «{n} posti» → «7 posti».
export function fmt(testo: string, valori: Record<string, string | number> = {}): string {
  return testo.replace(/\{(\w+)\}/g, (m, k: string) => (k in valori ? String(valori[k]) : m));
}
