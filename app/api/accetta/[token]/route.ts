import { errore } from "@/lib/preventivi/http";
import { rispondiCliente } from "@/lib/preventivi/servizio";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }): Promise<Response> {
  try {
    const { token } = await params;
    const body = (await request.json().catch(() => ({}))) as { nome?: unknown; esito?: unknown };
    const esito = body.esito === "rifiutato" ? "rifiutato" : "accettato";
    // Traccia della risposta, per l'impresa: da dove e con che browser (resta nella storia del preventivo).
    const traccia = {
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim().slice(0, 64) ?? null,
      browser: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    };
    const p = await rispondiCliente(token, typeof body.nome === "string" ? body.nome : "", esito, new Date(), traccia);
    return Response.json({ stato: p.stato });
  } catch (e) {
    return errore(e);
  }
}
