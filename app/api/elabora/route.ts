import { anthropicCaller } from "@/lib/motore/claude";
import { codiceValido, errore, provaAttiva, troppeRichieste } from "@/lib/preventivi/http";
import { creaDaTesto } from "@/lib/preventivi/servizio";

// Dal testo del sopralluogo alla bozza: estrazione, abbinamento, salvataggio. Restituisce il link di revisione.
// In F6 la chiamerà n8n con il segreto condiviso ELABORA_SHARED_SECRET.
// Estrazione + abbinamento possono superare i 10 secondi di default.
export const maxDuration = 60;

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.ELABORA_SHARED_SECRET;
  const fromN8n = secret && request.headers.get("x-elabora-secret") === secret;
  if (!fromN8n && !provaAttiva()) return Response.json({ errore: "Non disponibile." }, { status: 404 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "locale";
  if (!fromN8n && troppeRichieste(ip)) return Response.json({ errore: "Troppe prove in poco tempo. Riprova tra un'ora." }, { status: 429 });
  try {
    const body = (await request.json().catch(() => ({}))) as { testo?: unknown; codice?: unknown };
    if (!fromN8n && !codiceValido(body.codice)) return Response.json({ errore: "Codice d'accesso non valido." }, { status: 401 });
    if (typeof body.testo !== "string") return Response.json({ errore: "Manca il testo del sopralluogo." }, { status: 400 });
    const p = await creaDaTesto(body.testo, anthropicCaller());
    return Response.json({ id: p.id, revisione: `/revisione/${p.id}`, righe: p.righe.length }, { status: 201 });
  } catch (e) {
    return errore(e);
  }
}
