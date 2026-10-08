import { conMembro } from "@/lib/impresa/api";
import { inserisciVoci, vociDemo } from "@/lib/impresa/voci";

// Punto di partenza: il listino di esempio della demo, da correggere con i propri prezzi.
export async function POST(request: Request): Promise<Response> {
  return conMembro(request, async (m) => Response.json(await inserisciVoci(m.impresaId, vociDemo(), "demo")));
}
