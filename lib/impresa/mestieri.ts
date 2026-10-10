// I mestieri che Preventivi conosce, per famiglia. Il valore salvato in pl_imprese.mestieri è il nome
// italiano; l'etichetta nella lingua dell'interfaccia viene dal dizionario (area.modulo.mestieri.<chiave>).
// Dal 10/10/2026 il modulo serve tutti i mestieri, non solo l'edilizia (decisione di Sofiane).
// Nessun listino d'esempio per mestiere: i prezzi li carica sempre l'impresa.
//
// Dati fiscali (ricerca del 10/10/2026 su DPR 633/1972, L. 488/1999, DM 29/12/1999 e prassi dell'Agenzia
// delle Entrate; le voci segnate «da confermare» vanno verificate con un commercialista):
// - tipo «edile»: lavora sugli edifici; l'aliquota dipende dal lavoro (10%, 4% o 22%), dal cliente e dai
//   beni significativi. «ibrido»: edile quando il lavoro è su un edificio, altrimenti aliquota propria.
//   «no»: non lavora sugli edifici, aliquota propria.
// - aliquota: quella delle righe fuori dall'edilizia (catering 10%, NCC 10%, ripetizioni esenti…).
// - esenzione: il riferimento normativo stampato quando l'aliquota è «esente».
// - avviso: un'eccezione che il software non decide da solo e che l'artigiano deve sapere.

import type { Aliquota } from "@/lib/fisco/schema";

export const FAMIGLIE = ["edilizia", "impianti", "casa", "auto", "eventi", "aziende", "persone", "altro"] as const;
export type Famiglia = (typeof FAMIGLIE)[number];
export type TipoMestiere = "edile" | "ibrido" | "no";

type Mestiere = {
  nome: string;
  chiave: string;
  famiglia: Famiglia;
  tipo: TipoMestiere;
  aliquota: Aliquota;
  esenzione?: string;
  avviso?: string;
};

