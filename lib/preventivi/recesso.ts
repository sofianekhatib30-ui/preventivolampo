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
    case "de":
      return {
        titolo: "Widerrufsrecht",
        paragrafi: [
          "Wenn Sie Verbraucher sind, haben Sie das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses, also ab der Annahme des Angebots.",
          `Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${c(k)}) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.`,
          "Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.",
        ],
        effettiTitolo: "Folgen des Widerrufs",
        effetti: [
          "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.",
          "Haben Sie verlangt, dass die Arbeiten während der Widerrufsfrist beginnen sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts unterrichten, bereits erbrachten Leistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Leistungen entspricht.",
        ],
        modulo: {
          titolo: "Muster-Widerrufsformular",
          istruzione: "(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)",
          righe: [
            `An: ${c(k)}`,
            `Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung: Angebot Nr. ${numero}`,
            "Angenommen am: ______________",
            "Name des/der Verbraucher(s): ______________",
            "Anschrift des/der Verbraucher(s): ______________",
            "Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): ______________",
            "Datum: ______________",
            "(*) Unzutreffendes streichen.",
          ],
        },
      };
    case "fr":
      return {
        titolo: "Droit de rétractation",
        paragrafi: [
          "Si vous êtes un consommateur, vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le délai de rétractation expire quatorze jours après le jour de la conclusion du contrat, c'est-à-dire de l'acceptation du devis.",
          `Pour exercer le droit de rétractation, vous devez nous notifier (${c(k)}) votre décision de rétractation du présent contrat au moyen d'une déclaration dénuée d'ambiguïté (par exemple, lettre envoyée par la poste ou courrier électronique). Vous pouvez utiliser le modèle de formulaire de rétractation ci-dessous, mais ce n'est pas obligatoire.`,
          "Pour que le délai de rétractation soit respecté, il suffit que vous transmettiez votre communication relative à l'exercice du droit de rétractation avant l'expiration du délai de rétractation.",
        ],
        effettiTitolo: "Effets de la rétractation",
        effetti: [
          "En cas de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous sans retard excessif et, en tout état de cause, au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation. Nous procéderons au remboursement en utilisant le même moyen de paiement que celui que vous aurez utilisé pour la transaction initiale, sauf si vous convenez expressément d'un moyen différent ; en tout état de cause, ce remboursement n'occasionnera pas de frais pour vous.",
          "Si vous avez demandé de commencer les travaux pendant le délai de rétractation, vous devrez nous payer un montant proportionnel à ce qui vous a été fourni jusqu'au moment où vous nous avez informés de votre rétractation, par rapport à l'ensemble des prestations prévues par le contrat.",
        ],
        modulo: {
          titolo: "Modèle de formulaire de rétractation",
          istruzione: "(veuillez compléter et renvoyer le présent formulaire uniquement si vous souhaitez vous rétracter du contrat)",
          righe: [
            `À l'attention de : ${c(k)}`,
            `Je/Nous (*) vous notifie/notifions (*) par la présente ma/notre (*) rétractation du contrat pour la prestation de services ci-dessous : devis n° ${numero}`,
            "Accepté le : ______________",
            "Nom du (des) consommateur(s) : ______________",
            "Adresse du (des) consommateur(s) : ______________",
            "Signature du (des) consommateur(s) (uniquement en cas de notification sur papier) : ______________",
            "Date : ______________",
            "(*) Rayez la mention inutile.",
          ],
        },
      };
    case "es":
      return {
        titolo: "Derecho de desistimiento",
        paragrafi: [
          "Si es usted consumidor, tiene derecho a desistir del presente contrato en un plazo de 14 días naturales sin necesidad de justificación. El plazo de desistimiento expirará a los 14 días naturales del día de la celebración del contrato, es decir, de la aceptación del presupuesto.",
          `Para ejercer el derecho de desistimiento, deberá usted notificarnos (${c(k)}) su decisión de desistir del contrato a través de una declaración inequívoca (por ejemplo, una carta enviada por correo postal o un correo electrónico). Podrá utilizar el modelo de formulario de desistimiento que figura a continuación, aunque su uso no es obligatorio.`,
          "Para cumplir el plazo de desistimiento, basta con que la comunicación relativa al ejercicio por su parte de este derecho sea enviada antes de que venza el plazo correspondiente.",
        ],
        effettiTitolo: "Consecuencias del desistimiento",
        effetti: [
          "En caso de desistimiento por su parte, le devolveremos todos los pagos recibidos de usted sin ninguna demora indebida y, en todo caso, a más tardar 14 días naturales a partir de la fecha en la que se nos informe de su decisión de desistir. Procederemos a efectuar dicho reembolso utilizando el mismo medio de pago empleado por usted para la transacción inicial, a no ser que haya usted dispuesto expresamente lo contrario; en todo caso, no incurrirá en ningún gasto como consecuencia del reembolso.",
          "Si usted ha solicitado que los trabajos den comienzo durante el período de desistimiento, nos abonará un importe proporcional a la parte ya prestada en el momento en que nos haya comunicado su desistimiento, en relación con el objeto total del contrato.",
        ],
        modulo: {
          titolo: "Modelo de formulario de desistimiento",
          istruzione: "(solo debe cumplimentar y enviar el presente formulario si desea desistir del contrato)",
          righe: [
            `A la atención de: ${c(k)}`,
            `Por la presente le comunico/comunicamos (*) que desisto de mi/desistimos de nuestro (*) contrato de prestación del siguiente servicio: presupuesto n.º ${numero}`,
            "Aceptado el: ______________",
            "Nombre del consumidor o de los consumidores: ______________",
            "Domicilio del consumidor o de los consumidores: ______________",
            "Firma del consumidor o de los consumidores (solo si el formulario se presenta en papel): ______________",
            "Fecha: ______________",
            "(*) Táchese lo que no proceda.",
          ],
        },
      };
    case "nl":
      return {
        titolo: "Herroepingsrecht",
        paragrafi: [
          "Als u consument bent, hebt u het recht binnen een termijn van 14 dagen zonder opgave van redenen de overeenkomst te herroepen. De herroepingstermijn verstrijkt 14 dagen na de dag van de sluiting van de overeenkomst, dat wil zeggen na de aanvaarding van de offerte.",
          `Om het herroepingsrecht uit te oefenen, moet u ons (${c(k)}) via een ondubbelzinnige verklaring (bv. een per post verzonden brief of een e-mail) op de hoogte stellen van uw beslissing de overeenkomst te herroepen. U kunt hiervoor gebruikmaken van het modelformulier voor herroeping hieronder, maar bent hiertoe niet verplicht.`,
          "Om de herroepingstermijn na te leven volstaat het om uw mededeling betreffende de uitoefening van het herroepingsrecht te verzenden voordat de herroepingstermijn is verstreken.",
        ],
        effettiTitolo: "Gevolgen van de herroeping",
        effetti: [
          "Als u de overeenkomst herroept, ontvangt u alle betalingen die u tot op dat moment hebt gedaan onverwijld en in ieder geval niet later dan 14 dagen nadat wij op de hoogte zijn gesteld van uw beslissing de overeenkomst te herroepen, van ons terug. Wij betalen u terug met hetzelfde betaalmiddel als waarmee u de oorspronkelijke transactie hebt verricht, tenzij u uitdrukkelijk anders hebt ingestemd; in ieder geval zult u voor zulke terugbetaling geen kosten hoeven te betalen.",
          "Als u hebt verzocht om de werkzaamheden tijdens de herroepingstermijn te laten beginnen, betaalt u ons een bedrag dat evenredig is aan het gedeelte van de verbintenis dat op het moment van herroeping is nagekomen, vergeleken met de volledige verbintenis.",
        ],
        modulo: {
          titolo: "Modelformulier voor herroeping",
          istruzione: "(dit formulier alleen invullen en terugzenden als u de overeenkomst wilt herroepen)",
          righe: [
            `Aan: ${c(k)}`,
            `Ik/Wij (*) deel/delen (*) u hierbij mede dat ik/wij (*) onze overeenkomst betreffende de levering van de volgende dienst herroep/herroepen (*): offerte nr. ${numero}`,
            "Aanvaard op: ______________",
            "Naam/Namen consument(en): ______________",
            "Adres consument(en): ______________",
            "Handtekening van consument(en) (alleen wanneer dit formulier op papier wordt ingediend): ______________",
            "Datum: ______________",
            "(*) Doorhalen wat niet van toepassing is.",
          ],
        },
      };
  }
}
