import { conMembro, corpo, limite } from "@/lib/impresa/api";
import { contestoImpresa } from "@/lib/impresa/preventivi";
import { anthropicCaller } from "@/lib/motore/claude";
import { traduciIn } from "@/lib/preventivi/servizio";

export const maxDuration = 60;

// Traduce le voci della bozza nella lingua del cliente (o torna all'italiano).
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  return conMembro(request, async (m) => {
    await limite(`traduzioni:${m.impresaId}`, 60, "Hai fatto molte traduzioni nell'ultima ora: riprova tra poco.");
    const b = await corpo(request);
    const p = await traduciIn(await contestoImpresa(m.impresaId), (await params).id, b.lingua, anthropicCaller());
    return Response.json({ lingua: p.lingua ?? "it", traduzione: p.traduzione ?? null });
  });
}
