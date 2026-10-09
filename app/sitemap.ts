import type { MetadataRoute } from "next";
import { AGGIORNATO, percorsiPubblici } from "@/lib/contenuti/registro";
import { LINGUE_INDICIZZATE, percorso } from "@/lib/i18n/lingue";
import { alternative } from "@/lib/seo";
import { SITE_URL } from "@/lib/sito";

// Una voce per ogni pagina pubblica in ogni lingua indicizzata, con le versioni nelle altre lingue
// (hreflang). L'indirizzo assoluto viene da SITE_URL: dominio definitivo quando c'è (SITO_URL).
const assoluto = (p: string) => new URL(p, SITE_URL).toString();

export default function sitemap(): MetadataRoute.Sitemap {
  return percorsiPubblici().flatMap((p) => {
    const languages = Object.fromEntries(Object.entries(alternative(p)).map(([l, u]) => [l, assoluto(u)]));
    const legale = ["/privacy", "/condizioni", "/cookie"].includes(p);
    return LINGUE_INDICIZZATE.map((lingua) => ({
      url: assoluto(percorso(lingua, p)),
      lastModified: AGGIORNATO,
      changeFrequency: legale ? ("yearly" as const) : ("monthly" as const),
      priority: p === "/" ? 1 : legale ? 0.2 : p.startsWith("/preventivo-") || p === "/prezzi" ? 0.9 : 0.7,
      alternates: { languages },
    }));
  });
}
