import { type Dizionario, it } from "./it";
import type { LinguaSito } from "./lingue";
import ar from "./ar.json";
import de from "./de.json";
import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";
import nl from "./nl.json";
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
  es: es as Dizionario,
  fr: fr as Dizionario,
  de: de as Dizionario,
  nl: nl as Dizionario,
};
