// Lingue del sito e dell'area. L'italiano è la lingua principale: il testo che fa fede, quello da cui
// partono le traduzioni, quello mostrato quando la preferenza manca o non è valida.
// La scelta resta in un cookie tecnico di preferenza (pl_lingua), senza bisogno di consenso.
// I preventivi restano in italiano qualunque sia la lingua dell'interfaccia: la lingua del cliente
// si sceglie a parte, per ogni preventivo (lib/preventivi/lingua.ts).

// Dal 14/10/2026 (decisione di Sofiane, alla lettera: «no solo italiano») l'interfaccia è solo in italiano.
// Inglese, rumeno, albanese, arabo e ucraino (11/10) e prima spagnolo, francese, tedesco e olandese sono stati
// tolti: i loro indirizzi rimandano all'italiano (next.config.ts). I dizionari tradotti restano nella cartella
// come archivio, per quando tornerà l'inglese. Condizione che fa decadere questa riga: Sofiane riapre l'inglese.
export const LINGUE_SITO = ["it"] as const;
export const LINGUE_TOLTE = ["es", "fr", "de", "nl", "en", "ro", "sq", "ar", "uk"] as const;
export type LinguaSito = (typeof LINGUE_SITO)[number];

export const COOKIE_LINGUA = "pl_lingua";

// Nome della lingua scritto in quella lingua, e bandiera di riferimento (file in public/bandiere/).
// Per l'arabo, parlato in molti paesi, la bandiera del Marocco: la comunità più numerosa fra gli
// artigiani arabofoni in Italia.
export const INFO_LINGUA: Record<LinguaSito, { nome: string; bandiera: string; dir: "ltr" | "rtl" }> = {
  it: { nome: "Italiano", bandiera: "it", dir: "ltr" },
};

export function linguaValida(v: string | undefined | null): LinguaSito {
  return (LINGUE_SITO as readonly string[]).includes(v ?? "") ? (v as LinguaSito) : "it";
}

// Le pagine pubbliche hanno un indirizzo per lingua: l'italiano senza prefisso, le altre in
// sottocartella (/ro/preventivo-idraulico). Così ogni lingua è una pagina che i motori di ricerca vedono.
// Indicizzate (hreflang, sitemap, index) solo le lingue qui sotto: sono quelle degli artigiani
// stranieri più numerosi nell'edilizia, più l'inglese. Le altre esistono per chi le sceglie, in noindex.
export const LINGUE_INDICIZZATE: readonly LinguaSito[] = ["it"];

export const LOCALE_OG: Record<LinguaSito, string> = {
  it: "it_IT",
};

/** Indirizzo di una pagina pubblica nella lingua data: percorso("ro", "/prezzi") → "/ro/prezzi". */
export function percorso(lingua: LinguaSito, p = "/"): string {
  if (lingua === "it") return p;
  const i = p.indexOf("#");
  const base = i === -1 ? p : p.slice(0, i);
  const ancora = i === -1 ? "" : p.slice(i);
  return `/${lingua}${base === "/" ? "" : base}${ancora}`;
}

/** Separa il prefisso di lingua da un indirizzo: "/ro/prezzi" → { lingua: "ro", resto: "/prezzi" }. */
export function togliLingua(pathname: string): { lingua: LinguaSito | null; resto: string } {
  const m = /^\/([a-z]{2})(?=\/|$)(.*)$/.exec(pathname);
  if (m && (LINGUE_SITO as readonly string[]).includes(m[1])) return { lingua: m[1] as LinguaSito, resto: m[2] || "/" };
  return { lingua: null, resto: pathname };
}
