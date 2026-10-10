import { conMembro, conSessione, corpo } from "@/lib/impresa/api";
import { aggiornaImpresa, creaImpresa } from "@/lib/impresa/imprese";
import { DatiImpresa, primoErrore } from "@/lib/impresa/schema";
import { Rifiuto } from "@/lib/preventivi/rifiuto";

function dati(b: unknown) {
  const r = DatiImpresa.safeParse(b);
  if (!r.success) throw new Rifiuto(primoErrore(r.error), 400);
  return r.data;
}

// Registrazione dell'impresa (una per organizzazione) e modifica dei dati.
export async function POST(request: Request): Promise<Response> {
  return conSessione(request, async (c) => {
    const id = await creaImpresa(c, dati(await corpo(request)));
    return Response.json({ id, vai: "/area/listino?nuovo=1" }, { status: 201 });
  });
}

export async function PUT(request: Request): Promise<Response> {
  return conMembro(request, async (m) => {
    if (m.ruolo !== "titolare") throw new Rifiuto("Solo il titolare cambia i dati dell'impresa.", 403);
    await aggiornaImpresa(m.impresaId, dati(await corpo(request)));
    return Response.json({ ok: true });
  });
}
