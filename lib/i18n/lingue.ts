// Lingue del sito e dell'area. L'italiano è la lingua principale: il testo che fa fede, quello da cui
// partono le traduzioni, quello mostrato quando la preferenza manca o non è valida.
// La scelta resta in un cookie tecnico di preferenza (pl_lingua), senza bisogno di consenso.
// I preventivi restano in italiano qualunque sia la lingua dell'interfaccia: la lingua del cliente
// si sceglie a parte, per ogni preventivo (lib/preventivi/lingua.ts).

export const LINGUE_SITO = ["it", "en", "ro", "sq", "ar", "uk", "es", "fr", "de", "nl"] as const;
export type LinguaSito = (typeof LINGUE_SITO)[number];

export const COOKIE_LINGUA = "pl_lingua";

// Nome della lingua scritto in quella lingua, e bandiera di riferimento (file in public/bandiere/).
// Per l'arabo, parlato in molti paesi, la bandiera del Marocco: la comunità più numerosa fra gli
// artigiani arabofoni in Italia.
export const INFO_LINGUA: Record<LinguaSito, { nome: string; bandiera: string; dir: "ltr" | "rtl" }> = {
  it: { nome: "Italiano", bandiera: "it", dir: "ltr" },
  en: { nome: "English", bandiera: "gb", dir: "ltr" },
  ro: { nome: "Română", bandiera: "ro", dir: "ltr" },
  sq: { nome: "Shqip", bandiera: "al", dir: "ltr" },
  ar: { nome: "العربية", bandiera: "ma", dir: "rtl" },
  uk: { nome: "Українська", bandiera: "ua", dir: "ltr" },
  es: { nome: "Español", bandiera: "es", dir: "ltr" },
  fr: { nome: "Français", bandiera: "fr", dir: "ltr" },
  de: { nome: "Deutsch", bandiera: "de", dir: "ltr" },
  nl: { nome: "Nederlands", bandiera: "nl", dir: "ltr" },
};

export function linguaValida(v: string | undefined | null): LinguaSito {
  return (LINGUE_SITO as readonly string[]).includes(v ?? "") ? (v as LinguaSito) : "it";
}
