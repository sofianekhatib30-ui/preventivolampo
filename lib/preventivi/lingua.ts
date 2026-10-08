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

export const LINGUE = ["it", "en", "de", "fr", "es", "nl"] as const;
export type Lingua = (typeof LINGUE)[number];
export type LinguaStraniera = Exclude<Lingua, "it">;

export const NOME_LINGUA: Record<Lingua, { proprio: string; italiano: string }> = {
  it: { proprio: "Italiano", italiano: "italiano" },
  en: { proprio: "English", italiano: "inglese" },
  de: { proprio: "Deutsch", italiano: "tedesco" },
  fr: { proprio: "Français", italiano: "francese" },
  es: { proprio: "Español", italiano: "spagnolo" },
  nl: { proprio: "Nederlands", italiano: "olandese" },
};

export const LOCALE: Record<Lingua, string> = { it: "it-IT", en: "en-GB", de: "de-DE", fr: "fr-FR", es: "es-ES", nl: "nl-NL" };

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
  regime: { ordinaria_22: string; agevolata_10: string; agevolata_10_beni_significativi: string };
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
    unita: { cad: "pcs", corpo: "lump sum", h: "hrs" },
    pagina: {
      titolo: "Your quote",
      per: (n) => `for ${n}`,
      lavoriIn: (a) => `Work at ${a}`,
      totaleIncl: "Total incl. VAT",
      imponibilePiuIva: (i, v) => `Taxable ${i} + VAT ${v}`,
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
  de: {
    preventivoN: "Angebot Nr.",
    data: (d, s, g) => `Datum ${d} · gültig bis ${s} (${g} Tage)`,
    cliente: "Kunde",
    colonne: { lavorazione: "Leistung", qta: "Menge", um: "Einh.", prezzo: "Preis", importo: "Betrag" },
    imponibile: "Nettobetrag",
    ivaSu: (a, b) => `MwSt. ${a} % auf ${b}`,
    totale: "Gesamt",
    regime: {
      ordinaria_22: "Italienischer Regelsteuersatz von 22 %.",
      agevolata_10: "Ermäßigter italienischer Mehrwertsteuersatz von 10 % für Instandhaltungsarbeiten an Wohnungen.",
      agevolata_10_beni_significativi:
        "Ermäßigter italienischer Mehrwertsteuersatz von 10 % für Instandhaltungsarbeiten an Wohnungen. Für «beni significativi» (hochwertige Güter wie Sanitärobjekte, Heizkessel und Fenster, laut italienischem Ministerialdekret vom 29.12.1999) gilt der Satz von 10 % nur bis zum Wert der übrigen Arbeiten; der darüber hinausgehende Teil wird mit 22 % besteuert.",
    },
    valoreBeni: (v) => `Wert der beni significativi: ${v}.`,
    esclusi: "Nicht im Angebot enthalten",
    condizioniTitolo: "Bedingungen",
    condizioni:
      "Preise ohne MwSt., sofern nicht anders angegeben. Nicht aufgeführte Arbeiten und während der Ausführung gewünschte Änderungen werden gesondert angeboten. Ist der Kunde Verbraucher und nimmt er aus der Ferne (über den Link) an, kann er innerhalb von 14 Tagen nach der Annahme widerrufen, es sei denn, er hat den Beginn der Arbeiten vor Ablauf dieser Frist verlangt.",
    pagamento: "Zahlung",
    iban: (i, n) => `IBAN ${i}, Kontoinhaber ${n}`,
    esito: (e, n, q) => `Online ${e === "accettato" ? "angenommen" : "abgelehnt"} von ${n} am ${q}.`,
    prevalenza: "Dieses Angebot ist in italienischer und deutscher Sprache verfasst. Bei Abweichungen ist der italienische Text maßgeblich.",
    unita: { cad: "Stk.", corpo: "pauschal", h: "Std." },
    pagina: {
      titolo: "Ihr Angebot",
      per: (n) => `für ${n}`,
      lavoriIn: (a) => `Arbeiten in ${a}`,
      totaleIncl: "Gesamtbetrag inkl. MwSt.",
      imponibilePiuIva: (i, v) => `Netto ${i} + MwSt. ${v}`,
      validoFino: (d) => `gültig bis ${d}`,
      eAltre: (n) => `und ${n} weitere Leistungen.`,
      dettaglio: (n) => `Details der ${n} Positionen`,
      esclusi: "Nicht enthalten:",
      scaricaPdf: "Vollständiges PDF herunterladen (Italienisch und Deutsch)",
      leggiQui: "Auf Deutsch lesen",
      risposta: (e, d) => `Sie haben dieses Angebot am ${d} ${e === "accettato" ? "angenommen" : "abgelehnt"}.`,
      creato: "Angebot erstellt mit PreventivoLampo.",
    },
    accetta: {
      titolo: "Ihre Antwort",
      nome: "Vor- und Nachname",
      letto: "Ich habe das Angebot gelesen und nehme es zu den angegebenen Bedingungen an. Bei Abweichungen ist der italienische Text maßgeblich.",
      accetto: "Angebot annehmen",
      invio: "Antwort wird gespeichert…",
      nonAccetto: "Ich lehne ab",
      nota: "Mit der Annahme bestätigen Sie das Angebot mit Ihrem Namen sowie dem heutigen Datum und der Uhrzeit. Dies ist keine qualifizierte elektronische Signatur. Als Verbraucher haben Sie 14 Tage Zeit für einen Widerruf.",
      errore: "Ihre Antwort konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
    },
    messaggio: (n, num, t, l) =>
      `Guten Tag${n ? ` ${n}` : ""}, anbei das Angebot Nr. ${num}${t ? ` (Gesamtbetrag ${t} inkl. MwSt.)` : ""}. Sie können es hier ansehen und annehmen, ohne Registrierung: ${l}`,
  },
  fr: {
    preventivoN: "Devis n°",
    data: (d, s, g) => `Date ${d} · valable jusqu'au ${s} (${g} jours)`,
    cliente: "Client",
    colonne: { lavorazione: "Prestation", qta: "Qté", um: "Unité", prezzo: "Prix", importo: "Montant" },
    imponibile: "Montant HT",
    ivaSu: (a, b) => `TVA ${a} % sur ${b}`,
    totale: "Total",
    regime: {
      ordinaria_22: "Taux normal de TVA italienne de 22 %.",
      agevolata_10: "Taux réduit de TVA italienne de 10 % pour les travaux d'entretien de logements.",
      agevolata_10_beni_significativi:
        "Taux réduit de TVA italienne de 10 % pour les travaux d'entretien de logements. Pour les « beni significativi » (biens de valeur comme les sanitaires, chaudières et fenêtres, selon le décret ministériel italien du 29/12/1999), le taux de 10 % ne s'applique que jusqu'à la valeur du reste des travaux ; l'excédent est soumis à 22 %.",
    },
    valoreBeni: (v) => `Valeur des beni significativi : ${v}.`,
    esclusi: "Non compris dans le devis",
    condizioniTitolo: "Conditions",
    condizioni:
      "Prix hors TVA sauf indication contraire. Les travaux non mentionnés et les modifications demandées en cours de chantier font l'objet d'un devis séparé. Si le client est un consommateur et accepte à distance (par le lien), il peut se rétracter dans les 14 jours suivant l'acceptation, sauf s'il a demandé que les travaux commencent avant la fin de ce délai.",
    pagamento: "Paiement",
    iban: (i, n) => `IBAN ${i}, titulaire ${n}`,
    esito: (e, n, q) => `${e === "accettato" ? "Accepté" : "Refusé"} en ligne par ${n} le ${q}.`,
    prevalenza: "Ce devis est rédigé en italien et en français. En cas de divergence, le texte italien prévaut.",
    unita: { cad: "pce", corpo: "forfait", h: "h" },
    pagina: {
      titolo: "Votre devis",
      per: (n) => `pour ${n}`,
      lavoriIn: (a) => `Travaux à ${a}`,
      totaleIncl: "Total TTC",
      imponibilePiuIva: (i, v) => `HT ${i} + TVA ${v}`,
      validoFino: (d) => `valable jusqu'au ${d}`,
      eAltre: (n) => `et ${n} autres prestations.`,
      dettaglio: (n) => `Détail des ${n} postes`,
      esclusi: "Non compris :",
      scaricaPdf: "Télécharger le PDF complet (italien et français)",
      leggiQui: "Lire en français",
      risposta: (e, d) => `Vous avez ${e === "accettato" ? "accepté" : "refusé"} ce devis le ${d}.`,
      creato: "Devis créé avec PreventivoLampo.",
    },
    accetta: {
      titolo: "Votre réponse",
      nome: "Prénom et nom",
      letto: "J'ai lu le devis et je l'accepte aux conditions indiquées. En cas de divergence, le texte italien prévaut.",
      accetto: "Accepter le devis",
      invio: "Enregistrement de la réponse…",
      nonAccetto: "Je refuse",
      nota: "En acceptant, vous confirmez le devis avec votre nom ainsi que la date et l'heure d'aujourd'hui. Ce n'est pas une signature électronique qualifiée. Si vous êtes un consommateur, vous disposez de 14 jours pour vous rétracter.",
      errore: "Votre réponse n'a pas pu être enregistrée. Veuillez réessayer.",
    },
    messaggio: (n, num, t, l) =>
      `Bonjour${n ? ` ${n}` : ""}, voici le devis n° ${num}${t ? ` (total ${t} TTC)` : ""}. Vous pouvez le consulter et l'accepter ici, sans inscription : ${l}`,
  },
  es: {
    preventivoN: "Presupuesto n.º",
    data: (d, s, g) => `Fecha ${d} · válido hasta el ${s} (${g} días)`,
    cliente: "Cliente",
    colonne: { lavorazione: "Trabajo", qta: "Cant.", um: "Ud.", prezzo: "Precio", importo: "Importe" },
    imponibile: "Base imponible",
    ivaSu: (a, b) => `IVA ${a} % sobre ${b}`,
    totale: "Total",
    regime: {
      ordinaria_22: "Tipo general del IVA italiano del 22 %.",
      agevolata_10: "Tipo reducido del IVA italiano del 10 % para obras de mantenimiento en viviendas.",
      agevolata_10_beni_significativi:
        "Tipo reducido del IVA italiano del 10 % para obras de mantenimiento en viviendas. Para los «beni significativi» (bienes de valor como sanitarios, calderas y ventanas, según el Decreto Ministerial italiano del 29/12/1999), el tipo del 10 % se aplica solo hasta el valor del resto de la obra; el exceso tributa al 22 %.",
    },
    valoreBeni: (v) => `Valor de los beni significativi: ${v}.`,
    esclusi: "No incluido en el presupuesto",
    condizioniTitolo: "Condiciones",
    condizioni:
      "Precios sin IVA salvo indicación contraria. Los trabajos no incluidos y los cambios solicitados durante la obra se presupuestan aparte. Si el cliente es un consumidor y acepta a distancia (mediante el enlace), puede desistir en un plazo de 14 días desde la aceptación, salvo que haya pedido que los trabajos empiecen antes de que termine ese plazo.",
    pagamento: "Pago",
    iban: (i, n) => `IBAN ${i}, titular ${n}`,
    esito: (e, n, q) => `${e === "accettato" ? "Aceptado" : "Rechazado"} en línea por ${n} el ${q}.`,
    prevalenza: "Este presupuesto está redactado en italiano y en español. En caso de discrepancia, prevalece el texto italiano.",
    unita: { cad: "ud.", corpo: "a tanto alzado", h: "h" },
    pagina: {
      titolo: "Su presupuesto",
      per: (n) => `para ${n}`,
      lavoriIn: (a) => `Obras en ${a}`,
      totaleIncl: "Total IVA incluido",
      imponibilePiuIva: (i, v) => `Base ${i} + IVA ${v}`,
      validoFino: (d) => `válido hasta el ${d}`,
      eAltre: (n) => `y ${n} trabajos más.`,
      dettaglio: (n) => `Detalle de las ${n} partidas`,
      esclusi: "No incluido:",
      scaricaPdf: "Descargar el PDF completo (italiano y español)",
      leggiQui: "Leer en español",
      risposta: (e, d) => `${e === "accettato" ? "Aceptó" : "Rechazó"} este presupuesto el ${d}.`,
      creato: "Presupuesto creado con PreventivoLampo.",
    },
    accetta: {
      titolo: "Su respuesta",
      nome: "Nombre y apellidos",
      letto: "He leído el presupuesto y lo acepto en las condiciones indicadas. En caso de discrepancia, prevalece el texto italiano.",
      accetto: "Aceptar el presupuesto",
      invio: "Guardando la respuesta…",
      nonAccetto: "No lo acepto",
      nota: "Al aceptar, confirma el presupuesto con su nombre y la fecha y hora de hoy. No es una firma electrónica cualificada. Si es consumidor, tiene 14 días para desistir.",
      errore: "No hemos podido guardar su respuesta. Inténtelo de nuevo.",
    },
    messaggio: (n, num, t, l) =>
      `Buenos días${n ? ` ${n}` : ""}, le envío el presupuesto n.º ${num}${t ? ` (total ${t} IVA incluido)` : ""}. Puede verlo y aceptarlo aquí, sin registrarse: ${l}`,
  },
  nl: {
    preventivoN: "Offerte nr.",
    data: (d, s, g) => `Datum ${d} · geldig tot ${s} (${g} dagen)`,
    cliente: "Klant",
    colonne: { lavorazione: "Werkzaamheden", qta: "Aantal", um: "Eenh.", prezzo: "Prijs", importo: "Bedrag" },
    imponibile: "Bedrag excl. btw",
    ivaSu: (a, b) => `Btw ${a}% over ${b}`,
    totale: "Totaal",
    regime: {
      ordinaria_22: "Italiaans standaardtarief btw van 22%.",
      agevolata_10: "Verlaagd Italiaans btw-tarief van 10% voor onderhoudswerk aan woningen.",
      agevolata_10_beni_significativi:
        "Verlaagd Italiaans btw-tarief van 10% voor onderhoudswerk aan woningen. Voor «beni significativi» (waardevolle goederen zoals sanitair, cv-ketels en ramen, volgens het Italiaanse ministerieel besluit van 29-12-1999) geldt het tarief van 10% alleen tot de waarde van de overige werkzaamheden; het meerdere wordt belast tegen 22%.",
    },
    valoreBeni: (v) => `Waarde van de beni significativi: ${v}.`,
    esclusi: "Niet inbegrepen in de offerte",
    condizioniTitolo: "Voorwaarden",
    condizioni:
      "Prijzen exclusief btw, tenzij anders vermeld. Niet vermelde werkzaamheden en wijzigingen die tijdens het werk worden gevraagd, worden apart geoffreerd. Is de klant een consument en aanvaardt hij op afstand (via de link), dan kan hij binnen 14 dagen na de aanvaarding herroepen, tenzij hij heeft gevraagd de werkzaamheden vóór het einde van die termijn te beginnen.",
    pagamento: "Betaling",
    iban: (i, n) => `IBAN ${i}, op naam van ${n}`,
    esito: (e, n, q) => `Online ${e === "accettato" ? "aanvaard" : "geweigerd"} door ${n} op ${q}.`,
    prevalenza: "Deze offerte is opgesteld in het Italiaans en het Nederlands. Bij verschillen is de Italiaanse tekst bepalend.",
    unita: { cad: "st.", corpo: "forfait", h: "uur" },
    pagina: {
      titolo: "Uw offerte",
      per: (n) => `voor ${n}`,
      lavoriIn: (a) => `Werkzaamheden in ${a}`,
      totaleIncl: "Totaal incl. btw",
      imponibilePiuIva: (i, v) => `Excl. btw ${i} + btw ${v}`,
      validoFino: (d) => `geldig tot ${d}`,
      eAltre: (n) => `en nog ${n} werkzaamheden.`,
      dettaglio: (n) => `Details van de ${n} posten`,
      esclusi: "Niet inbegrepen:",
      scaricaPdf: "Volledige pdf downloaden (Italiaans en Nederlands)",
      leggiQui: "Lezen in het Nederlands",
      risposta: (e, d) => `U hebt deze offerte op ${d} ${e === "accettato" ? "aanvaard" : "geweigerd"}.`,
      creato: "Offerte gemaakt met PreventivoLampo.",
    },
    accetta: {
      titolo: "Uw antwoord",
      nome: "Voor- en achternaam",
      letto: "Ik heb de offerte gelezen en aanvaard deze onder de vermelde voorwaarden. Bij verschillen is de Italiaanse tekst bepalend.",
      accetto: "Offerte aanvaarden",
      invio: "Antwoord wordt opgeslagen…",
      nonAccetto: "Ik aanvaard niet",
      nota: "Door te aanvaarden bevestigt u de offerte met uw naam en de datum en het tijdstip van vandaag. Dit is geen gekwalificeerde elektronische handtekening. Als consument hebt u 14 dagen om te herroepen.",
      errore: "Uw antwoord kon niet worden opgeslagen. Probeer het opnieuw.",
    },
    messaggio: (n, num, t, l) =>
      `Goedendag${n ? ` ${n}` : ""}, hierbij offerte nr. ${num}${t ? ` (totaal ${t} incl. btw)` : ""}. U kunt deze hier bekijken en aanvaarden, zonder registratie: ${l}`,
  },
};
