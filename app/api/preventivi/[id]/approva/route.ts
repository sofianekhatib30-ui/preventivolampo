import { errore } from "@/lib/preventivi/http";
import { approva } from "@/lib/preventivi/servizio";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params;
    const p = await approva(id);
    return Response.json({ pdf: `/api/preventivi/${p.id}/pdf`, accettazione: `/accetta/${p.tokenAccettazione}` });
  } catch (e) {
    return errore(e);
  }
}
