import type { Metadata } from "next";
import { LINGUE_INDICIZZATE, LOCALE_OG, type LinguaSito, percorso } from "@/lib/i18n/lingue";
import { INDEXABLE } from "@/lib/sito";

// Metadata di una pagina pubblica: titolo, descrizione, canonical sulla propria lingua,
// hreflang fra le lingue indicizzate (più x-default sull'italiano), robots.
// Si indicizza solo con INDEXABLE acceso e solo nelle lingue indicizzate: le altre restano in noindex.

export function indicizzabile(lingua: LinguaSito): boolean {
  return INDEXABLE && LINGUE_INDICIZZATE.includes(lingua);
}

export function alternative(p: string): Record<string, string> {
  const out: Record<string, string> = Object.fromEntries(LINGUE_INDICIZZATE.map((l) => [l, percorso(l, p)]));
  out["x-default"] = percorso("it", p);
  return out;
}

export function metadati({
  lingua,
  p,
  titolo,
  descrizione,
  titoloCompleto = false,
  articolo,
}: {
  lingua: LinguaSito;
  /** percorso senza lingua: "/prezzi" */
  p: string;
  titolo: string;
  descrizione: string;
  /** il titolo contiene già il nome del sito (home) */
  titoloCompleto?: boolean;
  articolo?: { modificato: string };
}): Metadata {
  const title = titoloCompleto ? titolo : `${titolo} · PreventivoLampo`;
  const nelleIndicizzate = LINGUE_INDICIZZATE.includes(lingua);
  return {
    title: { absolute: title },
    description: descrizione,
    alternates: { canonical: percorso(lingua, p), ...(nelleIndicizzate ? { languages: alternative(p) } : {}) },
    robots: { index: indicizzabile(lingua), follow: INDEXABLE },
    openGraph: {
      type: articolo ? "article" : "website",
      siteName: "PreventivoLampo",
      title,
      description: descrizione,
      url: percorso(lingua, p),
      locale: LOCALE_OG[lingua],
      ...(nelleIndicizzate ? { alternateLocale: LINGUE_INDICIZZATE.filter((l) => l !== lingua).map((l) => LOCALE_OG[l]) } : {}),
      ...(articolo ? { modifiedTime: articolo.modificato } : {}),
    },
  };
}
