import { createHash, timingSafeEqual } from "node:crypto";
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

const finestre = new Map<string, number[]>();
export function troppeRichieste(chiave: string, max = 12, finestraMs = 60 * 60 * 1000, adesso = Date.now()): boolean {
  const recenti = (finestre.get(chiave) ?? []).filter((t) => adesso - t < finestraMs);
  recenti.push(adesso);
  finestre.set(chiave, recenti);
  return recenti.length > max;
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
