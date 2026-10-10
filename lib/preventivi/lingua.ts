// Le lingue del preventivo. Funzioni pure: le usano il server, il PDF e le pagine nel browser.
//
// Regole (ricerca del 9/10/2026 sulle lingue): il cliente riceve il preventivo nella sua lingua, ma
// il testo italiano c'è sempre e in caso di discordanza prevale (Codice del Consumo, art. 9: le
// informazioni al consumatore «almeno in lingua italiana»). Le voci le traduce il modello e
// l'artigiano le vede e le corregge prima di approvare; i testi fissi (intestazioni, IVA,
// condizioni, clausola) sono scritti qui e non passano dal modello. Numeri, prezzi e aliquote non
// si traducono mai: vengono dai dati.
//
// Lingue del cliente in alfabeto latino coperte dal carattere del PDF (Windows-1252). Rumeno,
// albanese, arabo e ucraino richiedono un carattere incorporato e un controllo di madrelingua:
// il giorno in cui si aggiungono, vanno scritti qui i loro testi e provato il PDF.

// Dall'11/10/2026 (decisione di Sofiane) il cliente straniero riceve il preventivo in inglese.
export const LINGUE = ["it", "en"] as const;
export type Lingua = (typeof LINGUE)[number];
export type LinguaStraniera = Exclude<Lingua, "it">;

export const NOME_LINGUA: Record<Lingua, { proprio: string; italiano: string }> = {
  it: { proprio: "Italiano", italiano: "italiano" },
  en: { proprio: "English", italiano: "inglese" },
};

export const LOCALE: Record<Lingua, string> = { it: "it-IT", en: "en-GB" };

// Lingue in cui l'artigiano può dettare il sopralluogo (riconoscimento vocale del browser).
// Scritto, il motore capisce qualunque lingua; a voce dipende dal telefono: dove manca, si scrive.
export const LINGUE_RACCONTO = [
  { codice: "it-IT", nome: "Italiano" },
  { codice: "ro-RO", nome: "Română" },
  { codice: "sq-AL", nome: "Shqip" },
  { codice: "ar-MA", nome: "العربية (المغرب)" },
  { codice: "ar-EG", nome: "العربية (مصر)" },
  { codice: "ar-TN", nome: "العربية (تونس)" },
  { codice: "ar-SA", nome: "العربية" },
  { codice: "uk-UA", nome: "Українська" },
  { codice: "ru-RU", nome: "Русский" },
  { codice: "es-ES", nome: "Español" },
  { codice: "fr-FR", nome: "Français" },
  { codice: "en-GB", nome: "English" },
] as const;

export type Traduzione = {
  lingua: LinguaStraniera;
  righe: string[];
  esclusioni: string[];
  // Il testo italiano da cui è nata: se l'artigiano cambia una voce dopo, la traduzione è da rifare.
  sorgente: { righe: string[]; esclusioni: string[] };
};

type ConTraduzione = { lingua?: Lingua; traduzione?: Traduzione | null; righe: { work: string }[]; esclusioni: string[] };

export function linguaDi(p: { lingua?: Lingua }): Lingua {
  return p.lingua ?? "it";
}

const uguali = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

// La traduzione corrisponde alle voci di adesso, nella lingua scelta, senza buchi.
export function traduzioneAllineata(p: ConTraduzione): boolean {
  const lingua = linguaDi(p);
  if (lingua === "it") return true;
  const t = p.traduzione;
  if (!t || t.lingua !== lingua) return false;
  if (!uguali(t.sorgente.righe, p.righe.map((r) => r.work)) || !uguali(t.sorgente.esclusioni, p.esclusioni)) return false;
  if (t.righe.length !== p.righe.length || t.esclusioni.length !== p.esclusioni.length) return false;
  return [...t.righe, ...t.esclusioni].every((s) => s.trim().length > 0);
}

export function mancanzaTraduzione(p: ConTraduzione): string | null {
  const lingua = linguaDi(p);
  if (lingua === "it" || traduzioneAllineata(p)) return null;
  const t = p.traduzione;
  if (t && t.lingua === lingua) return `traduzione in ${NOME_LINGUA[lingua].italiano} da rifare: le voci sono cambiate`;
  return `traduci il preventivo in ${NOME_LINGUA[lingua].italiano}`;
}

// Testi fissi per lingua. Le frasi con dati sono funzioni: i numeri arrivano già formattati.
export type Testi = {
  preventivoN: string;
  data: (data: string, scade: string, giorni: number) => string;
  cliente: string;
  colonne: { lavorazione: string; qta: string; um: string; prezzo: string; importo: string };
  imponibile: string;
  ivaSu: (aliquota: number, base: string) => string;
  totale: string;
  // Preventivi nati prima del fisco (10/10/2026 sera): il regime di allora.
  regime: { ordinaria_22: string; agevolata_10: string; agevolata_10_beni_significativi: string };
  // Dal fisco: le righe dei totali. Le diciture di legge restano in italiano, con una nota tradotta.
  rivalsa: string;
  bollo: string;
  esenteSu: (base: string) => string;
  inversioneSu: (base: string) => string;
  forfettarioSu: (base: string) => string;
  scissione: string;
  ritenuta: (percento: number) => string;
  netto: string;
  notaFiscale: string;
  valoreBeni: (v: string) => string;
  esclusi: string;
  condizioniTitolo: string;
  condizioni: string;
  pagamento: string;
  iban: (iban: string, intestatario: string) => string;
  esito: (esito: "accettato" | "rifiutato", nome: string, quando: string) => string;
  prevalenza: string;
  unita: Partial<Record<string, string>>;
  pagina: {
    titolo: string;
    per: (nome: string) => string;
    lavoriIn: (indirizzo: string) => string;
    totaleIncl: string;
    imponibilePiuIva: (imponibile: string, iva: string) => string;
    nettoDaPagare: (importo: string) => string;
    validoFino: (data: string) => string;
    eAltre: (n: number) => string;
    dettaglio: (n: number) => string;
    esclusi: string;
    scaricaPdf: string;
    leggiQui: string;
    risposta: (esito: "accettato" | "rifiutato", data: string) => string;
    creato: string;
  };
  accetta: { titolo: string; nome: string; letto: string; accetto: string; invio: string; nonAccetto: string; nota: string; errore: string };
  messaggio: (nome: string | null, numero: string, totale: string | null, link: string) => string;
};