export const ELENCO_MESTIERI = [
  // Edilizia
  { nome: "Impresa edile", chiave: "impresaEdile", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Muratore", chiave: "muratore", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Imbianchino", chiave: "imbianchino", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Piastrellista", chiave: "piastrellista", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Cartongessista", chiave: "cartongessista", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Pavimenti e parquet", chiave: "pavimenti", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Tetti e lattoneria", chiave: "tetti", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Isolamento e cappotto", chiave: "isolamento", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Impermeabilizzazioni e amianto", chiave: "impermeabilizzazioni", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Serramentista", chiave: "serramentista", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Scavi e demolizioni", chiave: "scavi", famiglia: "edilizia", tipo: "edile", aliquota: "22" },
  { nome: "Restauro edifici", chiave: "restauro", famiglia: "edilizia", tipo: "edile", aliquota: "22", avviso: "Edifici vincolati e beni culturali: aliquota e inversione contabile da confermare con il commercialista." },
  { nome: "Marmista", chiave: "marmista", famiglia: "edilizia", tipo: "ibrido", aliquota: "22" },
  { nome: "Fabbro", chiave: "fabbro", famiglia: "edilizia", tipo: "ibrido", aliquota: "22" },
  { nome: "Falegname", chiave: "falegname", famiglia: "edilizia", tipo: "ibrido", aliquota: "22", avviso: "Arredi su misura e mobili sono beni: IVA 22% anche in casa. Porte e infissi in un lavoro sulla casa seguono l'IVA edile." },
  { nome: "Pozzi e perforazioni", chiave: "pozzi", famiglia: "edilizia", tipo: "ibrido", aliquota: "22" },
  { nome: "Piscine", chiave: "piscine", famiglia: "edilizia", tipo: "ibrido", aliquota: "22", avviso: "Le piscine non sono edifici: niente inversione contabile per le pulizie e il completamento. IVA agevolata solo se pertinenza in una ristrutturazione: da confermare con il commercialista." },
  // Impianti
  { nome: "Idraulico", chiave: "idraulico", famiglia: "impianti", tipo: "edile", aliquota: "22" },
  { nome: "Caldaie e manutenzione caldaie", chiave: "caldaie", famiglia: "impianti", tipo: "edile", aliquota: "22" },
  { nome: "Elettricista", chiave: "elettricista", famiglia: "impianti", tipo: "edile", aliquota: "22" },
  { nome: "Climatizzazione", chiave: "climatizzazione", famiglia: "impianti", tipo: "edile", aliquota: "22" },
  { nome: "Fotovoltaico e solare", chiave: "fotovoltaico", famiglia: "impianti", tipo: "edile", aliquota: "22" },
  { nome: "Antennista", chiave: "antennista", famiglia: "impianti", tipo: "edile", aliquota: "22" },
  { nome: "Cancelli automatici", chiave: "cancelli", famiglia: "impianti", tipo: "edile", aliquota: "22" },
  { nome: "Ascensori", chiave: "ascensori", famiglia: "impianti", tipo: "edile", aliquota: "22" },
  { nome: "Sicurezza e allarmi", chiave: "sicurezza", famiglia: "impianti", tipo: "ibrido", aliquota: "22" },
  { nome: "Spurghi e fognature", chiave: "spurghi", famiglia: "impianti", tipo: "ibrido", aliquota: "22", avviso: "Lo spurgo è un servizio al 22%; i lavori sulla rete fognaria privata possono essere manutenzione: da confermare con il commercialista." },
  // Casa
  { nome: "Giardiniere", chiave: "giardiniere", famiglia: "casa", tipo: "no", aliquota: "22", avviso: "Piante e fiori venduti vanno al 10%: indica l'aliquota sulle voci del listino. Le opere murarie in giardino possono seguire l'IVA edile." },
  { nome: "Pulizie", chiave: "pulizie", famiglia: "casa", tipo: "no", aliquota: "22" },
  { nome: "Traslochi e sgomberi", chiave: "traslochi", famiglia: "casa", tipo: "no", aliquota: "22" },
  { nome: "Disinfestazioni", chiave: "disinfestazioni", famiglia: "casa", tipo: "no", aliquota: "22" },
  { nome: "Tende e zanzariere", chiave: "tende", famiglia: "casa", tipo: "ibrido", aliquota: "22", avviso: "Sola fornitura con posa: 22%. Dentro un lavoro di manutenzione o ristrutturazione della casa: 10%. Da confermare con il commercialista." },
  { nome: "Tappezziere", chiave: "tappezziere", famiglia: "casa", tipo: "ibrido", aliquota: "22" },
  { nome: "Vetraio", chiave: "vetraio", famiglia: "casa", tipo: "ibrido", aliquota: "22", avviso: "Sostituzione dei vetri delle finestre di un'abitazione: 10% come manutenzione (da confermare). Specchi e vetri per mobili: 22%." },
  { nome: "Riparazione elettrodomestici", chiave: "elettrodomestici", famiglia: "casa", tipo: "no", aliquota: "22" },
  { nome: "Manutentore e tuttofare", chiave: "manutenzioni", famiglia: "casa", tipo: "ibrido", aliquota: "22" },
  { nome: "Montaggio mobili e cucine", chiave: "montaggio", famiglia: "casa", tipo: "no", aliquota: "22" },
  // Auto e mezzi
  { nome: "Officina meccanica", chiave: "officina", famiglia: "auto", tipo: "no", aliquota: "22", avviso: "Adattamento di veicoli per persone con disabilità: 4% (da confermare)." },
  { nome: "Carrozzeria", chiave: "carrozzeria", famiglia: "auto", tipo: "no", aliquota: "22" },
  { nome: "Gommista", chiave: "gommista", famiglia: "auto", tipo: "no", aliquota: "22" },
  { nome: "Elettrauto", chiave: "elettrauto", famiglia: "auto", tipo: "no", aliquota: "22" },
  { nome: "Moto e bici", chiave: "moto", famiglia: "auto", tipo: "no", aliquota: "22" },
  // Eventi e foto
  { nome: "Fotografo e video", chiave: "fotografo", famiglia: "eventi", tipo: "no", aliquota: "22" },
  { nome: "Catering", chiave: "catering", famiglia: "eventi", tipo: "no", aliquota: "10", avviso: "10% per la somministrazione con servizio (n. 121 Tab. A parte III). La sola consegna di cibo senza servizio segue l'aliquota dei prodotti." },
  { nome: "Pasticceria per eventi", chiave: "pasticceria", famiglia: "eventi", tipo: "no", aliquota: "10", avviso: "La maggior parte dei prodotti dolciari va al 10%: verifica l'aliquota dei singoli prodotti." },
  { nome: "Fiori e allestimenti", chiave: "allestimenti", famiglia: "eventi", tipo: "no", aliquota: "22", avviso: "Fiori, composizioni e piante venduti vanno al 10%; il servizio di allestimento al 22%. Indica l'aliquota sulle voci del listino." },
  { nome: "Noleggio attrezzature", chiave: "noleggio", famiglia: "eventi", tipo: "no", aliquota: "22", avviso: "Il noleggio segue l'aliquota del bene noleggiato." },
  { nome: "Musica e DJ", chiave: "musica", famiglia: "eventi", tipo: "no", aliquota: "22", avviso: "I concerti dal vivo vanno al 10% (n. 123 Tab. A parte III); DJ e musica registrata al 22%." },
  { nome: "Organizzazione eventi", chiave: "organizzazioneEventi", famiglia: "eventi", tipo: "no", aliquota: "22", avviso: "Pacchetti con viaggio e soggiorno possono rientrare nel regime delle agenzie di viaggio (art. 74-ter): da confermare con il commercialista." },
  // Servizi alle aziende
  { nome: "Tecnico informatico", chiave: "informatica", famiglia: "aziende", tipo: "no", aliquota: "22" },
  { nome: "Grafica e siti web", chiave: "grafica", famiglia: "aziende", tipo: "no", aliquota: "22" },
  { nome: "Stampa e insegne", chiave: "stampa", famiglia: "aziende", tipo: "no", aliquota: "22", avviso: "Libri e giornali stampati vanno al 4% (n. 18 Tab. A parte II), anche quando li stampi per conto del cliente." },
  { nome: "Corsi e formazione", chiave: "formazione", famiglia: "aziende", tipo: "no", aliquota: "22", avviso: "Esente da IVA solo se l'ente e il corso sono riconosciuti (art. 10, n. 20): in quel caso indica «esente» sulle voci." },
  // Servizi alla persona
  { nome: "Ripetizioni e lezioni private", chiave: "ripetizioni", famiglia: "persone", tipo: "no", aliquota: "esente", esenzione: "art. 10, n. 20, DPR 633/1972", avviso: "Esenti le lezioni su materie scolastiche o universitarie date a titolo personale; le altre lezioni vanno al 22%." },
  { nome: "Acconciatura ed estetica", chiave: "acconciatura", famiglia: "persone", tipo: "no", aliquota: "22" },
  { nome: "Onoranze funebri", chiave: "onoranze", famiglia: "persone", tipo: "no", aliquota: "esente", esenzione: "art. 10, n. 27, DPR 633/1972", avviso: "Esenti le prestazioni proprie delle pompe funebri; fiori, stampe e altre forniture hanno la loro aliquota. Da confermare con il commercialista." },
  // Trasporti, campi e laboratorio
  { nome: "Trasporto merci", chiave: "trasporti", famiglia: "altro", tipo: "no", aliquota: "22" },
  { nome: "Noleggio con conducente", chiave: "ncc", famiglia: "altro", tipo: "no", aliquota: "10", avviso: "Trasporto di persone: 10% (n. 127-novies Tab. A parte III). Il taxi urbano è esente." },
  { nome: "Lavori agricoli", chiave: "agricoltura", famiglia: "altro", tipo: "no", aliquota: "10", avviso: "10% solo per i lavori con macchine agricole per aziende agricole; lavori manuali e clienti senza partita IVA agricola: 22%." },
  { nome: "Facchinaggio", chiave: "facchinaggio", famiglia: "altro", tipo: "no", aliquota: "22" },
  { nome: "Sartoria", chiave: "sartoria", famiglia: "altro", tipo: "no", aliquota: "22" },
  { nome: "Restauro mobili e oggetti", chiave: "restauroMobili", famiglia: "altro", tipo: "no", aliquota: "22" },
] as const satisfies readonly Mestiere[];

