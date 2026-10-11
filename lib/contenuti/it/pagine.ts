// Pagine indice (mestieri, funzioni, guide, modelli), prezzi, chi siamo, ed etichette comuni delle pagine.
// Le cifre dei prezzi sono quelle della home (lib/i18n/it.ts, sezione prezzi) e delle condizioni.

export const pagine = {
  mestieri: {
    meta: {
      titolo: "Software preventivi per ogni mestiere",
      descrizione:
        "Preventivi per elettricisti, idraulici, officine, fotografi, catering, traslochi e altri mestieri: voci tipiche, esempi e il modo giusto di prezzare.",
    },
    h1: "Il preventivo del tuo mestiere",
    testo:
      "Preventivi funziona con ogni mestiere che fa preventivi a voci. Qui sotto ci sono tutti quelli che conosce già, per famiglia: quando scegli il tuo, l'IVA e le regole del mestiere sono già impostate. Per alcuni c'è anche una pagina con le voci tipiche e come si prezzano.",
    altro:
      "Il tuo mestiere non c'è? Se fai preventivi a voci funziona lo stesso: le parole del mestiere le trova nel tuo listino, e quello che non c'è resta da prezzare.",
  },
  funzioni: {
    meta: {
      titolo: "Come funziona Preventivi",
      descrizione:
        "Dal racconto del lavoro al preventivo accettato: bozza dal tuo listino, domande su quello che manca, PDF nella lingua del cliente e accettazione online.",
    },
    h1: "Come funziona, pezzo per pezzo",
    testo:
      "Quattro cose fanno il lavoro: il racconto del lavoro, il tuo listino, il preventivo nella lingua del cliente e l'accettazione online. Qui le trovi spiegate una per una, con quello che fanno e quello che non fanno.",
  },
  guide: {
    meta: {
      titolo: "Guide al preventivo, per ogni mestiere",
      descrizione:
        "Come fare un preventivo, a corpo o a misura, IVA nei lavori in casa, cliente straniero, recesso: guide pratiche per chi fa preventivi, con le fonti.",
    },
    h1: "Guide al preventivo, scritte per chi lavora dai clienti",
    testo:
      "Cosa scrivere perché il preventivo regga fino al saldo, quale IVA applicare, come comportarsi con un cliente straniero o con un preventivo firmato a casa sua. Guide pratiche, con le fonti in fondo a ogni pagina.",
  },
  modelli: {
    meta: {
      titolo: "Modelli di preventivo gratis per mestiere",
      descrizione:
        "Fac simile di preventivo gratis in PDF ed Excel per elettricista, idraulico, officina, fotografo, catering e altri mestieri, con le voci tipiche.",
    },
    h1: "Modelli di preventivo gratis, uno per mestiere",
    testo:
      "Un fac simile per ogni mestiere, in PDF da stampare e in Excel da compilare. Dentro trovi le voci tipiche del mestiere con le unità di misura, le esclusioni da non dimenticare, la validità dell'offerta e lo spazio per l'accettazione del cliente.",
    cosaContiene: {
      titolo: "Cosa c'è nel modello",
      punti: [
        { titolo: "Intestazione e cliente", testo: "Spazio per i tuoi dati, il logo, i dati del cliente e l'indirizzo del lavoro." },
        { titolo: "Voci del mestiere", testo: "Le righe tipiche del mestiere con l'unità di misura già scritta. Quantità e prezzi li metti tu." },
        { titolo: "IVA e totali", testo: "Imponibile, aliquota e totale, con la nota sui beni significativi dove serve." },
        { titolo: "Esclusioni e condizioni", testo: "Cosa non è compreso, validità dell'offerta, acconto e saldo, tempi." },
        { titolo: "Accettazione", testo: "Lo spazio per la firma del cliente, con data." },
      ],
    },
    nota:
      "I modelli sono gratuiti e senza registrazione. I prezzi non ci sono apposta: sono i tuoi. Se vuoi che il preventivo si scriva da solo partendo dal racconto del lavoro, con i prezzi del tuo listino già dentro, è quello che fa Preventivi.",
    pdf: "PDF",
    excel: "Excel",
    scarica: "Scarica il modello da {mestiere} in {formato}",
  },
  prezzi: {
    meta: {
      titolo: "Prezzi: 30 giorni gratis, poi 19,90 € al mese",
      descrizione:
        "Prezzi di Preventivi: pilota gratuito di 30 giorni senza rinnovo automatico, poi 19,90 € al mese o 199 € l'anno, IVA esclusa.",
    },
    h1: "Prezzi chiari, e prima lo provi gratis",
    testo:
      "Trenta giorni per provarlo sui tuoi lavori veri, con preventivi illimitati. Poi, solo se decidi di restare, un canone fisso: nessun costo per preventivo, nessun costo di avvio.",
    domande: {
      titolo: "Domande sui prezzi",
      voci: [
        {
          d: "Cosa succede alla fine dei 30 giorni?",
          r: "Niente, se non ci dici niente: il pilota finisce lì e non ti addebitiamo nulla. Se vuoi restare scegli tu fra mensile e annuale.",
        },
        {
          d: "C'è un limite di preventivi?",
          r: "No. Nel pilota e con il canone i preventivi sono illimitati.",
        },
        {
          d: "Posso disdire quando voglio?",
          r: "Sì. Il mensile si disdice quando vuoi, con effetto alla fine del mese già pagato. L'annuale vale dodici mesi e si rinnova solo se lo chiedi tu.",
        },
        {
          d: "I prezzi sono IVA esclusa?",
          r: "Sì, 19,90 € al mese e 199 € l'anno sono IVA esclusa. Il servizio è riservato a imprese e professionisti con partita IVA.",
        },
        {
          d: "Se cambiate i prezzi?",
          r: "Te lo diciamo almeno 30 giorni prima, e i prezzi nuovi valgono solo dal rinnovo successivo.",
        },
        {
          d: "Se smetto, il mio listino che fine fa?",
          r: "Listino, preventivi e dati dell'impresa sono tuoi. Su richiesta ti mandiamo il listino in Excel e i PDF dei preventivi.",
        },
      ],
    },
  },
  chiSiamo: {
    meta: {
      titolo: "Chi siamo: chi fa Preventivi e perché",
      descrizione:
        "Preventivi è fatto da K Digital Solution, lo studio di Sofiane Khatib. Perché esiste, come trattiamo i tuoi prezzi e i dati dei tuoi clienti, come contattarci.",
    },
    h1: "Chi fa Preventivi, e perché",
    intro:
      "Preventivi è un servizio di K Digital Solution, lo studio di Sofiane Khatib che sviluppa software per piccole imprese. È nato da una cosa che conosce chiunque lavori dai clienti: di giorno si lavora, i preventivi si scrivono la sera.",
    sezioni: [
      {
        titolo: "Perché esiste",
        paragrafi: [
          "Chi lavora dai clienti vede il lavoro, prende misure e richieste e riparte con tutto in testa. Poi il preventivo resta lì per giorni, perché scriverlo vuol dire cercare i prezzi, rifare i conti, ricordarsi le esclusioni. Nel frattempo il cliente chiede a un altro.",
          "Preventivi serve a chiudere quel buco: racconti il lavoro appena finito con il cliente, come lo racconteresti a un collega, e la bozza è pronta prima di arrivare all'appuntamento dopo.",
        ],
      },
      {
        titolo: "Le regole che ci siamo dati",
        paragrafi: ["Sono le stesse che trovi in tutte le pagine del sito, perché sono il prodotto."],
        punti: [
          { titolo: "I prezzi sono tuoi", testo: "Ogni prezzo della bozza viene dal tuo listino. Se una voce non c'è resta da prezzare: il sistema non inventa cifre." },
          { titolo: "Decidi sempre tu", testo: "Al cliente non arriva niente senza la tua approvazione. Le misure che mancano te le chiede invece di indovinarle." },
          { titolo: "Ti risponde una persona", testo: "Se ti blocchi, scrivi e ti risponde chi il servizio l'ha fatto, non un bot." },
          { titolo: "Dati in Europa", testo: "Listino e preventivi sono conservati nell'Unione Europea. Per preparare la bozza il testo del racconto passa da un fornitore esterno, indicato nella pagina Privacy. Con te firmiamo l'accordo per il trattamento dei dati dei tuoi clienti." },
        ],
      },
      {
        titolo: "Il programma pilota",
        paragrafi: [
          "Il programma pilota è per un gruppo di professionisti di mestieri diversi: lo usano sui loro lavori veri per 30 giorni e ci dicono cosa non funziona. Quello che impariamo dal pilota cambia il prodotto, e i numeri che pubblicheremo verranno da lì, misurati.",
        ],
      },
    ],
    contatti: "Scrivici a [{email}](mailto:{email}). Rispondiamo noi.",
  },
} as const;

