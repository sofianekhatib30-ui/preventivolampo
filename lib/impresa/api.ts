import { errore, troppeRichieste } from "@/lib/preventivi/http";
import { Rifiuto } from "@/lib/preventivi/rifiuto";
import { configurato } from "./db";
import { membro, sessione, stessaOrigine, type Membro, type Sessione } from "./sessione";

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
    return await fn(m);
  } catch (e) {
    return errore(e);
  }
}

export async function conSessione(request: Request, fn: (s: Sessione) => Promise<Response>): Promise<Response> {
  try {
    controlli(request);
    const s = await sessione();
    if (!s) throw new Rifiuto("Accedi di nuovo per continuare.", 401);
    return await fn(s);
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
