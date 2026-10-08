import { errore } from "@/lib/preventivi/http";
import { perToken } from "@/lib/preventivi/risolvi";

// Il logo dell'impresa sulla pagina del cliente.
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }): Promise<Response> {
  try {
    const { token } = await params;
    const trovato = await perToken(token);
    const logo = trovato && trovato.p.stato !== "bozza" ? await (await trovato.ctx.azienda()).logo() : null;
    if (!logo) return new Response(null, { status: 404 });
    return new Response(Buffer.from(logo.bytes), {
      headers: { "content-type": logo.tipo, "cache-control": "private, max-age=3600", "x-content-type-options": "nosniff" },
    });
  } catch (e) {
    return errore(e);
  }
}
