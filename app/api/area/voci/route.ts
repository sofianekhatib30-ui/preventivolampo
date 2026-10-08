import { conMembro, corpo } from "@/lib/impresa/api";
import { DatiVoce, primoErrore } from "@/lib/impresa/schema";
import { creaVoce } from "@/lib/impresa/voci";
import { Rifiuto } from "@/lib/preventivi/rifiuto";

export async function POST(request: Request): Promise<Response> {
  return conMembro(request, async (m) => {
    const r = DatiVoce.safeParse(await corpo(request));
    if (!r.success) throw new Rifiuto(primoErrore(r.error), 400);
    return Response.json(await creaVoce(m.impresaId, r.data), { status: 201 });
  });
}
