import type { Famiglia } from "@/lib/impresa/mestieri";
import type { IdMestiere } from "./registro";

// Ordine delle famiglie di mestieri sulla pagina unica /mestieri, nel menu e nel piede: prima quelle fuori
// dall'edilizia (Sofiane, 11/10/2026: «anche i mestieri sono troppo edili»).
export const ORDINE_FAMIGLIE: readonly Famiglia[] = ["casa", "auto", "eventi", "aziende", "persone", "impianti", "edilizia", "altro"];

// Dal catalogo dei mestieri (lib/impresa/mestieri.ts) alla pagina con le voci tipiche, per i mestieri che ce l'hanno.
// Gli altri stanno solo nell'elenco unico di /mestieri (Sofiane, 11/10/2026: «non penso che serva una pagina per
// ciascuno ma ne basta una ovvero mestieri che gli elenca tutti»).
export const PAGINA_DEL_MESTIERE: Partial<Record<string, IdMestiere>> = {
  impresaEdile: "impresa",
  muratore: "muratore",
  imbianchino: "imbianchino",
  piastrellista: "piastrellista",
  cartongessista: "cartongessista",
  serramentista: "serramentista",
  fabbro: "fabbro",
  falegname: "falegname",
  idraulico: "idraulico",
  caldaie: "termoidraulico",
  elettricista: "elettricista",
  giardiniere: "giardiniere",
};
