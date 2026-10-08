import { conMembro, corpo, limite } from "@/lib/impresa/api";
import { contestoImpresa } from "@/lib/impresa/preventivi";
import { anthropicCaller } from "@/lib/motore/claude";
import { creaDaTestoIn } from "@/lib/preventivi/servizio";

export const maxDuration = 60;

// Dal racconto del sopralluogo alla bozza, con il listino dell'impresa.
export async function POST(request: Request): Promise<Response> {
  return conMembro(request, async (m) => {
    await limite(`bozze:${m.impresaId}`, 60, "Hai fatto molte bozze nell'ultima ora: riprova tra poco.");
    const b = await corpo(request);
    const p = await creaDaTestoIn(await contestoImpresa(m.impresaId), typeof b.testo === "string" ? b.testo : "", anthropicCaller());
    return Response.json({ id: p.id, revisione: `/area/preventivi/${p.id}`, righe: p.righe.length }, { status: 201 });
  });
}
