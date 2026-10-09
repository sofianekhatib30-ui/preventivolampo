import { area } from "@/lib/i18n/it-area";

// Formati condivisi dalle pagine del preventivo. Le etichette italiane di unità e regimi IVA vivono nel
// dizionario (lib/i18n/it-area.ts, «formato»): qui ne restano i nomi per chi non ha il dizionario a portata.
export const UNITA: Record<string, string> = area.formato.unita;

export function euro(cents: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", useGrouping: "always" }).format(cents / 100);
}

// «12,50» o «12.50» o «1.234,5» → centesimi; null se non è un importo.
export function centesimi(input: string): number | null {
  const s = input.trim().replace(/€/g, "").replace(/\s/g, "");
  if (!s) return null;
  const norm = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  if (!/^\d+(\.\d{1,2})?$/.test(norm)) return null;
  return Math.round(Number(norm) * 100);
}

export function numero(input: string): number | null {
  const s = input.trim().replace(",", ".");
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const n = Number(s);
  return n > 0 ? n : null;
}

export const REGIME: Record<string, string> = area.formato.regime;

// Prezzo unitario a parole: «9,50 € al quintale», «38,00 € all'ora».
export const PER_UNITA: Record<string, string> = area.formato.perUnita;

// Unità brevi per le righe compatte («1 pz × 226,33 €»).
export const UNITA_BREVE: Record<string, string> = { m2: "m²", m: "m", m3: "m³", cad: "pz", h: "h", "100kg": "q", kg: "kg", l: "l", corpo: "corpo" };
