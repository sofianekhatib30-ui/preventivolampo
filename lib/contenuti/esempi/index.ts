// Esempi delle pagine mestiere: la bozza che il sistema ha ricavato dal racconto inventato
// (campo «dettatura» di ogni pagina). Generati da scripts/esempi-mestieri.ts, non scritti a mano:
// se cambia il racconto, si rigenerano (test/contenuti.test.ts controlla che coincidano).
import type { IdMestiere } from "../registro";
import dati from "./esempi.json";

export type EsempioMotore = {
  data: string;
  /** il racconto da cui è stata ricavata la bozza: deve restare uguale alla dettatura della pagina */
  dettatura: string;
  righe: { voce: string; quantita: number | null; unita: string | null; nota: string | null; materialeCliente: boolean }[];
  domande: string[];
  escluso: string[];
  note: string[];
};

export const ESEMPI = dati as Partial<Record<IdMestiere, EsempioMotore>>;

// Mestieri la cui pagina esce ancora senza esempio: la pagina nasconde la sezione e il pulsante che ci porta.
// Approssimazione dichiarata (11/10/2026): le pagine sono state scritte in una sessione senza ANTHROPIC_API_KEY,
// e un esempio scritto a mano direbbe «ecco cosa fa il sistema» senza che il sistema l'abbia fatto.
// Decade appena c'è la chiave: `npx tsx scripts/esempi-mestieri.ts officina carrozzeria fotografo catering informatico traslochi`,
// poi si svuota questo elenco (il test pretende l'esempio da tutti i mestieri che non sono qui).
export const ESEMPI_DA_GENERARE: readonly IdMestiere[] = ["officina", "carrozzeria", "fotografo", "catering", "informatico", "traslochi"];
