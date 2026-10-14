import type { NextConfig } from "next";

// Il listino e gli esempi del banco di prova si leggono dal disco a runtime:
// li includo esplicitamente nelle funzioni che li usano.
const listino = ["./dati/listino.json"];

const nextConfig: NextConfig = {
  // Due layout radice (pagine pubbliche per lingua e area): la 404 globale li scavalca.
  experimental: { globalNotFound: true },
  outputFileTracingIncludes: {
    "/prova": ["./testset/copioni/**", "./testset/atteso/**"],
    "/api/elabora": [...listino, "./misure/uscite/**"],
    "/api/preventivi/**": listino,
    "/api/accetta/**": listino,
    "/revisione/**": listino,
    "/accetta/**": listino,
    "/area/**": listino,
    "/api/area/**": listino,
  },
  // Lettore Excel: resta un pacchetto Node esterno (le sue dipendenze facoltative, come S3, non si impacchettano).
  serverExternalPackages: ["read-excel-file", "unzipper"],
  // Le pagine in spagnolo, francese, tedesco e olandese sono state tolte l'11/10/2026 (erano in noindex), quelle
  // in inglese, rumeno, albanese, arabo e ucraino il 14/10/2026 (solo italiano): chi arriva da un vecchio link
  // trova la pagina italiana. Elenco uguale a LINGUE_TOLTE in lib/i18n/lingue.ts.
  async redirects() {
    return [
      { source: "/:lingua(es|fr|de|nl|en|ro|sq|ar|uk)", destination: "/", permanent: true },
      { source: "/:lingua(es|fr|de|nl|en|ro|sq|ar|uk)/:resto*", destination: "/:resto*", permanent: true },
      // La pagina del preventivo in inglese è stata tolta il 14/10/2026 (solo italiano): resta la guida sul cliente straniero.
      { source: "/funzioni/preventivo-in-lingua-del-cliente", destination: "/guide/preventivo-cliente-straniero", permanent: true },
    ];
  },
  // Intestazioni di sicurezza su tutto il sito. Dal 10/10/2026 qui vive anche il cookie della sessione
  // unica di K Digital Solution (leggibile dagli script, valido su tutto .kdigitalsolution.it): gli script
  // vengono solo da qui e dall'account (la barra comune). 'unsafe-inline' resta per gli script che Next
  // scrive nella pagina: toglierlo richiede i nonce, ed è il passo successivo.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://account.kdigitalsolution.it",
      "style-src 'self' 'unsafe-inline' https://account.kdigitalsolution.it",
      "font-src 'self' data: https://account.kdigitalsolution.it",
      "img-src 'self' data: blob:",
      "media-src 'self' blob:",
      "connect-src 'self' https://ctgzabjmbddxtaxdmvic.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; ");
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
