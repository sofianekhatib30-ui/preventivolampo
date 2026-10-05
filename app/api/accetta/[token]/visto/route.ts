import { errore } from "@/lib/preventivi/http";
import { segnaVisto } from "@/lib/preventivi/servizio";

// La pagina del cliente lo chiama dal browser dopo il caricamento: l'anteprima del link
// su WhatsApp non esegue JavaScript, quindi non conta come «visto».
export async function POST(_request: Request, { params }: { params: Promise<{ token: string }> }): Promise<Response> {
  try {
    const { token } = await params;
    await segnaVisto(token);
    return new Response(null, { status: 204 });
  } catch (e) {
    return errore(e);
  }
}
