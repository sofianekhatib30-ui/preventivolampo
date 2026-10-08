import { leggi } from "@/lib/preventivi/archivio";
import { errore } from "@/lib/preventivi/http";
import { generaPdf } from "@/lib/preventivi/pdf";
import { aziendaDemo } from "@/lib/preventivi/demo";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  try {
    const { id } = await params;
    const p = await leggi(id);
    if (!p || p.stato === "bozza") return Response.json({ errore: "PDF non disponibile." }, { status: 404 });
    const bytes = await generaPdf(p, aziendaDemo());
    return new Response(Buffer.from(bytes), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `inline; filename="preventivo-${p.numero}.pdf"`,
        "cache-control": "no-store",
      },
    });
  } catch (e) {
    return errore(e);
  }
}
