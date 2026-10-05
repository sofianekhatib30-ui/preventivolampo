import type { MetadataRoute } from "next";
import { INDEXABLE } from "@/lib/sito";

// Finché la home non è in produzione blocca tutto, coerente con il noindex dei metadata.
// Quando INDEXABLE diventa true, aggiungere qui la sitemap sul dominio definitivo.
export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" } };
}
