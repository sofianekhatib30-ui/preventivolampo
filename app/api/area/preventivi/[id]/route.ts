import { conMembro } from "@/lib/impresa/api";
import { contestoImpresa, eliminaBozza } from "@/lib/impresa/preventivi";
import { Rifiuto } from "@/lib/preventivi/rifiuto";
import { aggiornaBozzaIn } from "@/lib/preventivi/servizio";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx): Promise<Response> {
  return conMembro(request, async (m) => {
    const p = await aggiornaBozzaIn(await contestoImpresa(m.impresaId), (await params).id, await request.json().catch(() => null));
    return Response.json({ ok: true, stato: p.stato });
  });
}

export async function DELETE(request: Request, { params }: Ctx): Promise<Response> {
  return conMembro(request, async (m) => {
    if (!(await eliminaBozza(m.impresaId, (await params).id))) throw new Rifiuto("Si possono eliminare solo le bozze.", 409);
    return Response.json({ vai: "/area" });
  });
}
