import type { Esito } from "./gestore";
import { MESSAGGI, testoConferma } from "./messaggi";
import { FIELD_ORDER } from "./schema";

// Pagina di risposta per chi invia il modulo senza JavaScript (form HTML con action).
// Con JavaScript il modulo riceve JSON e non ricarica la pagina.

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const STILE = `
body{margin:0;background:#FFC21F;color:#16150F;font-family:ui-sans-serif,system-ui,sans-serif}
main{max-width:640px;margin:0 auto;padding:64px 20px;display:flex;flex-direction:column;gap:20px}
h1{margin:0;font-size:40px;line-height:1;font-weight:900}
p,li{font-size:18px;line-height:1.5}
a{color:#16150F;font-weight:700}
a:focus-visible{outline:3px solid #16150F;outline-offset:3px}
`;

export function paginaEsito(esito: Esito): string {
  let titolo: string;
  let corpo: string;
  let link: string;

  if (esito.stato === "ok") {
    titolo = testoConferma(esito.nome);
    corpo = "";
    link = `<a href="/">${MESSAGGI.tornaAllaHome}</a>`;
  } else {
    titolo = MESSAGGI.titoloNonInviata;
    link = `<a href="/#candidatura">${MESSAGGI.tornaAlModulo}</a>`;
    if (esito.stato === "campi") {
      const voci = FIELD_ORDER.flatMap((campo) => {
        const errore = esito.errori[campo];
        return errore ? [`<li>${escapeHtml(errore)}</li>`] : [];
      });
      corpo = `<p>${MESSAGGI.campiDaCorreggere}</p><ul>${voci.join("")}</ul>`;
    } else {
      const messaggio =
        esito.stato === "troppo-rapido"
          ? MESSAGGI.troppoRapido
          : esito.stato === "troppi-invii"
            ? MESSAGGI.troppiInvii
            : MESSAGGI.errore;
      corpo = `<p>${escapeHtml(messaggio)}</p>`;
    }
  }

  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(esito.stato === "ok" ? MESSAGGI.titoloInviata : MESSAGGI.titoloNonInviata)} · PreventivoLampo</title>
<style>${STILE}</style></head>
<body><main><h1>${escapeHtml(titolo)}</h1>${corpo}<p>${link}</p></main></body></html>`;
}
