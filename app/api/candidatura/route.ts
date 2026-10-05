import { gestisciCandidatura } from "@/lib/candidatura/gestore";
import { candidatureAperte } from "@/lib/sito";

// Ricezione del modulo di candidatura. Tutta la logica (difese, validazione, archivio)
// è in lib/candidatura/gestore.ts. Spenta nella demo pubblica (CANDIDATURE_APERTE).
export async function POST(request: Request): Promise<Response> {
  if (!candidatureAperte()) return Response.json({ errore: "Candidature chiuse." }, { status: 404 });
  return gestisciCandidatura(request);
}
