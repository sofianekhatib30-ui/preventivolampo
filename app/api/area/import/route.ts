import { conMembro, limite } from "@/lib/impresa/api";
import { MAX_BYTES, preparaImport } from "@/lib/impresa/importa";
import { anthropicCaller } from "@/lib/motore/claude";
import { Rifiuto } from "@/lib/preventivi/rifiuto";

export const maxDuration = 60;

// Carico il file del listino: torna l'import da rivedere riga per riga.
export async function POST(request: Request): Promise<Response> {
  return conMembro(request, async (m) => {
    await limite(`import:${m.impresaId}`, 20);
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File)) throw new Rifiuto("Scegli il file del listino.", 400);
    if (file.size > MAX_BYTES) throw new Rifiuto("Il file è troppo grande (massimo 5 MB).", 400);
    const call = process.env.ANTHROPIC_API_KEY ? anthropicCaller() : null;
    const r = await preparaImport(m.impresaId, file.name, new Uint8Array(await file.arrayBuffer()), call);
    return Response.json({ ...r, vai: `/area/listino/importa/${r.id}` }, { status: 201 });
  });
}
