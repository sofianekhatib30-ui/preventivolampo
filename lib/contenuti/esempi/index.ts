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
