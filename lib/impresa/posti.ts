import { configurato, db } from "./db";

// Programma pilota: 10 posti. Occupa un posto solo un'impresa accettata nel pilota
// (pl_imprese.pilota_dal valorizzato a mano), non una registrazione qualunque.
// Il numero sulla home è vero o non c'è: se il database non risponde, il contatore sparisce.

export const POSTI_PILOTA = 10;

export function postiLiberi(occupati: number, totale = POSTI_PILOTA): number {
  if (!Number.isFinite(occupati) || occupati < 0) return totale;
  return Math.max(0, totale - Math.floor(occupati));
}

export function etichettaPosti(liberi: number, totale = POSTI_PILOTA): string {
  if (liberi <= 0) return `Posti esauriti · Monza e Brianza`;
  if (liberi === 1) return `Ultimo posto su ${totale} · Monza e Brianza`;
  return `${liberi} posti liberi su ${totale} · Monza e Brianza`;
}

export async function leggiPostiLiberi(): Promise<number | null> {
  if (!configurato()) return null;
  try {
    const r = await db().from("pl_imprese").select("id", { count: "exact", head: true }).not("pilota_dal", "is", null);
    if (r.error || r.count === null) return null;
    return postiLiberi(r.count);
  } catch {
    return null;
  }
}
