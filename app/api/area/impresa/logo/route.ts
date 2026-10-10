import { conMembro } from "@/lib/impresa/api";
import { leggiImpresa, leggiLogo, salvaLogo, togliLogo } from "@/lib/impresa/imprese";
import { Rifiuto } from "@/lib/preventivi/rifiuto";
import type { Membro } from "@/lib/impresa/sessione";

export async function GET(request: Request): Promise<Response> {
  return conMembro(request, async (m) => {
    const imp = await leggiImpresa(m.impresaId);
    const logo = imp ? await leggiLogo(imp) : null;
    if (!logo) return new Response(null, { status: 404 });
    return new Response(Buffer.from(logo.bytes), { headers: { "content-type": logo.tipo, "cache-control": "private, no-cache", "x-content-type-options": "nosniff" } });
  });
}

// Il logo va su ogni PDF mandato ai clienti: lo cambia solo chi cambia i dati dell'impresa.
function soloTitolare(m: Membro): void {
  if (m.ruolo !== "titolare") throw new Rifiuto("Solo il titolare o un amministratore cambia il logo dell'impresa.", 403);
}

export async function POST(request: Request): Promise<Response> {
  return conMembro(request, async (m) => {
    soloTitolare(m);
    const form = await request.formData().catch(() => null);
    const file = form?.get("logo");
    if (!(file instanceof File)) throw new Rifiuto("Scegli un'immagine.", 400);
    if (file.size > 1_000_000) throw new Rifiuto("Il logo deve essere un'immagine PNG o JPG fino a 1 MB.", 400);
    await salvaLogo(m.impresaId, new Uint8Array(await file.arrayBuffer()));
    return Response.json({ ok: true });
  });
}

export async function DELETE(request: Request): Promise<Response> {
  return conMembro(request, async (m) => {
    soloTitolare(m);
    await togliLogo(m.impresaId);
    return Response.json({ ok: true });
  });
}