// Clausola di prevalenza in italiano, nel PDF accanto a quella tradotta.
export function prevalenzaItaliana(lingua: LinguaStraniera): string {
  return `Il presente preventivo è redatto in italiano e in ${NOME_LINGUA[lingua].italiano}. In caso di discordanza prevale il testo italiano.`;
}

export const TESTI: Record<LinguaStraniera, Testi> = {
  en: {
    preventivoN: "Quote no.",
    data: (d, s, g) => `Date ${d} · valid until ${s} (${g} days)`,
    cliente: "Client",
    colonne: { lavorazione: "Description", qta: "Qty", um: "Unit", prezzo: "Price", importo: "Amount" },
    imponibile: "Taxable amount",
    ivaSu: (a, b) => `VAT ${a}% on ${b}`,
    totale: "Total",
    rivalsa: "INPS contribution 4% (rivalsa)",
    bollo: "Stamp duty",
    esenteSu: (b) => `VAT exempt on ${b}`,
    inversioneSu: (b) => `Reverse charge on ${b}: VAT paid by the client`,
    forfettarioSu: (b) => `No VAT (flat-rate scheme) on ${b}`,
    scissione: "VAT paid directly by the public body (split payment)",
    ritenuta: (p) => `Withholding tax ${p}%`,
    netto: "Net amount payable",
    notaFiscale: "The notes above state the VAT treatment required by Italian law.",
    regime: {
      ordinaria_22: "Standard Italian VAT rate of 22%.",
      agevolata_10: "Reduced Italian VAT rate of 10% for maintenance work on homes.",
      agevolata_10_beni_significativi:
        "Reduced Italian VAT rate of 10% for maintenance work on homes. For «beni significativi» (high-value goods such as sanitary fixtures, boilers and windows, listed in the Italian Ministerial Decree of 29/12/1999) the 10% rate applies only up to the value of the rest of the work; the excess is charged at 22%.",
    },
    valoreBeni: (v) => `Value of beni significativi: ${v}.`,
    esclusi: "Not included in this quote",
    condizioniTitolo: "Terms",
    condizioni:
      "Prices exclude VAT unless stated otherwise. Work not listed and changes requested during the job are quoted separately. If the client is a consumer and accepts at a distance (via the link), they may withdraw within 14 days of acceptance, unless they asked for the work to start before that period ends.",
    pagamento: "Payment",
    iban: (i, n) => `IBAN ${i}, account holder ${n}`,
    esito: (e, n, q) => `${e === "accettato" ? "Accepted" : "Declined"} online by ${n} on ${q}.`,
    prevalenza: "This quote is written in Italian and English. In case of discrepancy, the Italian text prevails.",
    unita: { cad: "pcs", corpo: "lump sum", h: "hrs", persona: "people", giorno: "days", mese: "months", anno: "years", viaggio: "trips", pagina: "pages", copia: "copies", servizio: "services", intervento: "call-outs" },
    pagina: {
      titolo: "Your quote",
      per: (n) => `for ${n}`,
      lavoriIn: (a) => `Work at ${a}`,
      totaleIncl: "Total incl. VAT",
      imponibilePiuIva: (i, v) => `Taxable ${i} + VAT ${v}`,
      nettoDaPagare: (v) => `Net amount payable: ${v}`,
      validoFino: (d) => `valid until ${d}`,
      eAltre: (n) => `and ${n} more items.`,
      dettaglio: (n) => `Details of the ${n} items`,
      esclusi: "Not included:",
      scaricaPdf: "Download the full PDF (Italian and English)",
      leggiQui: "Read in English",
      risposta: (e, d) => `You ${e === "accettato" ? "accepted" : "declined"} this quote on ${d}.`,
      creato: "Quote created with PreventivoLampo.",
    },
    accetta: {
      titolo: "Your answer",
      nome: "Full name",
      letto: "I have read the quote and accept it under the stated terms. In case of discrepancy, the Italian text prevails.",
      accetto: "Accept the quote",
      invio: "Saving your answer…",
      nonAccetto: "I don't accept",
      nota: "By accepting you confirm the quote with your name and today's date and time. This is not a qualified electronic signature. If you are a consumer, you have 14 days to withdraw.",
      errore: "We couldn't save your answer. Please try again.",
    },
    messaggio: (n, num, t, l) =>
      `Hello${n ? ` ${n}` : ""}, here is quote no. ${num}${t ? ` (total ${t} incl. VAT)` : ""}. You can view and accept it here, no sign-up needed: ${l}`,
  },
};
