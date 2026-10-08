import { SITE_DESCRIPTION, SITE_URL } from "./sito";

// JSON-LD Service della home (SPEC, «SEO, condivisione, dati strutturati»).
// I prezzi sono quelli della sezione Prezzi della pagina, IVA esclusa.
export function serviceJsonLd() {
  const euro = (price: string) => ({
    "@type": "PriceSpecification",
    price,
    priceCurrency: "EUR",
    valueAddedTaxIncluded: false,
  });
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "PreventivoLampo",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    provider: {
      "@type": "Organization",
      name: "K Digital Solution",
      email: "studio@kdigitalsolution.it",
      address: { "@type": "PostalAddress", addressLocality: "Monza", addressRegion: "MB", addressCountry: "IT" },
    },
    areaServed: { "@type": "AdministrativeArea", name: "Monza e Brianza" },
    offers: [
      {
        "@type": "Offer",
        name: "Programma pilota",
        priceSpecification: euro("0"),
      },
      {
        "@type": "Offer",
        name: "Avvio fatto per te",
        priceSpecification: euro("150"),
      },
      {
        "@type": "Offer",
        name: "Canone",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "29",
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
          unitCode: "MON",
          unitText: "mese",
        },
      },
      {
        "@type": "Offer",
        name: "Canone annuale",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "290",
          priceCurrency: "EUR",
          valueAddedTaxIncluded: false,
          unitCode: "ANN",
          unitText: "anno",
        },
      },
    ],
  };
}
