import { errore } from "@/lib/preventivi/http";
import { aggiornaBozza } from "@/lib/preventivi/servizio";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params;
    const p = await aggiornaBozza(id, await request.json().catch(() => null));
    return Response.json({ ok: true, stato: p.stato });
  } catch (e) {
    return errore(e);
  }
}
