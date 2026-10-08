import { corpo, ipDi, limite, senzaSessione } from "@/lib/impresa/api";
import { emailValida, verificaCodice } from "@/lib/impresa/accesso";
import { db, ok } from "@/lib/impresa/db";
import { apriSessione } from "@/lib/impresa/sessione";

// Secondo passo: il codice giusto apre la sessione. Chi non ha ancora un'impresa va alla registrazione.
export async function POST(request: Request): Promise<Response> {
  return senzaSessione(request, async () => {
    const b = await corpo(request);
    const email = emailValida(b.email);
    await limite(`entra-ip:${ipDi(request)}`, 30);
    await limite(`entra-email:${email}`, 10, "Troppi tentativi per questa email. Chiedi un codice nuovo tra un'ora.");
    const u = await verificaCodice(email, b.codice);
    await apriSessione(u.userId, u.email);
    const m = ok(await db().from("pl_membri").select("impresa_id").eq("user_id", u.userId).maybeSingle(), "membro");
    return Response.json({ vai: m ? "/area" : "/area/benvenuto" });
  });
}
