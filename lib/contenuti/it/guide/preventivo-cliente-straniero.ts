import type { PaginaGuida } from "../../tipi";

export const preventivoClienteStraniero: PaginaGuida = {
  meta: {
    titolo: "Preventivo a un cliente straniero: come farlo",
    descrizione:
      "Preventivo a un cliente straniero per lavori in casa: lingua, documento bilingue e versione che fa fede, IVA e dati fiscali, voci spiegate, recesso.",
  },
  nome: "Preventivo a un cliente straniero",
  riga: "Lingua, versione che fa fede, IVA e recesso quando il cliente non parla italiano.",
  h1: "Preventivo a un cliente straniero: lingua, IVA e recesso senza sorprese",
  intro:
    "Il cliente tedesco che ha comprato casa al lago, la famiglia olandese che ristruttura il casale, l'inquilino inglese arrivato da poco: capita di fare un sopralluogo in inglese stentato e di dover poi mandare un preventivo a qualcuno che l'italiano non lo legge. Le regole non cambiano perché il cliente è straniero, ma cambia molto il modo in cui conviene scriverle. Questa guida spiega in che lingua fare il preventivo, come gestire un documento in due lingue, cosa succede con l'IVA e cosa dire del recesso.",
  inBreve: [
    "Il lavoro su una casa in Italia si fattura con l'IVA italiana, anche se il cliente vive all'estero.",
    "Il preventivo migliore è in due lingue, con l'italiano sempre presente e una clausola che dica quale versione fa fede.",
    "Una traduzione ambigua gioca contro di te: nei contratti con i consumatori, nel dubbio vale l'interpretazione più favorevole al cliente.",
    "Il cliente privato straniero ha gli stessi diritti di recesso di un cliente italiano, e va informato in modo che capisca.",
  ],
  sezioni: [
    {
      titolo: "In che lingua scrivere il preventivo",
      paragrafi: [
        "La regola pratica è una sola: il cliente deve capire quello che firma. Un preventivo che non sa leggere non lo protegge e non protegge te, perché alla prima discussione dirà, con qualche ragione, che non sapeva cosa stava accettando.",
        "Il codice del consumo va nella stessa direzione. Le clausole proposte per iscritto al consumatore devono essere redatte in modo chiaro e comprensibile (art. 35), e le informazioni che dai prima di un contratto concluso a casa del cliente o a distanza devono essere chiare e comprensibili (art. 49). Lo stesso codice tiene ferma anche la lingua italiana: le informazioni destinate ai consumatori vanno rese almeno in italiano (art. 9, pensato soprattutto per i prodotti), e quando le informazioni passano per una comunicazione individuale a distanza, come un'email, il cliente può chiedere di riceverle in italiano (art. 49, comma 7).",
        "Messe insieme, queste regole portano tutte alla stessa soluzione: un documento in cui l'italiano c'è sempre e accanto c'è la lingua del cliente. Fare solo la versione straniera ti lascia scoperto; fare solo quella italiana lascia scoperto il cliente, e quindi anche te.",
      ],
    },
    {
      titolo: "Il preventivo in due lingue e la versione che fa fede",
      paragrafi: [
        "Un preventivo bilingue ha due colonne o due blocchi per ogni voce, oppure il testo italiano seguito dalla traduzione. In fondo serve una clausola che dica quale versione prevale se le due non coincidono, per esempio: «Il presente preventivo è redatto in italiano e in inglese. In caso di difformità fra le due versioni fa fede il testo italiano.»",
        "Perché l'italiano? Perché è la lingua in cui lavori, in cui il preventivo verrebbe letto da un consulente, da un perito o da un giudice italiano, e in cui sono scritti i termini tecnici. Ma la clausola non è uno scudo assoluto. Nei contratti con i consumatori, quando il senso di una clausola è dubbio, prevale l'interpretazione più favorevole al consumatore (art. 35, comma 2): se la traduzione dice una cosa diversa dall'originale e il cliente ha firmato fidandosi della sua lingua, una traduzione sbagliata può diventare un tuo problema.",
        "Quindi la traduzione deve essere fedele, non elegante. Frasi brevi, una cosa per frase, gli stessi numeri nelle due versioni, nessun riassunto. PreventivoLampo fa il preventivo nella lingua del cliente fra inglese, tedesco, francese, spagnolo e olandese, con il PDF in due lingue in cui fa fede l'italiano: tu controlli sempre la versione italiana, ed è quella che approvi prima che parta.",
      ],
    },
    {
      titolo: "Come spiegare le voci a chi non conosce i lavori italiani",
      paragrafi: [
        "Molte parole del preventivo non hanno un equivalente esatto in altre lingue, e alcune abitudini italiane non esistono altrove. Per queste voci conviene tenere la parola italiana e aggiungere una spiegazione breve, invece di inventare una traduzione che il cliente non riconoscerà.",
      ],
      punti: [
        {
          titolo: "A corpo e a misura",
          testo:
            "Spiega con una frase cosa vuol dire per lui: «prezzo fisso per tutto il lavoro descritto» oppure «prezzo per metro quadro, il totale si calcola sulle misure finali». È la differenza che conta di più per le sue tasche.",
        },
        {
          titolo: "Fornitura e posa",
          testo:
            "In molti paesi il cliente compra da sé i materiali e paga solo la manodopera, o viceversa. Scrivi riga per riga cosa porti tu e cosa porta lui.",
        },
        {
          titolo: "Esclusioni",
          testo:
            "Le esclusioni che per un cliente italiano sono ovvie (le tracce le chiude il muratore, il permesso lo chiede il tecnico) per uno straniero non lo sono affatto. Scrivile tutte, anche quelle che ti sembrano scontate.",
        },
        {
          titolo: "Documenti italiani",
          testo:
            "Dichiarazione di conformità, CILA, SCIA: tieni il nome italiano, perché è quello che il cliente ritroverà nei documenti ufficiali, e aggiungi tra parentesi a cosa servono.",
        },
        {
          titolo: "Numeri e unità",
          testo:
            "Usa le unità del sistema metrico anche con clienti abituati ad altre misure, e fai attenzione a virgole e punti nei decimali: 1.250 e 1,250 non sono la stessa cifra per tutti. Scrivi le date con il mese in lettere.",
        },
      ],
    },
    {
      titolo: "IVA: si applica quella italiana",
      paragrafi: [
        "Per l'IVA i lavori sugli immobili seguono una regola semplice: le prestazioni di servizi relative a beni immobili si considerano effettuate in Italia quando l'immobile si trova in Italia (art. 7-quater del decreto IVA). L'Agenzia delle Entrate lo ha ribadito: per questi servizi conta solo dove sta l'immobile, non dove risiede il committente. Il bagno rifatto nella casa italiana di un cliente che vive all'estero si fattura quindi con l'IVA italiana.",
        "Anche l'aliquota segue le regole italiane, e dipende dall'immobile e dal tipo di lavoro, non dalla nazionalità del cliente. Una manutenzione straordinaria su un'abitazione va al 10% con le stesse regole dei beni significativi che applicheresti a un cliente italiano. I casi sono spiegati nella guida su [IVA nei preventivi per lavori in casa](/guide/iva-preventivo-lavori-casa).",
        "Se il cliente non è un privato ma un'azienda estera, i passaggi possono cambiare e conviene fare una verifica con il commercialista prima di mandare il preventivo.",
      ],
    },
    {
      titolo: "Quali dati chiedere al cliente straniero",
      paragrafi: [
        "Oltre a nome, cognome e indirizzo del cantiere, chiedi l'indirizzo di residenza completo, con il paese, un'email che legge davvero e un numero di telefono con il prefisso internazionale. Chiedigli anche se ha un codice fiscale italiano: chi possiede una casa in Italia spesso ce l'ha già, e ti servirà per la fattura.",
        "C'è un motivo in più per chiederlo subito. Se il cliente vuole usare una detrazione fiscale sui lavori, il pagamento va fatto con il bonifico apposito, che riporta il codice fiscale di chi chiede la detrazione e la tua partita IVA. Un cliente straniero spesso non conosce questo meccanismo: dirglielo prima che paghi dal suo conto estero gli evita di perdere un vantaggio, e a te evita un cliente scontento a lavoro finito.",
        "Concorda anche come pagherà: un bonifico da una banca estera può arrivare con commissioni o tempi diversi. Scrivi nel preventivo il tuo IBAN e il codice BIC della tua banca, e che le eventuali spese bancarie del bonifico sono a carico di chi lo ordina.",
      ],
    },
    {
      titolo: "Il recesso spiegato nella sua lingua",
      paragrafi: [
        "Un cliente privato straniero, per il codice del consumo, è un consumatore come un altro. Se il contratto nasce a casa sua o a distanza, di regola ha 14 giorni per recedere senza dare motivi, e tu devi informarlo prima che si impegni, consegnandogli anche il modulo di recesso. Se l'informativa manca, il termine si allunga di dodici mesi.",
        "Con un cliente straniero il problema non è la regola, è che la capisca. Un'informativa in italiano consegnata a chi non lo legge fa il minimo indispensabile e lascia aperta la discussione su cosa sapesse davvero. Meglio darla nelle due lingue, come il resto del preventivo: con PreventivoLampo la pagina di accettazione e il modulo di recesso sono tradotti nella lingua del cliente.",
        "I termini, le eccezioni (per esempio i beni fatti su misura o le riparazioni urgenti chieste dal cliente) e cosa succede se il lavoro parte prima della scadenza sono spiegati nella guida sul [recesso dal preventivo accettato a casa](/guide/recesso-preventivo-accettato-a-casa).",
      ],
    },
    {
      titolo: "Il sopralluogo, quando non vi capite bene",
      paragrafi: [
        "Il preventivo bilingue nasce dal sopralluogo, ed è lì che si creano gli equivoci. Ripeti ad alta voce le misure e le scelte, mostra con le mani quello che farai, fotografa le cose da rimuovere e quelle da tenere. Se il cliente ti manda messaggi nella sua lingua, rispondi per iscritto: una conversazione scritta, anche tradotta male, vale più di una a voce capita a metà.",
        "Lo stesso vale per te. Se l'italiano non è la tua prima lingua, puoi raccontare il sopralluogo nella lingua in cui ragioni meglio: a PreventivoLampo arriva il testo, in rumeno, in albanese, in arabo o in un'altra lingua, e la bozza del preventivo esce comunque in italiano, pronta da tradurre per il cliente.",
      ],
    },
  ],
  domande: {
    titolo: "Domande sul preventivo per clienti stranieri",
    voci: [
      {
        d: "Posso fare il preventivo solo in inglese?",
        r: "Puoi, ma non conviene. Il codice del consumo tiene ferma la lingua italiana per le informazioni ai consumatori, e un documento solo in inglese ti lascia scoperto se nasce una lite in Italia. La soluzione più solida è il preventivo in due lingue, con una clausola che dica che fa fede l'italiano.",
      },
      {
        d: "Se le due versioni dicono cose diverse, quale vale?",
        r: "Quella indicata nella clausola, di solito l'italiano. Ma con un consumatore, se il senso di una clausola è dubbio, prevale l'interpretazione più favorevole a lui (art. 35 del codice del consumo). Per questo la traduzione deve dire esattamente le stesse cose dell'originale.",
      },
      {
        d: "Il cliente vive all'estero: devo mettere l'IVA?",
        r: "Sì, se l'immobile è in Italia. I servizi relativi agli immobili si considerano effettuati dove si trova l'immobile (art. 7-quater del decreto IVA), indipendentemente da dove risiede il cliente.",
      },
      {
        d: "L'aliquota è la stessa di un cliente italiano?",
        r: "Sì. Dipende dal tipo di immobile, dal tipo di intervento e da chi compra i materiali, non dalla nazionalità o dalla residenza del cliente.",
      },
      {
        d: "Il cliente straniero ha diritto al recesso?",
        r: "Sì, alle stesse condizioni di un cliente italiano: se è un privato e il contratto nasce a casa sua o a distanza, di regola ha 14 giorni. L'informativa e il modulo conviene darli anche nella sua lingua.",
      },
      {
        d: "Come scrivo le parole che non si traducono, come «a corpo»?",
        r: "Tieni la parola italiana e aggiungi una spiegazione breve nella lingua del cliente, per esempio «a corpo: prezzo fisso per tutto il lavoro descritto». Il cliente ritroverà quella parola nei documenti italiani e saprà cosa vuol dire.",
      },
    ],
  },
  fonti: [
    { nome: "Codice del consumo, art. 35: forma e interpretazione delle clausole", url: "https://brocardi.it/codice-del-consumo/parte-iii/titolo-i/art35.html" },
    { nome: "Codice del consumo, art. 49: obblighi di informazione e lingua", url: "https://www.brocardi.it/codice-del-consumo/parte-iii/titolo-iii/capo-i/sezione-ii/art49.html" },
    { nome: "Codice del consumo, art. 9: indicazioni in lingua italiana", url: "https://brocardi.it/codice-del-consumo/parte-ii/titolo-ii/capo-ii/art9.html" },
    { nome: "Decreto IVA, art. 7-quater: servizi relativi a beni immobili", url: "https://brocardi.it/testo-unico-iva/titolo-i/art7quater.html" },
    { nome: "Agenzia delle Entrate, risoluzione 48/E del 1° giugno 2010", url: "https://agenziaentrate.gov.it/portale/documents/20143/305315/Ris+48+del+01+06+10_Ris+n+48E+del+1+giugno+2010.pdf/62f28036-c699-e5c5-28a8-7baeaa86b3e1" },
    { nome: "Ministero delle Imprese e del Made in Italy: diritto di recesso", url: "https://www.mimit.gov.it/it/mercato-e-consumatori/tutela-del-consumatore/diritti-del-consumatore/diritto-di-recesso" },
  ],
  avvertenza:
    "Questa guida ti aiuta a impostare un preventivo per un cliente straniero, ma non è un parere legale né fiscale. Con clienti che sono aziende, che vivono fuori dall'Unione o con importi rilevanti, fai controllare il testo da un legale e la parte fiscale dal tuo commercialista.",
};
