import type { NextConfig } from "next";

// Il listino e gli esempi del banco di prova si leggono dal disco a runtime:
// li includo esplicitamente nelle funzioni che li usano.
const listino = ["./dati/listino.json"];

const nextConfig: NextConfig = {
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
};

export default nextConfig;