export const ui = {
  home: "Home",
  aggiornata: "Aggiornata il {data}",
  domandeTitolo: "Domande frequenti",
  inQuestaPagina: "In questa pagina",
  mestiere: {
    racconti: "Cosa racconti",
    ricevi: "Cosa ricevi",
    vocale: "Racconto del lavoro",
    bozza: "Bozza",
    prezzo: "dal tuo listino",
    daChiedere: "da chiedere",
    materialeCliente: "materiale del cliente",
    domande: "Le domande che ti fa",
    escluso: "Escluso dal preventivo",
    note: "Note per te",
    didascalia:
      "Bozza ricavata dal sistema dal racconto qui sopra, il {data}. Lavoro e cliente sono inventati. I prezzi non ci sono perché sono i tuoi: nella bozza vera arrivano dal tuo listino, e una voce che non hai resta da prezzare.",
    raccontaInLingua: "Puoi raccontarlo anche nella tua lingua: la bozza esce in italiano.",
    colVoce: "Voce",
    colUnita: "Unità",
    colNota: "Cosa scrivere",
    modelloTitolo: "Il modello di preventivo da {mestiere}, gratis",
    modelloTesto:
      "Preferisci partire da un foglio? Qui trovi il fac simile con le voci di questa pagina, in PDF da stampare e in Excel da compilare. Quantità e prezzi li metti tu.",
    altriModelli: "Tutti i modelli",
    vicini: "Mestieri vicini",
    funzioni: "Come funziona",
    guide: "Da leggere prima del prossimo preventivo",
    ctaTitolo: "Il prossimo preventivo da {mestiere} mandalo dal telefono.",
    ctaTesto:
      "Programma pilota gratuito di 30 giorni: lo provi sui tuoi lavori veri, con il tuo listino. Ti richiamiamo noi.",
  },
  guida: {
    inBreve: "In breve",
    fonti: "Fonti",
    altreGuide: "Altre guide",
  },
  funzione: {
    altre: "Le altre funzioni",
    mestieri: "Per il tuo mestiere",
  },
  glossario: {
    lettere: "Lettere",
  },
  piede: {
    mestieri: "Mestieri",
    funzioni: "Come funziona",
    risorse: "Risorse",
    servizio: "Il servizio",
  },
} as const;
