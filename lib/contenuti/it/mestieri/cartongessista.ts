import type { PaginaMestiere } from "../../tipi";

export const cartongessista: PaginaMestiere = {
  meta: {
    titolo: "Preventivo cartongessista: pareti e controsoffitti",
    descrizione:
      "Il preventivo cartongessista per pareti, contropareti, controsoffitti e isolamento: racconti il sopralluogo e la bozza usa solo i prezzi del tuo listino.",
  },
  nome: "Cartongessista",
  riga: "Pareti divisorie, contropareti, controsoffitti, velette e isolamento in lastra.",
  h1: "Preventivo cartongessista: dici le misure, la bozza conta i metri quadri",
  sottotitolo:
    "Pareti, contropareti, controsoffitti, velette, isolamento. Finito il sopralluogo racconti le misure come le hai prese, a spanne: la bozza le porta nell'unità delle tue voci, usa solo i prezzi del tuo listino e ti chiede quello che il cliente non ha ancora deciso.",
  esempio: {
    titolo: "Le misure dette a voce, le righe nella bozza",
    intro:
      "Un open space da dividere, un bagno con i tubi a vista e una camera che sente i vicini. A destra vedi la parete a doppia lastra in metri quadri, il controtelaio del cliente come sola posa, i fori per i faretti contati a pezzo e la domanda sulle velette che il cliente non ha ancora deciso.",
    lavoro: "Divisione open space, bagno e camera",
    dettatura:
      "Vado col lavoro del signor Rinaldi, appartamento. Il soggiorno lo dividiamo: parete in cartongesso fra soggiorno e studio, quattro e venti per due e settanta, doppia lastra con la lana di roccia dentro. Nella parete va la porta scorrevole, il controtelaio l'ha già comprato lui, io lo inserisco. In bagno una controparete per chiudere i tubi, un metro e ottanta per tutta l'altezza, con la lastra idrorepellente. In corridoio controsoffitto ribassato, saranno una decina di metri quadri, con sei fori per i faretti. Sulla parete della camera che confina con i vicini una controparete isolante, tre e sessanta per due e settanta. In soggiorno le velette per le tende, quante finestre non l'ha ancora deciso. Stuccatura dei giunti compresa, la pittura no, e i faretti li monta l'elettricista.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da cartongessista",
    intro:
      "In lastra il prezzo dipende da quante lastre, che struttura e che isolante: per questo le righe si distinguono per stratigrafia, più velette, rinforzi e fori. Il metro quadro di ogni tipo di parete è il tuo e arriva dal tuo listino; una stratigrafia che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Parete divisoria in cartongesso, lastra singola", unita: "m²", nota: "Struttura metallica e una lastra per lato. Scrivi lo spessore della struttura." },
      { voce: "Parete divisoria in cartongesso, doppia lastra", unita: "m²", nota: "Due lastre per lato: più rigida, regge meglio i pesi e isola di più dal rumore." },
      { voce: "Controparete su struttura metallica", unita: "m²", nota: "Staccata dal muro: lascia spazio a tubi, cavi e isolante." },
      { voce: "Controsoffitto in cartongesso", unita: "m²", nota: "Piano, su struttura appesa. Scrivi l'altezza di ribassamento compresa." },
      { voce: "Isolante in lana minerale nell'intercapedine", unita: "m²", nota: "Lana di roccia o di vetro, con lo spessore scritto nella voce." },
      { voce: "Maggiorazione lastra idrorepellente", unita: "m²", nota: "Per bagni e cucine. Tenerla come differenza rende chiaro il perché del prezzo." },
      { voce: "Maggiorazione lastra per protezione al fuoco", unita: "m²", nota: "Per vani tecnici, locali caldaia, cavedi. Indica il tipo di lastra." },
      { voce: "Veletta o ribassamento perimetrale", unita: "m", nota: "Per tende, luci indirette, travi da nascondere. A metro lineare." },
      { voce: "Vano porta con rinforzo", unita: "cad", nota: "Apertura nella parete con i montanti rinforzati per il telaio." },
      { voce: "Inserimento controtelaio per porta scorrevole", unita: "cad", nota: "Solo posa se il controtelaio lo compra il cliente." },
      { voce: "Rinforzo per pensili e carichi sospesi", unita: "m", nota: "Dove andranno mensole, pensili, TV o sanitari sospesi: va deciso prima di chiudere." },
      { voce: "Foro per faretto", unita: "cad", nota: "Il foro e basta: il collegamento è dell'elettricista." },
      { voce: "Botola d'ispezione", unita: "cad", nota: "Per arrivare a valvole, collettori o macchine del clima nel controsoffitto." },
      { voce: "Paraspigolo", unita: "m", nota: "Sugli spigoli di velette, nicchie e pareti, prima della stuccatura." },
      { voce: "Stuccatura e rasatura dei giunti", unita: "m²", nota: "Scrivi il livello di finitura: pronta per la pittura o solo giunti stuccati." },
      { voce: "Smontaggio controsoffitto esistente", unita: "m²", nota: "Con il trasporto del materiale smontato, se è compreso." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro in cartongesso",
    intro:
      "Il metro quadro in cartongesso dice poco se non dici cosa c'è dentro: quante lastre, che struttura, che isolante, che finitura. Due preventivi con lo stesso prezzo al metro possono essere due lavori diversi.",
    punti: [
      {
        titolo: "La stratigrafia nella voce",
        testo:
          "Spessore della struttura, numero di lastre per lato, tipo di lastra, isolante. Scrivilo nel nome della voce: è quello che il cliente legge sul PDF e usa per confrontare il tuo prezzo con quello di un altro.",
      },
      {
        titolo: "Le aperture",
        testo:
          "Una parete con il vano porta non si conta come una parete piena: o togli l'apertura e la paghi come voce a parte, o la conti vuoto per pieno. Qualunque metodo usi, scrivilo, perché è la prima cosa che si rimisura.",
      },
      {
        titolo: "La finitura dei giunti",
        testo:
          "Stuccare i giunti e consegnare una parete pronta da pitturare non sono lo stesso lavoro. Se la pittura la fa un altro, scrivi fino a dove arrivi tu, così l'imbianchino non trova sorprese e il cliente non ti chiama.",
      },
      {
        titolo: "I rinforzi",
        testo:
          "La TV a parete, i pensili della cucina, il lavabo sospeso: in una parete di cartongesso servono rinforzi messi prima di chiudere. Chiedi al cliente dove andranno e metti la voce: dopo costa il doppio della fatica.",
      },
      {
        titolo: "Velette, spigoli e dettagli",
        testo:
          "Velette, nicchie, gole per i led sono lavori a metro con molti tagli. Tienili separati dai metri quadri di parete o di controsoffitto, altrimenti un preventivo pieno di dettagli sembra uguale a uno di pareti dritte.",
      },
      {
        titolo: "Lavori degli altri",
        testo:
          "Impianti nelle pareti, faretti, pittura: di solito non sono tuoi. Mettili fra le esclusioni con il nome di chi li fa. Il cliente vede chi chiamare, e tu sai cosa aspettare prima di chiudere le lastre.",
      },
    ],
  },
  documenti: {
    titolo: "Pratiche, lastre, IVA e rifiuti in cartongesso",
    intro:
      "Il cartongesso cambia la pianta di una casa, e per questo qualche regola va tenuta presente. Queste sono quelle che tornano nei lavori di casa.",
    punti: [
      {
        titolo: "Pareti nuove o spostate",
        testo:
          "Realizzare o spostare pareti interne non portanti è manutenzione straordinaria (DPR 380/2001, art. 3): di solito serve la CILA, che il committente presenta in Comune con l'asseverazione di un tecnico e in cui compaiono i dati dell'impresa che fa i lavori. Se la pratica non la segui tu, scrivilo fra le esclusioni.",
      },
      {
        titolo: "Controsoffitti",
        testo:
          "Installare, riparare o sostituire un controsoffitto non strutturale è edilizia libera, secondo il glossario del DM 2 marzo 2018. Nei lavori di casa è il caso più comune.",
      },
      {
        titolo: "Il tipo di lastra",
        testo:
          "Le lastre in gesso rivestito seguono la norma UNI EN 520, che ne distingue i tipi: standard, a ridotto assorbimento d'acqua, con migliore comportamento al fuoco e altri. Scrivere il tipo nel preventivo evita che il cliente confronti una lastra standard con una idrorepellente.",
      },
      {
        titolo: "Lastre, isolanti e IVA",
        testo:
          "Una parete o un controsoffitto in un'abitazione rientrano di solito nella manutenzione, con l'IVA al 10%. Lastre, profili e isolanti non sono fra i beni significativi del DM 29/12/1999: anche se li fornisci tu, non c'è nessuna divisione fra 10% e 22% da fare.",
      },
      {
        titolo: "Subappalto e inversione contabile",
        testo:
          "Chi lavora in lastra spesso è chiamato dall'impresa che ha preso il cantiere, o divide gli spazi di un ufficio. In subappalto edile, o per un cliente con partita IVA su un edificio, di regola si applica l'inversione contabile (DPR 633/1972, art. 17, comma 6) e la fattura esce senza IVA; con il privato no. Il sistema oggi calcola il 10% e il 22%, non ancora l'inversione contabile: in questi casi controlla il totale prima di mandarlo.",
      },
      {
        titolo: "Sfridi e lastre smontate",
        testo:
          "I rifiuti dei lavori di manutenzione e dei piccoli interventi edili si considerano prodotti presso la sede di chi fa il lavoro (D.Lgs. 152/2006, art. 193, comma 19). Conviene una riga per trasporto e smaltimento: il cliente sa che ritagli e lastre vecchie non restano in cantina.",
      },
    ],
    avvertenza:
      "Sono appunti di orientamento, non un parere di un tecnico o di un commercialista. Pratiche e regole fiscali dipendono dal caso e dal Comune: prima di scriverle in un preventivo vero, falle verificare a chi se ne occupa.",
  },
  straniero: {
    titolo: "Se il cliente parla un'altra lingua",
    testo:
      "Lo straniero che compra un open space e vuole ricavarne una camera, o l'azienda estera che divide un ufficio: per loro «controparete» e «veletta» non dicono niente. Il preventivo può partire in inglese, tedesco, francese, spagnolo o olandese, con queste parole rese in modo chiaro, l'italiano che fa fede e il modulo di recesso tradotto. Tu lo prepari e lo controlli in italiano.",
  },
  domande: {
    titolo: "Domande dai cartongessisti",
    voci: [
      {
        d: "Nel listino ho la parete a lastra singola, ma qui faccio la doppia. Cosa succede?",
        r: "Se la doppia lastra non c'è, la riga resta da prezzare ed è evidenziata: il sistema non ti mette il prezzo della singola al posto della doppia. Scrivi tu il prezzo e aggiungi la voce al listino.",
      },
      {
        d: "Consegno i giunti stuccati ma non la parete pronta da pitturare. Come lo scrivo?",
        r: "Con due voci a listino, stuccatura dei giunti e rasatura completa, e nel racconto dici quale fai. Se la pittura e la rasatura finale sono di un altro, dillo: finiscono fra le esclusioni sotto le voci.",
      },
      {
        d: "Lavoro spesso per un'impresa che mi passa i cantieri. Mi serve lo stesso?",
        r: "Sì, anche lì serve un preventivo chiaro, voce per voce. Attenzione all'IVA: fra imprese del settore di solito vale l'inversione contabile, e oggi il sistema non la calcola ancora. Verifica il totale con il commercialista prima di mandarlo.",
      },
      {
        d: "Il cliente vuole appendere la TV sulla parete nuova. Cosa metto nel preventivo?",
        r: "Il rinforzo, a metro o a pezzo come l'hai a listino. Dillo nel racconto con la posizione, «rinforzo per la TV sulla parete del soggiorno», così entra nella bozza prima che le lastre siano chiuse.",
      },
      {
        d: "Nella parete c'è una porta. Tolgo il vano dal conto dei metri quadri?",
        r: "Decidi tu, ma in modo coerente con la voce del vano porta. Se tieni il vano come voce a parte, correggi nella bozza i metri quadri della parete togliendo l'apertura; se conti vuoto per pieno, scrivilo nel nome della voce.",
      },
      {
        d: "Sopra il controsoffitto c'è la macchina del clima. Come prevedo l'ispezione?",
        r: "Con una voce «botola d'ispezione» a pezzo nel listino. Dilla nel racconto insieme al controsoffitto: il tecnico del clima la ritroverà, e il cliente sa già perché c'è.",
      },
      {
        d: "Il cliente chiede quanto isola dal rumore la controparete. Cosa scrivo?",
        r: "Scrivi nel nome della voce la stratigrafia: struttura, numero di lastre, tipo e spessore dell'isolante. Una promessa sui decibel senza una misura non la mettere: il cliente confronta il pacchetto, e su quello sei sicuro.",
      },
    ],
  },
};
