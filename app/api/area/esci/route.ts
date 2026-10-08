import { errore } from "@/lib/preventivi/http";
import { chiudiSessione, stessaOrigine } from "@/lib/impresa/sessione";

export async function POST(request: Request): Promise<Response> {
  try {
    if (!stessaOrigine(request)) return Response.json({ errore: "Richiesta non valida." }, { status: 403 });
    await chiudiSessione();
    return Response.json({ vai: "/accedi" });
  } catch (e) {
    return errore(e);
  }
}