export type NomeMestiere = (typeof ELENCO_MESTIERI)[number]["nome"];
export type ChiaveMestiere = (typeof ELENCO_MESTIERI)[number]["chiave"];

// Nomi usati fino al 10/10/2026 sera: restano validi e diventano il mestiere che li sostituisce.
export const ALIAS_MESTIERI: Record<string, NomeMestiere> = {
  Termoidraulico: "Idraulico",
  Manutenzioni: "Manutentore e tuttofare",
  "Trasporti e consegne": "Trasporto merci",
  Restauro: "Restauro edifici",
  "Allestimenti e fiori": "Fiori e allestimenti",
  "Wedding planner": "Organizzazione eventi",
};

const PER_NOME = new Map<string, Mestiere>(ELENCO_MESTIERI.map((m) => [m.nome, m]));

export function mestiere(nome: string): Mestiere | undefined {
  return PER_NOME.get(ALIAS_MESTIERI[nome] ?? nome);
}

// I nomi validi, con gli alias riportati al nome nuovo e senza doppioni.
export function normalizzaMestieri(nomi: readonly string[]): NomeMestiere[] {
  const out: NomeMestiere[] = [];
  for (const n of nomi) {
    const m = mestiere(n);
    if (m && !out.includes(m.nome as NomeMestiere)) out.push(m.nome as NomeMestiere);
  }
  return out;
}

