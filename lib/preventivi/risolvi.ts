import { leggiPerToken } from "./archivio";
import type { Contesto } from "./contesto";
import { demo } from "./demo";
import type { Preventivo } from "./modello";
import { contestoPerToken } from "@/lib/impresa/preventivi";

// Il link del cliente (/accetta/<token>) non dice di chi è il preventivo: lo si cerca
// prima fra quelli delle imprese, poi nella demo. Il token è casuale a 128 bit.
export async function perToken(token: string): Promise<{ ctx: Contesto; p: Preventivo } | null> {
  if (!/^[A-Za-z0-9_-]{22}$/.test(token)) return null;
  const impresa = await contestoPerToken(token);
  if (impresa) return impresa;
  const p = await leggiPerToken(token);
  return p ? { ctx: demo, p } : null;
}
