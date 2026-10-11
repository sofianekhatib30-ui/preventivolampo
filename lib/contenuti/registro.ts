// Le pagine indicizzabili del sito: identificativi, indirizzi e collegamenti fra pagine.
// Gli indirizzi sono in italiano in tutte le lingue: /ro/preventivo-idraulico.
import { contenutiIt } from "./it";

export type IdMestiere = keyof typeof contenutiIt.mestieri;
export type IdFunzione = keyof typeof contenutiIt.funzioni;
export type IdGuida = keyof typeof contenutiIt.guide;

export const MESTIERI = Object.keys(contenutiIt.mestieri) as IdMestiere[];
export const FUNZIONI = Object.keys(contenutiIt.funzioni) as IdFunzione[];
export const GUIDE = Object.keys(contenutiIt.guide) as IdGuida[];

export const SLUG_MESTIERE: Record<IdMestiere, string> = {
  elettricista: "preventivo-elettricista",
  idraulico: "preventivo-idraulico",
  imbianchino: "preventivo-imbianchino",
  piastrellista: "preventivo-piastrellista",
  muratore: "preventivo-muratore",
  impresa: "preventivo-impresa-edile",
  termoidraulico: "preventivo-termoidraulico",
  cartongessista: "preventivo-cartongessista",
  serramentista: "preventivo-serramentista",
  falegname: "preventivo-falegname",
  fabbro: "preventivo-fabbro",
  giardiniere: "preventivo-giardiniere",
  officina: "preventivo-officina",
  carrozzeria: "preventivo-carrozzeria",
  fotografo: "preventivo-fotografo",
  catering: "preventivo-catering",
  informatico: "preventivo-tecnico-informatico",
  traslochi: "preventivo-trasloco",
};

export function mestiereDaSlug(slug: string): IdMestiere | undefined {
  return MESTIERI.find((m) => SLUG_MESTIERE[m] === slug);
}

// Mestieri che lavorano spesso nello stesso cantiere: si linkano fra loro.
export const VICINI: Record<IdMestiere, IdMestiere[]> = {
  elettricista: ["termoidraulico", "cartongessista", "impresa"],
  idraulico: ["termoidraulico", "piastrellista", "muratore"],
  imbianchino: ["cartongessista", "muratore", "impresa"],
  piastrellista: ["idraulico", "muratore", "impresa"],
  muratore: ["piastrellista", "impresa", "imbianchino"],
  impresa: ["muratore", "elettricista", "idraulico"],
  termoidraulico: ["idraulico", "elettricista", "impresa"],
  cartongessista: ["imbianchino", "elettricista", "muratore"],
  serramentista: ["fabbro", "falegname", "muratore"],
  falegname: ["serramentista", "imbianchino", "fabbro"],
  fabbro: ["serramentista", "giardiniere", "falegname"],
  giardiniere: ["fabbro", "muratore", "impresa"],
  officina: ["carrozzeria", "informatico", "traslochi"],
  carrozzeria: ["officina", "fabbro", "imbianchino"],
  fotografo: ["catering", "informatico", "giardiniere"],
  catering: ["fotografo", "traslochi", "giardiniere"],
  informatico: ["elettricista", "fotografo", "officina"],
  traslochi: ["imbianchino", "falegname", "giardiniere"],
};

// Guide da proporre su ogni pagina mestiere. Chi non lavora sulle case (officina, eventi, aziende) non riceve la
// guida sull'IVA dei lavori in casa: al suo posto quella sul cliente straniero.
const GUIDE_CASA: IdGuida[] = ["come-fare-un-preventivo", "preventivo-a-corpo-o-a-misura", "iva-preventivo-lavori-casa"];
const GUIDE_ALTRI: IdGuida[] = ["come-fare-un-preventivo", "preventivo-cliente-straniero", "recesso-preventivo-accettato-a-casa"];
const FUORI_CASA = new Set<string>(["officina", "carrozzeria", "fotografo", "catering", "informatico", "traslochi"]);
export const guideMestiere = (m: IdMestiere): IdGuida[] => (FUORI_CASA.has(m) ? GUIDE_ALTRI : GUIDE_CASA);

export const percorsoMestiere = (m: IdMestiere) => `/${SLUG_MESTIERE[m]}`;
export const percorsoFunzione = (f: IdFunzione) => `/funzioni/${f}`;
export const percorsoGuida = (g: IdGuida) => `/guide/${g}`;

// Tutte le pagine pubbliche, senza prefisso di lingua: sitemap e controlli.
export function percorsiPubblici(): string[] {
  return [
    "/",
    "/mestieri",
    ...MESTIERI.map(percorsoMestiere),
    "/funzioni",
    ...FUNZIONI.map(percorsoFunzione),
    "/prezzi",
    "/guide",
    ...GUIDE.map(percorsoGuida),
    "/glossario",
    "/modelli",
    "/chi-siamo",
    "/privacy",
    "/condizioni",
    "/cookie",
  ];
}

// Data dell'ultimo aggiornamento dei contenuti, mostrata sulle pagine e nella sitemap.
export const AGGIORNATO = "2026-10-09";
