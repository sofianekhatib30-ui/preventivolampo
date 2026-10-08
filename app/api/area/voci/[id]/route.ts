import { conMembro, corpo } from "@/lib/impresa/api";
import { DatiVoce, primoErrore } from "@/lib/impresa/schema";
import { aggiornaVoce, togliVoce } from "@/lib/impresa/voci";
import { Rifiuto } from "@/lib/preventivi/rifiuto";

type Ctx = { params: Promise<{ id: string }> };
const uuid = (id: string) => {
  if (!/^[0-9a-f-]{36}$/.test(id)) throw new Rifiuto("Voce non trovata.", 404);
  return id;
};

export async function PUT(request: Request, { params }: Ctx): Promise<Response> {
  return conMembro(request, async (m) => {
    const id = uuid((await params).id);
    const r = DatiVoce.safeParse(await corpo(request));
    if (!r.success) throw new Rifiuto(primoErrore(r.error), 400);
    return Response.json(await aggiornaVoce(m.impresaId, id, r.data));
  });
}

export async function DELETE(request: Request, { params }: Ctx): Promise<Response> {
  return conMembro(request, async (m) => {
    await togliVoce(m.impresaId, uuid((await params).id));
    return Response.json({ ok: true });
  });
}
