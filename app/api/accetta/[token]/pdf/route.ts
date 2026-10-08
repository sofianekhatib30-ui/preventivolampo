import { errore } from "@/lib/preventivi/http";
import { generaPdf } from "@/lib/preventivi/pdf";
import { perToken } from "@/lib/preventivi/risolvi";

// Il PDF per il cliente: si apre con il suo link, senza mai conoscere l'id della bozza.
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }): Promise<Response> {
  try {
    const { token } = await params;
    const trovato = await perToken(token);
    if (!trovato || trovato.p.stato === "bozza") return Response.json({ errore: "PDF non disponibile." }, { status: 404 });
    const bytes = await generaPdf(trovato.p, await trovato.ctx.azienda());
    return new Response(Buffer.from(bytes), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `inline; filename="preventivo-${trovato.p.numero}.pdf"`,
        "cache-control": "private, no-store",
        "x-robots-tag": "noindex",
      },
    });
  } catch (e) {
    return errore(e);
  }
}