// Che cosa chiedere quando il racconto non lo dice, per famiglia: il motore lo annota fra le note.
export const DOMANDE_FAMIGLIA: Record<Famiglia, string> = {
  edilizia: "tipo di immobile, tipo di intervento e pratica edilizia, misure, chi fornisce i materiali, smaltimento delle macerie, ponteggi",
  impianti: "tipo di immobile, riparazione o sostituzione, marca e modello degli apparecchi, chi li fornisce, certificazioni",
  casa: "frequenza (una volta o a canone), superfici, piano e ascensore, accesso, smaltimento, prodotti o piante forniti",
  auto: "targa, marca, modello e chilometri del mezzo, ricambi e manodopera separati, ore di manodopera, sinistro o assicurazione",
  eventi: "data e luogo, numero di persone, durata, cosa è incluso, trasferta in km, musica dal vivo o registrata, servizio a tavola o sola consegna",
  aziende: "perimetro del lavoro (pagine, postazioni, copie), una tantum o canone, tempi di consegna",
  persone: "numero di persone o di lezioni, data e luogo, cosa è incluso",
  altro: "peso o volume, partenza e arrivo, chilometri, numero di viaggi; per i lavori agricoli ettari, coltura e macchina",
};

// Le cose da chiedere per i mestieri di un'impresa, una famiglia alla volta, senza doppioni.
export function domandeDi(nomi: readonly string[]): string | undefined {
  const famiglie = [...new Set(nomi.map(mestiere).filter((m) => m !== undefined).map((m) => m.famiglia))];
  return famiglie.length ? famiglie.map((f) => DOMANDE_FAMIGLIA[f]).join("; ") : undefined;
}
