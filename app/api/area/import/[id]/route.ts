import { conMembro, corpo } from "@/lib/impresa/api";
import { annullaImport, confermaImport, rimappa } from "@/lib/impresa/importa";

type Ctx = { params: Promise<{ id: string }> };

// Cambio delle colonne: le righe si rifanno dal file.
export async function PUT(request: Request, { params }: Ctx): Promise<Response> {
  return conMembro(request, async (m) => {
    await rimappa(m.impresaId, (await params).id, (await corpo(request)).mappa);
    return Response.json({ ok: true });
  });
}

// Conferma: entrano nel listino le righe spuntate.
export async function POST(request: Request, { params }: Ctx): Promise<Response> {
  return conMembro(request, async (m) => {
    const esito = await confermaImport(m.impresaId, (await params).id, (await corpo(request)).righe);
    return Response.json({ ...esito, vai: "/area/listino" });
  });
}

export async function DELETE(request: Request, { params }: Ctx): Promise<Response> {
  return conMembro(request, async (m) => {
    await annullaImport(m.impresaId, (await params).id);
    return Response.json({ vai: "/area/listino" });
  });
}
