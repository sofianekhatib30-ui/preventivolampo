// Esempi della demo animata in cima alla home. Lavori, clienti e prezzi sono inventati;
// i prezzi «dal listino» sono quelli del listino di prova (dati/listino.json), così la demo
// mostra quello che il motore fa davvero: prezzi solo dal listino, una domanda su quello che
// manca, una voce da prezzare che il prezzo lo mette l'artigiano.

// Evento con cui la sezione dei mestieri cambia l'esempio della demo in cima alla pagina.
export const EVENTO_MESTIERE = "pl:mestiere";

export type Riga = {
  voce: string;
  unita: string;
  /** null = la quantità la chiede la domanda */
  quantita: number | null;
  /** centesimi; null = da prezzare finché l'artigiano non scrive il suo */
  prezzo: number | null;
  /** nota sotto la voce, per esempio il conto rifatto */
  nota?: string;
};

export type Scenario = {
  id: string;
  mestiere: string;
  lavoro: string;
  cliente: string;
  durata: string;
  vocale: string;
  righe: Riga[];
  domanda: { testo: string; scelte: string[]; risposta: number; quantita: number };
  /** prezzo che l'artigiano scrive sulla voce da prezzare, in centesimi */
  prezzoTuo: number;
  iva: { aliquota: number; perche: string };
};

