// Dati del sito condivisi da metadata, sitemap, immagine Open Graph e JSON-LD.
// Testi: documentazione/index/SPEC.md, sezione «SEO, condivisione, dati strutturati».

// Il dominio definitivo non è deciso: finché manca, gli URL assoluti (sitemap, og:image)
// usano SITO_URL se impostata, poi l'indirizzo di produzione su Vercel, altrimenti quello locale. Nessun canonical finché
// il dominio non è deciso.
// Su Vercel, senza SITO_URL, vale l'indirizzo di produzione del progetto.
export const SITE_URL =
  process.env.SITO_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const SITE_TITLE = "PreventivoLampo — Il preventivo parte dal furgone";

export const SITE_DESCRIPTION =
  "Racconti il sopralluogo a voce o per iscritto: ti torna la bozza con i prezzi del tuo listino e l'IVA edile giusta. Per tutti i mestieri della casa.";

export const CONTACT_EMAIL = "studio@kdigitalsolution.it";

// Finché la pagina non è in produzione (SPEC, «Promesse della pagina»), nessuna indicizzazione.
export const INDEXABLE = false;

// Programma pilota aperto (8/10/2026): la home porta al modulo di candidatura. Con
// CANDIDATURE_APERTE=0 torna la versione dimostrativa (banner e prova del motore).
export function candidatureAperte(): boolean {
  return process.env.CANDIDATURE_APERTE !== "0";
}

// Prova del bot su WhatsApp: oggi è il numero di prova (sandbox) di Twilio, dove ognuno deve prima
// mandare la parola di accesso. Quando ci sarà il numero verificato da Meta si cambiano le due variabili.
export const WHATSAPP_PROVA = {
  numero: process.env.WHATSAPP_PROVA_NUMERO ?? "14155238886",
  accesso: process.env.WHATSAPP_PROVA_ACCESSO ?? "join law-valuable",
};

export function linkWhatsAppProva(): string {
  const { numero, accesso } = WHATSAPP_PROVA;
  return `https://wa.me/${numero.replace(/\D/g, "")}${accesso ? `?text=${encodeURIComponent(accesso)}` : ""}`;
}

export const REPO_URL = "https://github.com/sofianekhatib30-ui/preventivolampo";
