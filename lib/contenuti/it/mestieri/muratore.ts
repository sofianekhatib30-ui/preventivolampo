import type { PaginaMestiere } from "../../tipi";

export const muratore: PaginaMestiere = {
  meta: {
    titolo: "Preventivo muratore: tramezzi, tracce, intonaci",
    descrizione:
      "Racconti demolizioni, tramezzi e intonaci visti al sopralluogo: il preventivo muratore esce coi prezzi del tuo listino e le domande su ciò che manca.",
  },
  nome: "Muratore",
  riga: "Demolizioni, tramezzi, aperture e chiusure di porte, tracce, intonaci e rasature.",
  h1: "Preventivo muratore: racconti le opere, i prezzi li prende dal tuo listino",
  sottotitolo:
    "Demolizioni, tramezzi, vani porta, tracce, intonaci, assistenza agli impianti. Dici quello che hai visto con le misure prese a passi o a occhio: la bozza le rifà in metri quadri, metri lineari o metri cubi come le hai nel listino, e quello che non hai detto diventa una domanda.",
  esempio: {
    titolo: "Le opere dette al telefono, le righe nella bozza",
    intro:
      "Un tramezzo da buttare giù, uno da tirare su e due porte da spostare, detti al socio al telefono. A destra vedi i metri quadri di demolizione e di tramezzo ricavati dalle misure, le tracce a metro, il controtelaio del cliente come sola muratura e la domanda sulla rasatura che non si può ancora misurare.",
    lavoro: "Appartamento, nuova divisione degli spazi",
    dettatura:
      "Senti, lavoro del signor Ricci. Tra cucina e soggiorno butto giù il tramezzo, sarà tre e sessanta per due e settanta, forato da otto. Poi ne tiro su uno nuovo in camera per fare la cabina armadio, due e quaranta più o meno, stessa altezza. Apro una porta nuova nel corridoio, con l'architrave, e chiudo quella vecchia del bagno. Tracce per l'elettricista e l'idraulico, una quarantina di metri in tutto, e poi le chiudo io. Intonaco civile sul tramezzo nuovo. In soggiorno c'è da rasare, quanti metri non lo so finché non tolgo la carta da parati. Il controtelaio della porta l'ha già comprato lui, io lo muro e basta. Le macerie le porto via io. La pratica in Comune la fa il suo geometra, non è roba mia.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da muratore",
    intro:
      "Demolire, costruire, aprire, chiudere, intonacare: le opere murarie di una casa si scrivono con queste righe, quasi tutte a metro quadro o a metro. Il prezzo lo fai tu per spessore e materiale e arriva dal tuo listino; un'opera che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Demolizione tramezzo in laterizio", unita: "m²", nota: "Scrivi lo spessore: un forato sottile e un muro pieno non si buttano giù nello stesso tempo." },
      { voce: "Rimozione intonaco ammalorato", unita: "m²", nota: "Scrostatura fino al mattone, prima di rifare l'intonaco." },
      { voce: "Tramezzo in mattoni forati", unita: "m²", nota: "Indica lo spessore del laterizio e se i vani porta li togli dal conto." },
      { voce: "Apertura vano porta su tramezzo", unita: "cad", nota: "Taglio, architrave e sistemazione delle spallette." },
      { voce: "Chiusura vano porta", unita: "cad", nota: "Tamponamento in laterizio, pronto da intonacare." },
      { voce: "Posa controtelaio", unita: "cad", nota: "Muratura del controtelaio della porta. Se lo fornisce il cliente, la riga è solo posa." },
      { voce: "Traccia su muratura", unita: "m", nota: "Per impianti elettrici o idraulici. Scrivi per quale impianto la apri." },
      { voce: "Chiusura tracce", unita: "m", nota: "Riempimento con malta e ripristino a filo muro. Spesso separata dall'apertura." },
      { voce: "Intonaco civile", unita: "m²", nota: "Rinzaffo, arriccio e finitura. Indica se gli angolari sugli spigoli sono compresi." },
      { voce: "Rasatura pareti", unita: "m²", nota: "Su intonaco vecchio, per lasciare la parete pronta per la pittura." },
      { voce: "Ripresa d'intonaco", unita: "m²", nota: "Riparazioni a macchia, dopo tracce o distacchi. Se applichi un minimo, scrivilo." },
      { voce: "Foro passante su muratura", unita: "cad", nota: "Per la cappa della cucina, lo scarico del condizionatore, la ventilazione. Indica il diametro." },
      { voce: "Assistenza muraria agli impianti", unita: "h", nota: "Il lavoro di supporto a elettricista e idraulico, quando non si può contare a metro." },
      { voce: "Carico e trasporto macerie", unita: "m³", nota: "Se le conti a volume, dillo. Scrivi se il conferimento in discarica è compreso." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da muratore",
    intro:
      "Nelle opere murarie il prezzo dipende da cose che il cliente non vede: lo spessore del muro, il piano, quello che trovi dentro quando apri. Scriverle è il modo per non doverle spiegare dopo.",
    punti: [
      {
        titolo: "Al metro quadro di parete",
        testo:
          "Tramezzi e intonaci si contano a metro quadro, ma il cliente non sa cosa c'è dentro. Scrivi lo spessore, il tipo di laterizio e se i vani sono tolti dal conto. Sono tre parole e chiudono la discussione prima che cominci.",
      },
      {
        titolo: "Demolire vuol dire anche portare giù",
        testo:
          "Dentro la demolizione ci sono i sacchi da portare al piano terra e il trasporto. Un quarto piano senza ascensore non è un piano terra con il cortile: mettilo nel prezzo o in una voce a parte, ma non lasciarlo sottinteso.",
      },
      {
        titolo: "Le sorprese dentro i muri",
        testo:
          "Tubi vecchi, travi dove non te le aspetti, intonaci che vengono giù a pezzi. Scrivi sotto le voci che quello che si scopre aprendo si valuta a parte, con il prezzo del listino o a ore.",
      },
      {
        titolo: "Il lavoro per gli altri mestieri",
        testo:
          "Tracce, chiusure, fori: lavori piccoli che si sommano. Decidi se contarli a metro, a pezzo o a ore, e scrivi per quale impianto sono, così è chiaro che non stanno dentro il prezzo dell'elettricista.",
      },
      {
        titolo: "Il minimo per i piccoli lavori",
        testo:
          "Per una ripresa d'intonaco o un foro solo, l'uscita costa più del lavoro. Se nel listino hai una voce minima, la bozza la usa; se non c'è, la riga resta da prezzare e decidi tu.",
      },
      {
        titolo: "Quello che non è tuo",
        testo:
          "Pratiche, calcoli, impianti, pittura finale: se non li fai, mettili fra le esclusioni. È lì che il cliente capisce che il tuo prezzo è quello delle opere murarie, non quello di tutta la casa.",
      },
    ],
  },
  documenti: {
    titolo: "Pratiche, sicurezza e IVA nelle opere murarie",
    intro:
      "Il muratore è spesso il primo che entra in cantiere, e il cliente gli chiede anche cosa serve per cominciare. Queste sono le cose che vale la pena sapere.",
    punti: [
      {
        titolo: "Spostare un tramezzo",
        testo:
          "Spostare pareti interne o aprire porte interne, senza toccare le parti strutturali, è manutenzione straordinaria: serve la CILA (art. 6-bis del DPR 380/2001), con l'asseverazione di un tecnico abilitato e i dati dell'impresa che esegue. Se la pratica non è tua, scrivilo fra le esclusioni.",
      },
      {
        titolo: "Intonaci senza pratiche",
        testo:
          "Rifare, riparare o tinteggiare gli intonaci interni è edilizia libera secondo il glossario del DM 2 marzo 2018. Vale anche per le facciate, ma nelle zone con vincolo paesaggistico l'autorizzazione non serve solo se rispetti colori, materiali e caratteristiche esistenti.",
      },
      {
        titolo: "Patente a crediti",
        testo:
          "Dal 1° ottobre 2024 le imprese e i lavoratori autonomi che lavorano fisicamente in un cantiere edile devono avere la patente a crediti (art. 27 del D.Lgs. 81/2008), anche se non sono imprese edili. Il committente deve verificarla: tenerne gli estremi a portata di mano evita ritardi.",
      },
      {
        titolo: "I rifiuti della manutenzione",
        testo:
          "Per l'art. 193, comma 19, del D.Lgs. 152/2006 le macerie dei piccoli interventi edili si considerano prodotte presso la sede di chi esegue il lavoro, e per quantità limitate si possono portare lì con il documento di trasporto. Nel preventivo scrivi chi le porta via e se il conferimento è compreso.",
      },
      {
        titolo: "IVA e inversione contabile",
        testo:
          "Spostare un tramezzo o rifare gli intonaci in un'abitazione è manutenzione, con l'IVA di regola al 10% (art. 7 della legge 488/1999). Con un cliente con partita IVA, demolizioni, intonaci e lavori di completamento su un edificio vanno di regola in inversione contabile (art. 17, comma 6, del DPR 633/1972), e lo stesso vale in subappalto per un'impresa edile. La costruzione di un edificio nuovo fuori dal subappalto no: verifica con il commercialista. Il sistema oggi calcola il 10% e il 22%, non l'inversione contabile: in quei casi controlla il totale prima di mandarlo.",
      },
    ],
    avvertenza:
      "Prendile come un promemoria del mestiere e non come un parere: ogni cantiere ha le sue regole, e per pratiche e fatture l'ultima parola spetta al tecnico e al commercialista.",
  },
  straniero: {
    titolo: "Opere murarie per chi vive all'estero",
    testo:
      "Chi ristruttura da lontano passa per il sopralluogo e poi decide dal suo paese: deve capire dal preventivo quali muri si buttano giù e cosa resta fuori. Gli può arrivare in inglese, tedesco, francese, spagnolo o olandese, con tramezzo e rasatura resi in modo che non cambino senso e l'italiano che fa fede. Tu lo leggi e lo controlli in italiano.",
  },
  domande: {
    titolo: "Domande dai muratori",
    voci: [
      {
        d: "Posso raccontare il lavoro in rumeno o in albanese?",
        r: "Sì. Racconti nella lingua in cui ti viene più facile, e la bozza esce in italiano, con le voci del tuo listino. La controlli prima che parta, come sempre.",
      },
      {
        d: "Il tramezzo l'ho misurato a passi. Va bene lo stesso?",
        r: "Va bene. Dici «tre e sessanta per due e settanta» o «una quarantina di metri», e il sistema rifà il conto nell'unità della tua voce. Prima di approvare vedi ogni riga e correggi quello che non torna.",
      },
      {
        d: "Apro le tracce per l'elettricista ma me le paga il cliente. Come le scrivo?",
        r: "Come voci tue, a metro, e nel racconto dici per quale impianto sono. Se invece la chiusura la fa un altro, dillo: finisce fra le esclusioni e non la trovi nel totale.",
      },
      {
        d: "La pratica in Comune la fa il geometra del cliente. Devo nominarla?",
        r: "Conviene. «Pratica edilizia esclusa» evita che il cliente pensi sia compresa nel tuo prezzo. La frase finisce sotto le voci, scritta in chiaro.",
      },
      {
        d: "Non so quanta rasatura ci sarà finché non tolgo la carta da parati. Cosa metto?",
        r: "Non metti un numero a caso. La riga resta senza quantità e ti arriva la domanda; quando lo sai rispondi e il totale si aggiorna. Se vuoi che il cliente legga che quello che si scopre dopo si conta con il prezzo della voce, scrivilo nell'avviso in fondo al preventivo.",
      },
      {
        d: "A fine lavoro il cliente dice «questo non c'era». Come mi tutelo?",
        r: "Il cliente accetta il preventivo online, e restano nome, data, ora e una copia del PDF che ha accettato, con le esclusioni scritte sotto le voci. Vedi anche quando l'ha aperto e quando l'ha accettato.",
      },
      {
        d: "Quarto piano senza ascensore: dove metto il costo di portare giù le macerie?",
        r: "Se ce l'hai a listino come voce a parte, di' la quantità nel racconto, «tre metri cubi da portare giù a mano», e la riga esce con il suo prezzo. Se lo tieni dentro il prezzo della demolizione, scrivilo nel nome della voce, così il cliente sa che è compreso.",
      },
    ],
  },
};
