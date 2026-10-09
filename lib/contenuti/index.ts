import type { LinguaSito } from "@/lib/i18n/lingue";
import { type Contenuti, contenutiIt } from "./it";

// I contenuti delle pagine nella lingua chiesta. Da usare solo nei componenti server: non devono finire
// nel JavaScript del browser. test/contenuti.test.ts controlla che ogni lingua abbia tutte le chiavi.
const CARICA: Record<Exclude<LinguaSito, "it">, () => Promise<{ default: unknown }>> = {
  en: () => import("./en.json"),
  ro: () => import("./ro.json"),
  sq: () => import("./sq.json"),
  ar: () => import("./ar.json"),
  uk: () => import("./uk.json"),
  es: () => import("./es.json"),
  fr: () => import("./fr.json"),
  de: () => import("./de.json"),
  nl: () => import("./nl.json"),
};

export async function contenutiDi(lingua: LinguaSito): Promise<Contenuti> {
  if (lingua === "it") return contenutiIt as unknown as Contenuti;
  return (await CARICA[lingua]()).default as Contenuti;
}

export type { Contenuti };
