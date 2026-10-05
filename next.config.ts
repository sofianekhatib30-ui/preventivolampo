import type { NextConfig } from "next";

// Il listino e gli esempi del banco di prova si leggono dal disco a runtime:
// li includo esplicitamente nelle funzioni che li usano.
const listino = ["./dati/listino.json"];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/prova": ["./testset/copioni/**", "./testset/atteso/**"],
    "/api/elabora": listino,
    "/api/preventivi/**": listino,
    "/api/accetta/**": listino,
    "/revisione/**": listino,
    "/accetta/**": listino,
  },
};

export default nextConfig;
