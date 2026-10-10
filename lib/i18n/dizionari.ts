import { type Dizionario, it } from "./it";
import type { LinguaSito } from "./lingue";
import ar from "./ar.json";
import en from "./en.json";
import ro from "./ro.json";
import sq from "./sq.json";
import uk from "./uk.json";

// Tutti i dizionari. La forma (stesse chiavi, stessi segnaposto) la controlla test/dizionari.test.ts.
export const DIZIONARI: Record<LinguaSito, Dizionario> = {
  it,
  en: en as Dizionario,
  ro: ro as Dizionario,
  sq: sq as Dizionario,
  ar: ar as Dizionario,
  uk: uk as Dizionario,
};
