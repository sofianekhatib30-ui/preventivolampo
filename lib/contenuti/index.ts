import type { LinguaSito } from "@/lib/i18n/lingue";
import { type Contenuti, contenutiIt } from "./it";

// I contenuti delle pagine nella lingua chiesta. Da usare solo nei componenti server: non devono finire
// nel JavaScript del browser. Dal 14/10/2026 il sito è solo in italiano (lib/i18n/lingue.ts): en.json,
// ro.json, sq.json, ar.json e uk.json restano nella cartella come archivio, non più caricati.
export async function contenutiDi(lingua: LinguaSito): Promise<Contenuti> {
  void lingua;
  return contenutiIt as unknown as Contenuti;
}

export type { Contenuti };
