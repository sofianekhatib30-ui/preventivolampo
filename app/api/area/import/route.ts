import { conMembro, limite } from "@/lib/impresa/api";
import { MAX_BYTES, MAX_FILE_AI, preparaImport, type FileCaricato } from "@/lib/impresa/importa";
import { anthropicCaller } from "@/lib/motore/claude";
import { Rifiuto } from "@/lib/preventivi/rifiuto";

export const maxDuration = 60;

// Carico il listino: un Excel o CSV, oppure PDF e foto (anche più d'una, o vecchi preventivi)
// che legge l'AI. Torna l'import da rivedere riga per riga.
export async function POST(request: Request): Promise<Response> {
  return conMembro(request, async (m) => {
    await limite(`import:${m.impresaId}`, 20);
    const form = await request.formData().catch(() => null);
    const file = (form?.getAll("file") ?? []).filter((f): f is File => f instanceof File && f.size > 0);
    if (!file.length) throw new Rifiuto("Scegli il file del listino.", 400);
    if (file.length > MAX_FILE_AI) throw new Rifiuto(`Al massimo ${MAX_FILE_AI} file per volta.`, 400);
    if (file.some((f) => f.size > MAX_BYTES)) throw new Rifiuto("Il file è troppo grande (massimo 5 MB).", 400);
    const caricati: FileCaricato[] = await Promise.all(file.map(async (f) => ({ nome: f.name, bytes: new Uint8Array(await f.arrayBuffer()) })));
    const call = process.env.ANTHROPIC_API_KEY ? anthropicCaller() : null;
    const r = await preparaImport(m.impresaId, caricati, call);
    return Response.json({ ...r, vai: `/area/listino/importa/${r.id}` }, { status: 201 });
  });
}
