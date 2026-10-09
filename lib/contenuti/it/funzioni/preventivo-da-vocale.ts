import type { PaginaFunzione } from "../../tipi";

export const preventivoDaVocale: PaginaFunzione = {
  meta: {
    titolo: "Preventivo da vocale: racconti, e la bozza c'è",
    descrizione:
      "Preventivo da vocale: racconti il sopralluogo a voce o per iscritto, anche nella tua lingua. Torna la bozza col tuo listino e le domande su ciò che manca.",
  },
  nome: "Preventivo da vocale",
  riga: "Racconti il sopralluogo come a un collega: voci, misure, domande ed esclusioni le mette in fila il sistema.",
  h1: "Preventivo da vocale: lo racconti, e la bozza la scrive il sistema",
  sottotitolo:
    "Finito il sopralluogo parli al telefono o scrivi due righe, come faresti con un collega. Il sistema separa le lavorazioni, rifà i conti delle misure, prende i prezzi dal tuo listino e ti chiede quello che non hai detto. Tu controlli e approvi.",
  sezioni: [
    {
      titolo: "Come racconti il sopralluogo",
      paragrafi: [
        "Apri la pagina del nuovo preventivo dal telefono, senza installare niente. Hai due strade: premi il microfono e detti, oppure scrivi. Quando detti, la voce la trasforma in testo il riconoscimento vocale del telefono: a noi arriva solo il testo, mai l'audio. Puoi rileggerlo e sistemarlo prima di preparare la bozza.",
        "Puoi raccontare anche nella tua lingua. A voce scegli fra italiano, rumeno, albanese, arabo, ucraino, russo, spagnolo, francese e inglese, se il tuo telefono riconosce quella lingua; se non la riconosce, te lo dice e la scrivi. Per iscritto va bene qualunque lingua, anche mescolata con l'italiano. La bozza esce sempre in italiano, e le misure dette in un'altra lingua valgono come quelle dette in italiano.",
        "Un esempio di racconto, inventato: «Bagno della signora Conti, ci abita lei. Tolgo il rivestimento fino a due metri e il piatto doccia vecchio. Il bagno è due per uno e ottanta. Metto un piatto doccia ottanta per ottanta, i sanitari li compra lei, io li monto. L'elettricista lo chiama lei.» Non serve altro.",
      ],
    },
    {
      titolo: "Cosa succede dopo il racconto",
      paragrafi: [
        "In pochi secondi ti torna una bozza da controllare. Dentro trovi le cose che hai detto, messe in ordine come in un preventivo, e un segno su tutto quello che non torna.",
      ],
      punti: [
        {
          titolo: "Una riga per ogni lavorazione",
          testo:
            "«Tolgo il lavandino vecchio e monto quello nuovo» diventa due righe, rimozione e posa. «Lo cambio» detto con una parola sola resta una riga. «Smonto e porto via» resta una riga sola: lo smaltimento di quello che togli fa parte della rimozione. Se dici «sei prese» e poi le elenchi stanza per stanza, resta una riga da sei.",
        },
        {
          titolo: "Le misure rifatte",
          testo:
            "Se dici le misure, il conto lo fa il sistema, e non a occhio: «due per uno e ottanta» diventa **3,6 m²**. Se la voce del tuo listino si misura in un altro modo (al metro, al pezzo, al m² di porta) e le misure ci sono, la quantità viene rifatta in quell'unità. Due righe con la stessa voce si sommano, e un doppione si toglie.",
        },
        {
          titolo: "Le domande su quello che manca",
          testo:
            "Se una quantità non l'hai detta, la riga resta vuota e ti arriva una domanda secca: «Quanti m² di rivestimento?». Se hai detto un numero senza unità, ti chiede l'unità. Per l'IVA servono tre risposte: se è un'abitazione, che tipo di intervento è, chi compra i materiali. Se dal racconto non si capiscono, te le chiede.",
        },
        {
          titolo: "Le voci da prezzare",
          testo:
            "Una lavorazione che nel tuo listino non c'è, o che il sistema non è sicuro di aver riconosciuto, resta da prezzare ed è evidenziata, con il motivo scritto accanto. Puoi scegliere tu la voce giusta dal listino o scrivere il prezzo a mano: finché non decidi, il prezzo resta vuoto.",
        },
        {
          titolo: "Esclusioni, note e materiale del cliente",
          testo:
            "Quello che escludi («l'elettricista lo chiama lei») finisce fra le esclusioni, scritte in chiaro sotto le voci del preventivo. Quello che rimandi («lo vediamo dopo») va nelle note, che restano a te e non vanno sul PDF. Se il materiale lo compra il cliente, la riga diventa solo posa o montaggio.",
        },
      ],
    },
    {
      titolo: "Come raccontare bene: qualche consiglio pratico",
      paragrafi: [
        "Il sistema capisce il parlato di cantiere, le misure a spanne e i ripensamenti. Ma qualche abitudine ti fa trovare una bozza più completa e meno domande da chiudere.",
      ],
      punti: [
        {
          titolo: "Comincia da chi e dove",
          testo:
            "Nome del cliente, indirizzo del lavoro e se ci abita. Sono tre informazioni che ti risparmiano una domanda sull'IVA e un campo da riempire a mano.",
        },
        {
          titolo: "Una stanza alla volta",
          testo:
            "Finisci il bagno, poi passa alla cucina. Saltare avanti e indietro funziona lo stesso, ma è più facile che una misura finisca attaccata alla stanza sbagliata.",
        },
        {
          titolo: "Di' le misure, non solo i totali",
          testo:
            "«Tre e venti per due e settanta» è meglio di «una decina di metri». Se la misura è a occhio dillo pure, «più o meno»: viene usata e segnata come approssimata.",
        },
        {
          titolo: "Di' chi compra i materiali",
          testo:
            "«Il gres l'ha preso lei», «i sanitari li compro io». Cambia la riga (fornitura e posa o solo posa) e cambia l'IVA.",
        },
        {
          titolo: "Di' anche cosa non fai",
          testo:
            "Le tracce che chiude il muratore, l'antenna, il trasporto dei mobili. Detto nel racconto, finisce fra le esclusioni e il cliente lo legge prima di accettare.",
        },
        {
          titolo: "Correggiti pure",
          testo:
            "«Tre prese in camera, anzi quattro» vale quattro. La correzione sostituisce solo la cosa che contraddice: le altre righe dette prima restano.",
        },
      ],
    },
    {
      titolo: "Perché il sistema non indovina mai",
      paragrafi: [
        "Il preventivo porta il tuo nome. Un numero sbagliato al ribasso è un lavoro in perdita, uno al rialzo è un cliente perso. Per questo le regole sono strette, e valgono su ogni riga.",
        "**Le quantità non si stimano.** Se una misura non è detta né ricavabile da quello che hai detto, la riga resta senza quantità e diventa una domanda. Anche un numero detto in un'unità diversa da quella della voce non si converte a occhio: si chiede.",
        "**I prezzi non si inventano.** Un prezzo può arrivare solo da una voce del tuo listino. Se nessuna voce descrive davvero quella lavorazione, o se l'abbinamento è incerto, la riga resta da prezzare. Una voce simile ma più ricca (acqua calda e fredda quando hai detto solo la fredda) non va bene.",
        "**Nel dubbio, una riga in più.** Se non è chiaro se una correzione cancella una lavorazione detta prima, la riga resta e il dubbio finisce nelle note: una riga in più la togli in un attimo, una riga persa non la vedi.",
        "**Vedi sempre da dove viene ogni riga.** Accanto a ogni voce della bozza trovi le parole che hai detto tu, «Hai detto: …», così capisci subito se la voce scelta è quella giusta. Puoi cambiarla, togliere la riga o aggiungerne una.",
        "Finché manca una quantità, un prezzo o una risposta sull'IVA, il preventivo non si approva: il sistema ti dice cosa manca e su quale riga. E niente arriva al cliente senza la tua approvazione.",
      ],
    },
    {
      titolo: "E dopo la bozza",
      paragrafi: [
        "Controllata la bozza, la approvi: esce il PDF con il tuo logo e un link che mandi al cliente, anche su WhatsApp con il messaggio già pronto. Lui lo apre e lo accetta dal telefono: come funziona lo trovi in [accettazione online](/funzioni/accettazione-online). Se il cliente non parla italiano, il preventivo può partire nella [sua lingua](/funzioni/preventivo-in-lingua-del-cliente).",
        "Se vuoi vedere come cambia il racconto da un mestiere all'altro, guarda gli esempi per [elettricista](/preventivo-elettricista) e per [idraulico](/preventivo-idraulico).",
      ],
    },
  ],
  domande: {
    titolo: "Domande sul preventivo da vocale",
    voci: [
      {
        d: "Devo parlare in un modo particolare perché capisca?",
        r: "No. Parla come parleresti a un collega, con le parole che usi tu. Aiuta se nel tuo listino, accanto alle voci, scrivi come le chiami a voce: il sistema cerca anche quelle parole.",
      },
      {
        d: "Se mi correggo mentre parlo, cosa resta?",
        r: "Resta la versione finale di quello che hai corretto. Se dici «tre prese, anzi quattro», la riga è da quattro. Le altre lavorazioni dette prima restano dove sono.",
      },
      {
        d: "Posso raccontare in rumeno o in arabo?",
        r: "Sì. A voce dipende dal telefono: se riconosce la tua lingua detti, altrimenti scrivi. Per iscritto va bene qualunque lingua, anche mescolata con l'italiano. La bozza esce sempre in italiano.",
      },
      {
        d: "Il cliente vede il mio racconto?",
        r: "No. Il cliente vede il preventivo: le voci, le quantità, i prezzi e le esclusioni. Il racconto e le note del sopralluogo restano a te.",
      },
      {
        d: "Cosa succede se nomino un lavoro che non faccio io?",
        r: "Se dici che lo fa un altro, o che non lo tocchi, non diventa una riga: finisce fra le esclusioni o nelle note. Se invece lo fai tu ma non ce l'hai a listino («quello va a parte»), diventa una riga da prezzare.",
      },
      {
        d: "Ho detto una misura sbagliata. Devo rifare tutto?",
        r: "No. Nella bozza correggi la quantità di quella riga e il totale si aggiorna. Il racconto non va rifatto.",
      },
    ],
  },
};
