import { conMembro, corpo } from "@/lib/impresa/api";
import { aggiungiAlListino, scarta } from "@/lib/impresa/da-prezzare";
import { DatiVoce, primoErrore } from "@/lib/impresa/schema";
import { Rifiuto } from "@/lib/preventivi/rifiuto";

// Una proposta dai preventivi: entra nel listino (con codice e unità) oppure si scarta.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<Response> {
  return conMembro(request, async (m) => {
    const id = (await params).id;
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new Rifiuto("Proposta non trovata.", 404);
    const b = await corpo(request);
    if (b.azione === "scarta") {
      await scarta(m.impresaId, id);
      return Response.json({ ok: true });
    }
    const r = DatiVoce.safeParse(b.voce);
    if (!r.success) throw new Rifiuto(primoErrore(r.error), 400);
    await aggiungiAlListino(m.impresaId, id, r.data);
    return Response.json({ ok: true });
  });
}
