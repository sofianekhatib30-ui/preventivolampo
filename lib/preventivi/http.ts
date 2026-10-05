import { createHash, timingSafeEqual } from "node:crypto";
import { leggiOggetto, scriviOggetto, suBlob } from "./archivio";
import { Rifiuto } from "./servizio";

export function errore(e: unknown): Response {
  if (e instanceof Rifiuto) return Response.json({ errore: e.message }, { status: e.status });
  // Niente dettagli interni al browser: il messaggio completo resta nel log del server.
  console.error(e instanceof Error ? e.message : e);
  return Response.json({ errore: "Qualcosa è andato storto. Riprova tra poco." }, { status: 500 });
}

// La prova dal browser costa chiamate all'API: attiva solo in sviluppo o con PROVA_ATTIVA=1.
export function provaAttiva(): boolean {
  return process.env.NODE_ENV !== "production" || process.env.PROVA_ATTIVA === "1";
}

// Limite di prove per IP. Online il contatore sta su Blob (condiviso fra tutte le istanze della
// funzione, una chiave per IP e per finestra oraria; l'IP è salvato solo come hash). In locale e
// nei test resta in memoria. Il conteggio è approssimato (leggi-poi-scrivi), che per un limite basta.
const finestre = new Map<string, number[]>();

function inMemoria(chiave: string, max: number, finestraMs: number, adesso: number): boolean {
  const recenti = (finestre.get(chiave) ?? []).filter((t) => adesso - t < finestraMs);
  recenti.push(adesso);
  finestre.set(chiave, recenti);
  return recenti.length > max;
}

export async function troppeRichieste(chiave: string, max = 12, finestraMs = 60 * 60 * 1000, adesso = Date.now()): Promise<boolean> {
  if (!suBlob()) return inMemoria(chiave, max, finestraMs, adesso);
  const hash = createHash("sha256").update(`preventivolampo:${chiave}`).digest("hex").slice(0, 32);
  const nome = `limiti/${hash}-${Math.floor(adesso / finestraMs)}.json`;
  try {
    const prima = (await leggiOggetto(nome)) as { n?: number } | null;
    const n = (prima?.n ?? 0) + 1;
    await scriviOggetto(nome, { n });
    return n > max;
  } catch {
    // Se lo storage non risponde, il limite in memoria fa da riserva.
    return inMemoria(chiave, max, finestraMs, adesso);
  }
}

// Codice d'accesso della demo pubblica: se PROVA_CODICE è impostato, /api/elabora lo pretende.
export function codiceValido(dato: unknown, atteso = process.env.PROVA_CODICE): boolean {
  if (!atteso) return true;
  if (typeof dato !== "string") return false;
  const a = createHash("sha256").update(dato.trim()).digest();
  const b = createHash("sha256").update(atteso).digest();
  return timingSafeEqual(a, b);
}

export function serveCodice(): boolean {
  return Boolean(process.env.PROVA_CODICE);
}
