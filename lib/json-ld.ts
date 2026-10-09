import { type LinguaSito, percorso } from "./i18n/lingue";
import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_URL } from "./sito";

// Dati strutturati (schema.org) delle pagine pubbliche. Nessuna valutazione né recensione:
// non ne abbiamo di vere, e non se ne inventano.

const assoluto = (p: string) => new URL(p, SITE_URL).toString();

export function organizzazione() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organizzazione`,
    name: "K Digital Solution",
    url: SITE_URL,
    email: CONTACT_EMAIL,
    brand: { "@type": "Brand", name: "PreventivoLampo" },
  };
}

function euro(price: string, unitText?: "mese" | "anno") {
  return unitText
    ? { "@type": "UnitPriceSpecification", price, priceCurrency: "EUR", valueAddedTaxIncluded: false, unitCode: unitText === "mese" ? "MON" : "ANN", unitText }
    : { "@type": "PriceSpecification", price, priceCurrency: "EUR", valueAddedTaxIncluded: false };
}

// Il servizio come applicazione web, con le offerte della pagina Prezzi (IVA esclusa).
export function applicazione(lingua: LinguaSito, descrizione = SITE_DESCRIPTION) {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#applicazione`,
    name: "PreventivoLampo",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: lingua,
    description: descrizione,
    url: assoluto(percorso(lingua, "/")),
    publisher: { "@id": `${SITE_URL}/#organizzazione` },
    offers: [
      { "@type": "Offer", name: "Programma pilota (30 giorni)", priceSpecification: euro("0") },
      { "@type": "Offer", name: "Canone mensile", priceSpecification: euro("19.90", "mese") },
      { "@type": "Offer", name: "Canone annuale", priceSpecification: euro("199", "anno") },
    ],
  };
}

export function sitoWeb(lingua: LinguaSito) {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#sito`,
    name: "PreventivoLampo",
    url: SITE_URL,
    inLanguage: lingua,
    publisher: { "@id": `${SITE_URL}/#organizzazione` },
  };
}

export function briciole(lingua: LinguaSito, voci: { nome: string; p: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: voci.map((v, i) => ({ "@type": "ListItem", position: i + 1, name: v.nome, item: assoluto(percorso(lingua, v.p)) })),
  };
}

export function articolo(lingua: LinguaSito, a: { titolo: string; descrizione: string; p: string; modificato: string }) {
  return {
    "@type": "Article",
    headline: a.titolo,
    description: a.descrizione,
    inLanguage: lingua,
    dateModified: a.modificato,
    mainEntityOfPage: assoluto(percorso(lingua, a.p)),
    author: { "@id": `${SITE_URL}/#organizzazione` },
    publisher: { "@id": `${SITE_URL}/#organizzazione` },
  };
}

export function grafo(...nodi: object[]) {
  return { "@context": "https://schema.org", "@graph": nodi };
}

// Serializzazione sicura dentro <script>: niente «</script>» possibile.
export function jsonLdHtml(dati: object) {
  return JSON.stringify(dati).replace(/</g, "\\u003c");
}
