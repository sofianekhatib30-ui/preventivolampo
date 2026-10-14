import { type Dizionario, it } from "./it";
import type { LinguaSito } from "./lingue";

// Tutti i dizionari. Dal 14/10/2026 solo l'italiano (lib/i18n/lingue.ts). en.json, ro.json, sq.json, ar.json e
// uk.json restano qui come archivio: non sono più importati, e il giorno in cui torna l'inglese en.json va
// riallineato alle chiavi di it.ts prima di rimetterlo in questo elenco.
export const DIZIONARI: Record<LinguaSito, Dizionario> = { it };
