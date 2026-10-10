import type { Lingua } from "./lingua";

// Informazioni sul diritto di recesso e modulo tipo, per il consumatore che accetta a distanza
// (link) o dopo un sopralluogo a casa sua. Testo adattato ai servizi dal modello ufficiale europeo
// (direttiva 2011/83/UE, allegato I; in Italia Codice del Consumo, allegato I), che esiste in ogni
// lingua dell'Unione: per ogni lingua si parte dalla sua versione ufficiale, non da una traduzione
// nostra. Da far rivedere a un avvocato prima dell'uso con clienti veri (vedi SPEC, «Condizioni»).

export type Contatti = { nome: string; indirizzo: string; telefono: string; email: string };
export type Recesso = {
  titolo: string;
  paragrafi: string[];
  effettiTitolo: string;
  effetti: string[];
  modulo: { titolo: string; istruzione: string; righe: string[] };
};

const c = (k: Contatti) => [k.nome, k.indirizzo, k.telefono, k.email].filter(Boolean).join(", ");

export function recesso(lingua: Lingua, k: Contatti, numero: string): Recesso {
  switch (lingua) {
    case "it":
      return {
        titolo: "Diritto di recesso",
        paragrafi: [
          "Se è un consumatore, ha il diritto di recedere dal contratto, senza indicarne le ragioni, entro 14 giorni. Il periodo di recesso scade dopo 14 giorni dal giorno della conclusione del contratto, cioè dall'accettazione del preventivo.",
          `Per esercitare il diritto di recesso, è tenuto a informarci (${c(k)}) della sua decisione di recedere dal presente contratto tramite una dichiarazione esplicita, ad esempio una lettera inviata per posta o un'email. A tal fine può utilizzare il modulo tipo di recesso qui sotto, ma non è obbligatorio.`,
          "Per rispettare il termine di recesso, è sufficiente che invii la comunicazione relativa all'esercizio del diritto di recesso prima della scadenza del periodo di recesso.",
        ],
        effettiTitolo: "Effetti del recesso",
        effetti: [
          "Se recede dal presente contratto, le saranno rimborsati tutti i pagamenti che ha effettuato a nostro favore senza indebito ritardo e in ogni caso non oltre 14 giorni dal giorno in cui siamo informati della sua decisione di recedere. I rimborsi saranno effettuati con lo stesso mezzo di pagamento da lei usato per la transazione iniziale, salvo che lei non abbia espressamente convenuto altrimenti; in ogni caso non dovrà sostenere alcun costo quale conseguenza del rimborso.",
          "Se ha chiesto di iniziare i lavori durante il periodo di recesso, è tenuto a pagarci un importo proporzionale a quanto è stato fornito fino al momento in cui ci ha comunicato il recesso, rispetto a tutte le prestazioni previste dal contratto.",
        ],
        modulo: {
          titolo: "Modulo di recesso tipo",
          istruzione: "(compilare e restituire il presente modulo solo se si desidera recedere dal contratto)",
          righe: [
            `Destinatario: ${c(k)}`,
            `Con la presente io/noi (*) notifico/notifichiamo (*) il recesso dal mio/nostro (*) contratto per la prestazione dei seguenti servizi: preventivo n. ${numero}`,
            "Accettato il: ______________",
            "Nome del/dei consumatore/i: ______________",
            "Indirizzo del/dei consumatore/i: ______________",
            "Firma del/dei consumatore/i (solo se il modulo è inviato su carta): ______________",
            "Data: ______________",
            "(*) Cancellare la dicitura inutile.",
          ],
        },
      };
    case "en":
      return {
        titolo: "Right of withdrawal",
        paragrafi: [
          "If you are a consumer, you have the right to withdraw from this contract within 14 days without giving any reason. The withdrawal period will expire after 14 days from the day of the conclusion of the contract, that is, from the acceptance of the quote.",
          `To exercise the right of withdrawal, you must inform us (${c(k)}) of your decision to withdraw from this contract by an unequivocal statement, for example a letter sent by post or an email. You may use the model withdrawal form below, but it is not obligatory.`,
          "To meet the withdrawal deadline, it is sufficient for you to send your communication concerning your exercise of the right of withdrawal before the withdrawal period has expired.",
        ],
        effettiTitolo: "Effects of withdrawal",
        effetti: [
          "If you withdraw from this contract, we shall reimburse to you all payments received from you without undue delay and in any event not later than 14 days from the day on which we are informed about your decision to withdraw. We will carry out such reimbursement using the same means of payment as you used for the initial transaction, unless you have expressly agreed otherwise; in any event, you will not incur any fees as a result of such reimbursement.",
          "If you requested to begin the work during the withdrawal period, you shall pay us an amount which is in proportion to what has been provided until you have communicated your withdrawal to us, in comparison with the full coverage of the contract.",
        ],
        modulo: {
          titolo: "Model withdrawal form",
          istruzione: "(complete and return this form only if you wish to withdraw from the contract)",
          righe: [
            `To: ${c(k)}`,
            `I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract for the provision of the following service: quote no. ${numero}`,
            "Accepted on: ______________",
            "Name of consumer(s): ______________",
            "Address of consumer(s): ______________",
            "Signature of consumer(s) (only if this form is sent on paper): ______________",
            "Date: ______________",
            "(*) Delete as appropriate.",
          ],
        },
      };
  }
}
