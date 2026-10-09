import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Collegamenti normali (<a>) fra le pagine: il sito ha due layout radice (pagine pubbliche per lingua
  // e area dell'artigiano) e indirizzi per lingua riscritti da proxy.ts, quindi la regola, pensata per
  // indirizzi che corrispondono uno a uno ai file, segnala come errori collegamenti voluti.
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Banco di prova di n8n: script Node (CommonJS) che girano fuori dall'app.
    "n8n/prova/**",
  ]),
]);

export default eslintConfig;
