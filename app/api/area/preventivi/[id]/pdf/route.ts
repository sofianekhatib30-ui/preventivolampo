import { conMembro } from "@/lib/impresa/api";
import { contestoImpresa } from "@/lib/impresa/preventivi";
import { generaPdf } from "@/lib/preventivi/pdf";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  return conMembro(request, async (m) => {
    const ctx = await contestoImpresa(m.impresaId);
    const p = await ctx.leggi((await params).id);
    if (!p || p.stato === "bozza") return Response.json({ errore: "PDF non disponibile." }, { status: 404 });
    const bytes = await generaPdf(p, await ctx.azienda());
    return new Response(Buffer.from(bytes), {
      headers: { "content-type": "application/pdf", "content-disposition": `inline; filename="preventivo-${p.numero}.pdf"`, "cache-control": "private, no-store" },
    });
  });
}
