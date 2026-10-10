import { area } from "./it-area";
import type { Dizionario } from "./it";

// Le avvertenze fiscali arrivano come testo italiano (sono fotografate sul preventivo): qui si ritrovano nel
// dizionario per mostrarle nella lingua dell'interfaccia. Un testo che non c'è resta com'è, in italiano.
type Gruppo = keyof typeof area.avvisi;
const PER_TESTO = new Map<string, [Gruppo, string]>(
  (Object.keys(area.avvisi) as Gruppo[]).flatMap((g) => Object.entries(area.avvisi[g]).map(([k, t]) => [t, [g, k]] as [string, [Gruppo, string]])),
);

export function avvisoIn(d: Dizionario, testo: string): string {
  const v = PER_TESTO.get(testo);
  if (!v) return testo;
  return (d.area.avvisi[v[0]] as Record<string, string>)[v[1]] ?? testo;
}
