import { archivioPredefinito, type ArchivioCandidature } from "./archivio";
import { clientIp, limitatoreCandidature, type LimitatoreFrequenza } from "./limite";
import { MESSAGGI } from "./messaggi";
import { paginaEsito } from "./pagina-esito";
import {
  formDataToInput,
  HONEYPOT_FIELD,
  MIN_FILL_MS,
  STARTED_AT_FIELD,
  validateCandidatura,
  type FieldErrors,
} from "./schema";

// Logica di POST /api/candidatura. Ogni difesa sta qui, in un solo punto: la route non
// fa altro che chiamare questa funzione, e l'archivio si raggiunge solo da qui.
//
// Nei log non finisce mai un dato personale: né i campi del modulo né l'IP.

export type Esito =
  | { stato: "ok"; nome: string }
  | { stato: "campi"; errori: FieldErrors }
  | { stato: "troppo-rapido" }
  | { stato: "troppi-invii" }
  | { stato: "errore" };

const STATUS: Record<Esito["stato"], number> = {
  ok: 200,
  campi: 422,
  "troppo-rapido": 400,
  "troppi-invii": 429,
  errore: 500,
};

export type Dipendenze = {
  archivio: ArchivioCandidature;
  limitatore: LimitatoreFrequenza;
  ora: () => number;
};

export function dipendenzePredefinite(): Dipendenze {
  return { archivio: archivioPredefinito(), limitatore: limitatoreCandidature, ora: Date.now };
}

export async function valutaCandidatura(request: Request, dip: Dipendenze): Promise<Esito> {
  const now = dip.ora();
  if (!dip.limitatore.consenti(clientIp(request.headers), now)) return { stato: "troppi-invii" };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { stato: "errore" };
  }

  const input = formDataToInput(form);

  // Campo esca: una persona non lo vede e non lo riempie. Si risponde come se fosse
  // andato tutto bene, per non insegnare niente a chi automatizza, e non si salva nulla.
  const honeypot = form.get(HONEYPOT_FIELD);
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    const nome = typeof input.nome === "string" ? input.nome.trim() : "";
    return { stato: "ok", nome };
  }

  // Tempo minimo di compilazione. Il momento di inizio lo scrive il modulo nel browser;
  // senza JavaScript il campo resta vuoto e il controllo non si applica (dichiarato).
  const startedRaw = form.get(STARTED_AT_FIELD);
  if (typeof startedRaw === "string" && startedRaw !== "") {
    const startedAt = Number(startedRaw);
    if (!Number.isFinite(startedAt) || startedAt > now || now - startedAt < MIN_FILL_MS) {
      return { stato: "troppo-rapido" };
    }
  }

  const result = validateCandidatura(input);
  if (!result.ok) return { stato: "campi", errori: result.errors };

  try {
    await dip.archivio.salva(result.data, new Date(now));
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String(error.code) : "sconosciuto";
    console.error(`candidatura: salvataggio non riuscito (codice ${code})`);
    return { stato: "errore" };
  }
  return { stato: "ok", nome: result.data.nome };
}

function wantsJson(request: Request): boolean {
  return (request.headers.get("accept") ?? "").includes("application/json");
}

export async function gestisciCandidatura(
  request: Request,
  dip: Dipendenze = dipendenzePredefinite(),
): Promise<Response> {
  const esito = await valutaCandidatura(request, dip);
  const status = STATUS[esito.stato];
  const headers = { "Cache-Control": "no-store" };

  if (wantsJson(request)) {
    return Response.json(corpoJson(esito), { status, headers });
  }
  // Senza JavaScript il modulo arriva come form HTML: si risponde con una pagina.
  return new Response(paginaEsito(esito), {
    status,
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  });
}

function corpoJson(esito: Esito) {
  switch (esito.stato) {
    case "ok":
      return { ok: true, nome: esito.nome };
    case "campi":
      return { ok: false, errori: esito.errori };
    case "troppo-rapido":
      return { ok: false, messaggio: MESSAGGI.troppoRapido };
    case "troppi-invii":
      return { ok: false, messaggio: MESSAGGI.troppiInvii };
    case "errore":
      return { ok: false, messaggio: MESSAGGI.errore };
  }
}
