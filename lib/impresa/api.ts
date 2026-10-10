import { errore, troppeRichieste } from "@/lib/preventivi/http";
import { Rifiuto } from "@/lib/preventivi/rifiuto";
import { configurato } from "./db";
import { contesto, membro, stessaOrigine, type Contesto, type Membro } from "./sessione";

// Le route dell'area: stessa origine per chi scrive, sessione valida, impresa dell'utente.
// Ogni funzione riceve l'id dell'impresa dalla sessione, mai dal browser.

export function ipDi(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "locale";
}

function controlli(request: Request) {
  if (!configurato()) throw new Rifiuto("L'area imprese non è ancora attiva.", 503);
  if (request.method !== "GET" && !stessaOrigine(request)) throw new Rifiuto("Richiesta non valida.", 403);
}

export async function conMembro(request: Request, fn: (m: Membro) => Promise<Response>): Promise<Response> {
  try {
    controlli(request);
    const m = await membro();
    if (!m) throw new Rifiuto("Accedi di nuovo per continuare.", 401);
    // Modulo sospeso o scaduto: si legge, non si scrive (regola del nucleo).
    if (request.method !== "GET" && !m.scrittura) throw new Rifiuto("Preventivi è in sola lettura: il modulo non è attivo per questa organizzazione.", 403);
    return await fn(m);
  } catch (e) {
    return errore(e);
  }
}

export async function conSessione(request: Request, fn: (c: Contesto) => Promise<Response>): Promise<Response> {
  try {
    controlli(request);
    const c = await contesto();
    if (!c) throw new Rifiuto("Accedi di nuovo per continuare.", 401);
    return await fn(c);
  } catch (e) {
    return errore(e);
  }
}

export async function senzaSessione(request: Request, fn: () => Promise<Response>): Promise<Response> {
  try {
    controlli(request);
    return await fn();
  } catch (e) {
    return errore(e);
  }
}

export async function limite(chiave: string, max: number, messaggio = "Troppe richieste in poco tempo. Riprova tra un'ora."): Promise<void> {
  if (await troppeRichieste(`area:${chiave}`, max)) throw new Rifiuto(messaggio, 429);
}

export async function corpo(request: Request): Promise<Record<string, unknown>> {
  const b = await request.json().catch(() => null);
  if (!b || typeof b !== "object" || Array.isArray(b)) throw new Rifiuto("Dati non validi.", 400);
  return b as Record<string, unknown>;
}