export const SCENARI: Scenario[] = [
  // Accanto ai mestieri della casa, a turno, anche mestieri che non sono della casa (Sofiane, 11/10/2026: «non mostriamo solo questi mestieri mostriamo anche quelli
  // non artigianali»). Il listino di prova (dati/listino.json) copre solo i lavori di casa: per questi tre esempi
  // voci e prezzi sono inventati, come dice la didascalia della finestra.
  {
    id: "elettricista",
    mestiere: "Elettricista",
    lavoro: "Cucina",
    cliente: "Ferrari",
    durata: "0:38",
    vocale:
      "Cucina del signor Ferrari. Quattro punti luce semplici e due deviati sopra il tavolo. Le prese da sedici per gli elettrodomestici. Nel quadro ci va un differenziale nuovo. E gli monto il lampadario che ha comprato lui.",
    righe: [
      { voce: "Punto luce interrotto", unita: "cad", quantita: 4, prezzo: 4893 },
      { voce: "Punto luce deviato", unita: "cad", quantita: 2, prezzo: 6454 },
      { voce: "Punto presa 16 A", unita: "cad", quantita: null, prezzo: 4633 },
      { voce: "Interruttore differenziale", unita: "cad", quantita: 1, prezzo: 8905 },
      { voce: "Montaggio lampadario del cliente", unita: "cad", quantita: 1, prezzo: null },
    ],
    domanda: { testo: "Quante prese da 16 A?", scelte: ["3", "4", "5"], risposta: 1, quantita: 4 },
    prezzoTuo: 3500,
    iva: { aliquota: 10, perche: "abitazione, manutenzione" },
  },
  {
    id: "fotografo",
    mestiere: "Fotografo",
    lavoro: "Matrimonio",
    cliente: "Bianchi",
    durata: "0:35",
    vocale:
      "Matrimonio della signora Bianchi a settembre, in villa. Servizio dalla preparazione della sposa al taglio della torta, più o meno dieci ore. Vogliono il video con il drone e un album da trenta pagine, più la galleria online per gli invitati. La proiezione delle foto durante la festa me la chiedono a parte.",
    righe: [
      { voce: "Servizio fotografico", unita: "ora", quantita: null, prezzo: 9000 },
      { voce: "Video con riprese da drone", unita: "cad", quantita: 1, prezzo: 65000 },
      { voce: "Album 30 pagine", unita: "cad", quantita: 1, prezzo: 42000 },
      { voce: "Galleria online per gli invitati", unita: "cad", quantita: 1, prezzo: 9000 },
      { voce: "Proiezione delle foto alla festa", unita: "cad", quantita: 1, prezzo: null },
    ],
    domanda: { testo: "Quante ore di servizio?", scelte: ["8", "10", "12"], risposta: 1, quantita: 10 },
    prezzoTuo: 15000,
    iva: { aliquota: 22, perche: "servizio fotografico" },
  },
  {
    id: "idraulico",
    mestiere: "Idraulico",
    lavoro: "Cucina",
    cliente: "Rinaldi",
    durata: "0:41",
    vocale:
      "Cucina della signora Rinaldi. Spostiamo il lavello sulla parete di fronte: nuovo allaccio acqua calda e fredda con lo scarico, tre metri di scarico da quaranta. Allaccio anche la lavastoviglie. Il miscelatore ce l'ha già lei, lo monto io.",
    righe: [
      { voce: "Allaccio acqua calda e fredda con scarico", unita: "cad", quantita: 1, prezzo: 19661 },
      { voce: "Tubo PE-X acqua Ø 16", unita: "m", quantita: null, prezzo: 386 },
      { voce: "Tubo di scarico Ø 40", unita: "m", quantita: 3, prezzo: 788 },
      { voce: "Allaccio lavastoviglie, solo scarico", unita: "cad", quantita: 1, prezzo: 8228 },
      { voce: "Montaggio miscelatore del cliente", unita: "cad", quantita: 1, prezzo: null },
    ],
    domanda: { testo: "Quanti metri di tubo per spostare il lavello?", scelte: ["3", "4", "6"], risposta: 1, quantita: 4 },
    prezzoTuo: 4000,
    iva: { aliquota: 10, perche: "abitazione, manutenzione" },
  },
  {
    id: "catering",
    mestiere: "Catering",
    lavoro: "Battesimo",
    cliente: "Russo",
    durata: "0:37",
    vocale:
      "Battesimo del piccolo Leo, in giardino dalla signora Russo, una sessantina di persone. Aperitivo di benvenuto, buffet salato e dolce, acqua, vino e bibite. Servono due camerieri per quattro ore. La torta la porta la loro pasticceria: noi la tagliamo e la serviamo.",
    righe: [
      { voce: "Buffet salato e dolce", unita: "persona", quantita: null, prezzo: 2800 },
      { voce: "Aperitivo di benvenuto", unita: "persona", quantita: 60, prezzo: 600 },
      { voce: "Bevande: acqua, vino e bibite", unita: "persona", quantita: 60, prezzo: 500 },
      { voce: "Cameriere", unita: "ora", quantita: 8, prezzo: 2200 },
      { voce: "Taglio e servizio della torta del cliente", unita: "cad", quantita: 1, prezzo: null },
    ],
    domanda: { testo: "Quanti invitati?", scelte: ["50", "60", "70"], risposta: 1, quantita: 60 },
    prezzoTuo: 6000,
    iva: { aliquota: 10, perche: "somministrazione per un evento" },
  },
  {
    id: "imbianchino",
    mestiere: "Imbianchino",
    lavoro: "Bilocale",
    cliente: "Greco",
    durata: "0:44",
    vocale:
      "Bilocale del signor Greco, soggiorno e camera: pareti e soffitti fanno centoventi metri. Raschio dove si sfoglia, fissativo dappertutto e due mani di lavabile. Sei metri di antimuffa sul soffitto del bagno. I mobili li spostiamo noi.",
    righe: [
      { voce: "Raschiatura vecchie pitture", unita: "m²", quantita: null, prezzo: 195 },
      { voce: "Fissativo", unita: "m²", quantita: 120, prezzo: 250 },
      { voce: "Idropittura lavabile, 2 mani", unita: "m²", quantita: 120, prezzo: 508 },
      { voce: "Trattamento antimuffa", unita: "m²", quantita: 6, prezzo: 253 },
      { voce: "Spostamento e protezione mobili", unita: "a corpo", quantita: 1, prezzo: null },
    ],
    domanda: { testo: "Quanti m² da raschiare?", scelte: ["20", "30", "45"], risposta: 1, quantita: 30 },
    prezzoTuo: 6000,
    iva: { aliquota: 10, perche: "abitazione, manutenzione" },
  },
  {
    id: "officina",
    mestiere: "Officina",
    lavoro: "Tagliando",
    cliente: "Galli",
    durata: "0:29",
    vocale:
      "Panda del signor Galli, centoventimila chilometri. Tagliando con olio e filtri, poi cambio pastiglie e dischi davanti. La batteria nuova l'ha già comprata lui, gliela monto io.",
    righe: [
      { voce: "Tagliando, filtri olio, aria e abitacolo", unita: "cad", quantita: 1, prezzo: 9500 },
      { voce: "Olio motore 5W-30", unita: "l", quantita: null, prezzo: 1400 },
      { voce: "Pastiglie freno anteriori", unita: "cad", quantita: 1, prezzo: 6800 },
      { voce: "Dischi freno anteriori, coppia", unita: "cad", quantita: 1, prezzo: 9800 },
      { voce: "Montaggio batteria del cliente", unita: "cad", quantita: 1, prezzo: null },
    ],
    domanda: { testo: "Quanti litri di olio?", scelte: ["3", "4", "5"], risposta: 1, quantita: 4 },
    prezzoTuo: 2000,
    iva: { aliquota: 22, perche: "riparazione del veicolo" },
  },
  {
    id: "piastrellista",
    mestiere: "Piastrellista",
    lavoro: "Soggiorno",
    cliente: "Marino",
    durata: "0:36",
    vocale:
      "Soggiorno della signora Marino, ventotto metri quadri. Tolgo il pavimento vecchio e il battiscopa, rifaccio il massetto e poso il gres trenta per trenta che ha comprato lei. Battiscopa nuovo in gres.",
    righe: [
      { voce: "Demolizione pavimento in piastrelle", unita: "m²", quantita: 28, prezzo: 1129 },
      { voce: "Rimozione battiscopa", unita: "m", quantita: null, prezzo: 213 },
      { voce: "Massetto sabbia e cemento 5 cm", unita: "m²", quantita: 28, prezzo: 2508 },
      { voce: "Posa gres della cliente, solo posa", unita: "m²", quantita: 28, prezzo: null },
      { voce: "Battiscopa in gres h 10", unita: "m", quantita: null, prezzo: 1487 },
    ],
    domanda: { testo: "Quanti metri di battiscopa?", scelte: ["18", "22", "26"], risposta: 1, quantita: 22 },
    prezzoTuo: 2400,
    iva: { aliquota: 10, perche: "abitazione, manutenzione" },
  },
  {
    id: "muratore",
    mestiere: "Muratore",
    lavoro: "Cameretta",
    cliente: "Conti",
    durata: "0:47",
    vocale:
      "Cameretta del signor Conti. Butto giù il tramezzo vecchio e lo rifaccio spostato di un metro: forati da otto, tre e venti per due e settanta, intonaco da tutte e due le parti. Macerie, un metro cubo. Il controtelaio della porta lo metto io.",
    righe: [
      { voce: "Demolizione tramezzo in forati", unita: "m²", quantita: null, prezzo: 1554 },
      { voce: "Tramezzo in forati 8 cm", unita: "m²", quantita: 8.64, prezzo: 2783, nota: "3,20 × 2,70" },
      { voce: "Intonaco civile, due facce", unita: "m²", quantita: 17.28, prezzo: 3146, nota: "8,64 × 2" },
      { voce: "Carico e trasporto macerie", unita: "m³", quantita: 1, prezzo: 3004 },
      { voce: "Controtelaio porta", unita: "cad", quantita: 1, prezzo: null },
    ],
    domanda: { testo: "Il tramezzo da buttare giù: quanti m²?", scelte: ["6", "8", "10"], risposta: 1, quantita: 8 },
    prezzoTuo: 9000,
    iva: { aliquota: 10, perche: "abitazione, manutenzione" },
  },
];

export type Conti = { imponibile: number; iva: number; totale: number };

export function conti(s: Scenario): Conti {
  let imponibile = 0;
  for (const r of s.righe) {
    const q = r.quantita ?? s.domanda.quantita;
    const p = r.prezzo ?? s.prezzoTuo;
    imponibile += Math.round(q * p);
  }
  const iva = Math.round((imponibile * s.iva.aliquota) / 100);
  return { imponibile, iva, totale: imponibile + iva };
}

// Formattazione deterministica (uguale sul server e nel browser): 1.234,56 €
export function euro(centesimi: number): string {
  const c = Math.round(centesimi);
  const interi = Math.floor(c / 100)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${interi},${String(c % 100).padStart(2, "0")} €`;
}

export function numero(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
}
