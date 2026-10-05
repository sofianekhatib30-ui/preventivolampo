import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/sito";

// Dominio definitivo non deciso: SITE_URL viene da SITO_URL o è l'indirizzo locale.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/privacy", "/cookie", "/condizioni"].map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.3,
  }));
}
