import { corpo, ipDi, limite, senzaSessione } from "@/lib/impresa/api";
import { emailValida, inviaCodice } from "@/lib/impresa/accesso";

// Primo passo dell'accesso: mando il codice all'email.
export async function POST(request: Request): Promise<Response> {
  return senzaSessione(request, async () => {
    const b = await corpo(request);
    const email = emailValida(b.email);
    await limite(`codice-ip:${ipDi(request)}`, 10);
    await limite(`codice-email:${email}`, 5, "Troppi codici chiesti per questa email. Riprova tra un'ora.");
    await inviaCodice(email);
    return Response.json({ ok: true });
  });
}
