import { errore } from "@/lib/preventivi/http";
import { rispondiCliente } from "@/lib/preventivi/servizio";

export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }): Promise<Response> {
  try {
    const { token } = await params;
    const body = (await request.json().catch(() => ({}))) as { nome?: unknown; esito?: unknown };
    const esito = body.esito === "rifiutato" ? "rifiutato" : "accettato";
    const p = await rispondiCliente(token, typeof body.nome === "string" ? body.nome : "", esito);
    return Response.json({ stato: p.stato });
  } catch (e) {
    return errore(e);
  }
}
