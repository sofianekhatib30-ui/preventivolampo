import { conMembro } from "@/lib/impresa/api";
import { contestoImpresa } from "@/lib/impresa/preventivi";
import { approvaIn } from "@/lib/preventivi/servizio";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  return conMembro(request, async (m) => {
    const p = await approvaIn(await contestoImpresa(m.impresaId), (await params).id);
    return Response.json({ pdf: `/api/area/preventivi/${p.id}/pdf`, accettazione: `/accetta/${p.tokenAccettazione}` });
  });
}
