import { errore } from "@/lib/preventivi/http";
import { pulisci } from "@/lib/preventivi/archivio";

// Cron di Vercel (vercel.json, ogni notte): cancella i dati della demo più vecchi di 7 giorni.
// Se CRON_SECRET è impostato, Vercel lo manda nell'header e la route lo pretende. Senza segreto
// la chiamata è comunque innocua: cancella solo quello che la regola dei 7 giorni cancellerebbe.
export const maxDuration = 60;

export async function GET(request: Request): Promise<Response> {
  const segreto = process.env.CRON_SECRET;
  if (segreto && request.headers.get("authorization") !== `Bearer ${segreto}`) {
    return Response.json({ errore: "Non autorizzato." }, { status: 401 });
  }
  try {
    const cancellati = await pulisci(7);
    return Response.json({ cancellati });
  } catch (e) {
    return errore(e);
  }
}
