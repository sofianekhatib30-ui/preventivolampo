// I mestieri che Preventivi conosce, per famiglia. Il valore salvato in pl_imprese.mestieri è il nome
// italiano; l'etichetta nella lingua dell'interfaccia viene dal dizionario (area.modulo.mestieri.<chiave>).
// «edile»: il mestiere lavora sulla casa con le regole dell'IVA edile (10% o 22% secondo il lavoro).
// Dal 10/10/2026 il modulo serve tutti i mestieri, non solo l'edilizia (decisione di Sofiane).
// Nessun listino d'esempio per mestiere: i prezzi li carica sempre l'impresa.

export const FAMIGLIE = ["edilizia", "casa", "auto", "eventi", "aziende", "altro"] as const;
export type Famiglia = (typeof FAMIGLIE)[number];

export const ELENCO_MESTIERI = [
  { nome: "Impresa edile", chiave: "impresaEdile", famiglia: "edilizia", edile: true },
  { nome: "Muratore", chiave: "muratore", famiglia: "edilizia", edile: true },
  { nome: "Idraulico", chiave: "idraulico", famiglia: "edilizia", edile: true },
  { nome: "Elettricista", chiave: "elettricista", famiglia: "edilizia", edile: true },
  { nome: "Imbianchino", chiave: "imbianchino", famiglia: "edilizia", edile: true },
  { nome: "Piastrellista", chiave: "piastrellista", famiglia: "edilizia", edile: true },
  { nome: "Cartongessista", chiave: "cartongessista", famiglia: "edilizia", edile: true },
  { nome: "Serramentista", chiave: "serramentista", famiglia: "edilizia", edile: true },
  { nome: "Termoidraulico", chiave: "termoidraulico", famiglia: "edilizia", edile: true },
  { nome: "Fabbro", chiave: "fabbro", famiglia: "edilizia", edile: true },
  { nome: "Falegname", chiave: "falegname", famiglia: "edilizia", edile: true },
  { nome: "Climatizzazione", chiave: "climatizzazione", famiglia: "edilizia", edile: true },
  { nome: "Tetti e lattoneria", chiave: "tetti", famiglia: "edilizia", edile: true },
  { nome: "Pavimenti e parquet", chiave: "pavimenti", famiglia: "edilizia", edile: true },
  { nome: "Giardiniere", chiave: "giardiniere", famiglia: "casa", edile: false },
  { nome: "Pulizie", chiave: "pulizie", famiglia: "casa", edile: false },
  { nome: "Traslochi e sgomberi", chiave: "traslochi", famiglia: "casa", edile: false },
  { nome: "Disinfestazioni", chiave: "disinfestazioni", famiglia: "casa", edile: false },
  { nome: "Tende e zanzariere", chiave: "tende", famiglia: "casa", edile: false },
  { nome: "Tappezziere", chiave: "tappezziere", famiglia: "casa", edile: false },
  { nome: "Vetraio", chiave: "vetraio", famiglia: "casa", edile: false },
  { nome: "Riparazione elettrodomestici", chiave: "elettrodomestici", famiglia: "casa", edile: false },
  { nome: "Officina meccanica", chiave: "officina", famiglia: "auto", edile: false },
  { nome: "Carrozzeria", chiave: "carrozzeria", famiglia: "auto", edile: false },
  { nome: "Gommista", chiave: "gommista", famiglia: "auto", edile: false },
  { nome: "Elettrauto", chiave: "elettrauto", famiglia: "auto", edile: false },
  { nome: "Moto e bici", chiave: "moto", famiglia: "auto", edile: false },
  { nome: "Fotografo e video", chiave: "fotografo", famiglia: "eventi", edile: false },
  { nome: "Catering", chiave: "catering", famiglia: "eventi", edile: false },
  { nome: "Noleggio attrezzature", chiave: "noleggio", famiglia: "eventi", edile: false },
  { nome: "Allestimenti e fiori", chiave: "allestimenti", famiglia: "eventi", edile: false },
  { nome: "Musica e DJ", chiave: "musica", famiglia: "eventi", edile: false },
  { nome: "Organizzazione eventi", chiave: "organizzazioneEventi", famiglia: "eventi", edile: false },
  { nome: "Tecnico informatico", chiave: "informatica", famiglia: "aziende", edile: false },
  { nome: "Grafica e siti web", chiave: "grafica", famiglia: "aziende", edile: false },
  { nome: "Manutenzioni", chiave: "manutenzioni", famiglia: "aziende", edile: false },
  { nome: "Sicurezza e allarmi", chiave: "sicurezza", famiglia: "aziende", edile: false },
  { nome: "Stampa e insegne", chiave: "stampa", famiglia: "aziende", edile: false },
  { nome: "Corsi e formazione", chiave: "formazione", famiglia: "aziende", edile: false },
  { nome: "Trasporti e consegne", chiave: "trasporti", famiglia: "altro", edile: false },
  { nome: "Lavori agricoli", chiave: "agricoltura", famiglia: "altro", edile: false },
  { nome: "Sartoria", chiave: "sartoria", famiglia: "altro", edile: false },
  { nome: "Restauro", chiave: "restauro", famiglia: "altro", edile: false },
] as const satisfies readonly { nome: string; chiave: string; famiglia: Famiglia; edile: boolean }[];

export type NomeMestiere = (typeof ELENCO_MESTIERI)[number]["nome"];
export type ChiaveMestiere = (typeof ELENCO_MESTIERI)[number]["chiave"];

// Il regime IVA che conviene proporre a chi sceglie questi mestieri: edile se almeno uno lo è.
export function regimeSuggerito(mestieri: readonly string[]): "edile" | "ordinario" {
  return ELENCO_MESTIERI.some((m) => m.edile && mestieri.includes(m.nome)) ? "edile" : "ordinario";
}
