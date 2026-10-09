import type { PaginaFunzione } from "../../tipi";

export const accettazioneOnline: PaginaFunzione = {
  meta: {
    titolo: "Preventivo accettato online, con nome e ora",
    descrizione:
      "Accettazione online del preventivo: il cliente apre il link, legge il PDF e accetta con nome e cognome. A te restano data, ora e copia del PDF accettato.",
  },
  nome: "Accettazione online",
  riga: "Il cliente accetta dal link, senza registrarsi. Tu vedi quando lo apre e quando risponde.",
  h1: "Accettazione online: il cliente dice sì dal link, e la prova resta a te",
  sottotitolo:
    "Approvi il preventivo, mandi il link, il cliente lo apre dal telefono e lo accetta con nome e cognome. Tu vedi quando l'ha aperto e quando ha risposto, e tieni nome, data, ora e il PDF che ha accettato.",
  sezioni: [
    {
      titolo: "Dal tuo ok al link per il cliente",
      paragrafi: [
        "Quando la bozza è a posto la approvi, spuntando che hai controllato prezzi e quantità. In quel momento nascono il PDF con il tuo logo e il link per il cliente. Da lì il preventivo non si modifica più e non si cancella: il cliente deve poter accettare esattamente quello che hai approvato. Se qualcosa cambia, prepari un preventivo nuovo.",
        "Per mandarlo hai due pulsanti. **Invia su WhatsApp** apre la chat con il messaggio già scritto: saluto, numero del preventivo, totale IVA inclusa e link. **Copia il link** serve per l'email, un SMS o qualunque altro canale.",
      ],
    },
    {
      titolo: "Cosa vede il cliente",
      paragrafi: [
        "Il cliente apre una pagina che è della tua impresa, non nostra: in alto il tuo nome con la partita IVA, e il logo se l'hai caricato. Non deve registrarsi né installare niente, e la pagina si apre dal telefono come dal computer.",
      ],
      punti: [
        {
          titolo: "Il totale, subito",
          testo:
            "In cima legge il totale IVA inclusa, con imponibile e IVA separati e la data fino a cui il preventivo è valido. Sotto, le prime lavorazioni e il dettaglio di tutte le voci, con quantità e prezzo.",
        },
        {
          titolo: "Le esclusioni e il PDF completo",
          testo:
            "Le cose che non sono comprese sono scritte in chiaro prima del pulsante per accettare. Il PDF completo si scarica con un tocco.",
        },
        {
          titolo: "Il recesso",
          testo: "Le informazioni sul diritto di recesso e il modulo tipo sono sulla pagina, da aprire se gli servono.",
        },
        {
          titolo: "La risposta",
          testo:
            "Per accettare scrive nome e cognome, spunta «Ho letto il preventivo e lo accetto alle condizioni indicate» e preme il pulsante. Può anche rispondere che non lo accetta: lo vedi lo stesso, con il suo nome.",
        },
      ],
    },
    {
      titolo: "Inviato, visto, accettato: sai sempre a che punto è",
      paragrafi: [
        "Nell'elenco dei tuoi preventivi ognuno ha il suo stato: da controllare, inviato, accettato o rifiutato. Dentro il preventivo vedi tre passi con data e ora: approvato da te, visto dal cliente, risposta del cliente.",
        "«Visto» si segna la prima volta che il cliente apre davvero la pagina. L'anteprima che WhatsApp mostra sotto il link non conta: lì il cliente ha visto solo il titolo, non il preventivo. Per vedere se l'ha aperto ricarichi la pagina del preventivo.",
        "Il preventivo vale per i giorni che hai deciso tu nei dati dell'impresa. Passata la scadenza il cliente lo può ancora leggere, ma dal link non lo può più accettare: se vuole procedere, gli mandi un preventivo nuovo, magari con i prezzi aggiornati.",
      ],
    },
    {
      titolo: "Cosa ti resta in mano",
      paragrafi: [
        "Quando il cliente risponde, nel registro del preventivo restano il nome che ha scritto, la data e l'ora, l'indirizzo IP da cui ha risposto e l'impronta del PDF che aveva davanti: un codice che identifica quel documento. Il PDF che riapri dalla tua area porta in fondo un riquadro con scritto «Accettato online da», il nome, la data e l'ora.",
        "Diciamolo chiaro: **non è una firma digitale**, e nemmeno una firma elettronica qualificata. Lo dice anche la pagina al cliente, prima che accetti. È un'accettazione con nome, data e ora su un documento che non può più cambiare, ed è molto più di quello che ti resta oggi con un messaggio.",
      ],
    },
    {
      titolo: "Il modulo di recesso",
      paragrafi: [
        "Se il cliente è un consumatore e accetta a distanza, dal link, o dopo un sopralluogo fatto a casa sua, di regola può recedere senza dare spiegazioni. Il termine è di 14 giorni: per i soli lavori parte dall'accettazione, ma se nel preventivo ci sono anche materiali che fornisci tu, parte dal giorno in cui il cliente li riceve. Diventa di 30 giorni se il contratto nasce da una tua visita che il cliente non aveva chiesto. Le informazioni sul recesso e il modulo tipo sono già pronti: sulla pagina del cliente e nell'ultima pagina del PDF, con i tuoi recapiti e il numero del preventivo. Se il cliente è straniero, li trova anche nella [sua lingua](/funzioni/preventivo-in-lingua-del-cliente).",
        "Se il cliente vuole che cominci prima che il termine sia passato, fattelo chiedere per iscritto, su carta o per email, insieme alla presa d'atto che a lavori finiti non potrà più recedere. La pagina di accettazione questa richiesta non la raccoglie. Con la richiesta, se recede dopo l'inizio ti paga la parte di lavoro già fatta; senza, non ti deve niente. Cosa conviene fare in pratica lo spieghiamo nella guida sul [recesso dal preventivo accettato a casa](/guide/recesso-preventivo-accettato-a-casa).",
      ],
    },
    {
      titolo: "Perché è meglio di un «ok» su WhatsApp",
      paragrafi: [
        "Un «ok, procedi» in chat non dice a quale versione del preventivo si riferisce, se il cliente ha letto le esclusioni o se il totale che ha in mente è lo stesso tuo. A fine lavori, quando chiede perché la pittura del soffitto non è compresa, hai in mano una parola e uno screenshot.",
        "Con il link il cliente accetta un documento preciso, che dopo l'approvazione non cambia più, e lo fa dopo aver visto totale, voci ed esclusioni. Tu tieni nome, data, ora e il PDF. E per lui è più semplice di una firma su carta: il preventivo lo legge e lo accetta dal telefono, senza appuntamenti e senza stampare niente.",
      ],
    },
  ],
  domande: {
    titolo: "Domande sull'accettazione online",
    voci: [
      {
        d: "È una firma digitale?",
        r: "No, e non lo diciamo nemmeno al cliente: la pagina scrive che non è una firma elettronica qualificata. È un'accettazione online con nome, data, ora e il PDF accettato, che ti resta come prova.",
      },
      {
        d: "Il cliente deve scaricare un'app o creare un account?",
        r: "No. Apre il link dal telefono o dal computer, legge e risponde. Gli servono solo nome e cognome.",
      },
      {
        d: "Posso cambiare un preventivo che ho già mandato?",
        r: "No: dopo l'approvazione il documento è fermo, perché il cliente deve accettare proprio quello. Se qualcosa cambia, ne prepari uno nuovo e mandi il nuovo link.",
      },
      {
        d: "Quanto tempo ha il cliente per accettare?",
        r: "I giorni di validità li scegli tu nei dati dell'impresa, e il cliente vede la scadenza sulla pagina e sul PDF. Dopo, il link non accetta più risposte.",
      },
      {
        d: "Mi arriva un avviso quando il cliente accetta?",
        r: "Una notifica no: la risposta la vedi nell'elenco dei preventivi e dentro il preventivo, con nome, data e ora. Per sapere se nel frattempo l'ha aperto, ricarichi la pagina.",
      },
      {
        d: "E se il cliente non vuole accettare online?",
        r: "Il PDF si scarica e si stampa come qualunque preventivo, e puoi farglielo firmare su carta. L'accettazione dal link resta lì, se cambia idea.",
      },
    ],
  },
};
