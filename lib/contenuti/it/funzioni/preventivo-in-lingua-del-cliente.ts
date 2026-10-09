import type { PaginaFunzione } from "../../tipi";

export const preventivoInLinguaDelCliente: PaginaFunzione = {
  meta: {
    titolo: "Preventivo in inglese o tedesco per il cliente",
    descrizione:
      "Preventivo nella lingua del cliente: inglese, tedesco, francese, spagnolo o olandese. PDF in due lingue in cui fa fede l'italiano, e recesso tradotto.",
  },
  nome: "Preventivo nella lingua del cliente",
  riga: "Inglese, tedesco, francese, spagnolo e olandese, con il testo italiano accanto che fa fede.",
  h1: "Il preventivo nella lingua del cliente, con l'italiano che fa fede",
  sottotitolo:
    "Tu lavori in italiano come sempre. Il cliente straniero riceve messaggio, pagina e PDF in inglese, tedesco, francese, spagnolo o olandese, con il testo italiano accanto. La traduzione la vedi e la correggi prima di approvare.",
  sezioni: [
    {
      titolo: "A chi serve",
      paragrafi: [
        "Case comprate da stranieri, appartamenti affittati a chi lavora qui da poco, seconde case di famiglie che vivono all'estero. Il cliente capisce le misure e i prezzi, ma una voce come «rasatura» o «massetto» gli dice poco, e un preventivo che non capisce lo firma tardi, o non lo firma.",
        "Con PreventivoLampo il preventivo può partire in cinque lingue oltre all'italiano: **inglese, tedesco, francese, spagnolo e olandese**. La lingua la scegli preventivo per preventivo. Per un cliente che parla un'altra lingua ancora, il preventivo resta in italiano.",
        "Non confonderla con la lingua in cui racconti il sopralluogo: quella può essere anche rumeno, albanese o arabo, e la bozza esce comunque in italiano. Lo spieghiamo nella pagina sul [preventivo da vocale](/funzioni/preventivo-da-vocale).",
      ],
    },
    {
      titolo: "Come si fa, e come lo controlli",
      paragrafi: [
        "Il preventivo nasce in italiano, dal tuo racconto e dal tuo listino. Quando hai sistemato voci, quantità e prezzi, nella bozza scegli la lingua del cliente e premi il pulsante per tradurre. Ogni voce tradotta compare sotto quella italiana, e la puoi correggere a mano, riga per riga. Lo stesso per le esclusioni.",
      ],
      punti: [
        {
          titolo: "Si traducono solo le parole",
          testo:
            "Passano dalla traduzione i nomi delle voci e le esclusioni. Numeri, quantità, prezzi e aliquote non si toccano: vengono dai dati del preventivo. Misure e formati (80x80, Ø 16), sigle e marche restano identici.",
        },
        {
          titolo: "Le parole del mestiere hanno una resa fissa",
          testo:
            "Massetto, tramezzo, battiscopa, rasatura, idropittura, punto luce, a corpo, fornitura e posa, solo posa: per i termini che tradotti male cambiano il senso la traduzione è stabilita in partenza, lingua per lingua. Un tramezzo resta una parete divisoria non portante anche in tedesco.",
        },
        {
          titolo: "Se cambi una voce, la traduzione si rifà",
          testo:
            "Se dopo aver tradotto modifichi, aggiungi o togli una voce, il sistema se ne accorge e ti chiede di rifare la traduzione. Finché non è allineata, il preventivo non si approva: il cliente legge sempre le stesse cose che hai approvato tu.",
        },
        {
          titolo: "Guardi quello che vedrà lui",
          testo:
            "Dopo l'approvazione puoi aprire la pagina esattamente come la vede il cliente, nella sua lingua, e il PDF bilingue.",
        },
      ],
    },
    {
      titolo: "Il PDF in due lingue",
      paragrafi: [
        "Il PDF resta un preventivo italiano, con l'italiano sempre in primo piano. Sotto ogni voce c'è la traduzione, in corsivo grigio. Le intestazioni delle colonne, l'imponibile, l'IVA, il totale, le esclusioni e le condizioni hanno la loro riga nella lingua del cliente. Le date sono scritte come le legge lui.",
        "L'IVA resta quella italiana, e il PDF spiega al cliente quale aliquota si applica e perché. Se ci sono beni significativi, il termine resta in italiano, «beni significativi», con una spiegazione nella sua lingua: è una parola della norma italiana, e tradurla la renderebbe più vaga.",
        "In fondo c'è la clausola di prevalenza, scritta nelle due lingue: il preventivo è redatto in italiano e nella lingua del cliente, e in caso di discordanza prevale il testo italiano. Il Codice del Consumo chiede che le informazioni al consumatore siano date almeno in lingua italiana (art. 9), e nei contratti a distanza il cliente può chiederle in italiano (art. 49, comma 7): la versione tradotta è un aiuto per lui, quella che conta resta l'italiana.",
      ],
    },
    {
      titolo: "Il messaggio, la pagina di accettazione e il recesso nella sua lingua",
      paragrafi: [
        "Quando mandi il preventivo su WhatsApp, il messaggio è già scritto nella lingua del cliente, con il numero del preventivo, il totale e il link.",
        "La pagina che apre è nella sua lingua: totale, dettaglio delle voci, esclusioni, il pulsante per accettare e la frase che spunta prima di farlo. Sotto ogni voce tradotta c'è la voce italiana, e in alto può passare alla versione italiana con un tocco. Come funziona l'accettazione lo trovi in [accettazione online](/funzioni/accettazione-online).",
        "Anche le informazioni sul diritto di recesso e il modulo tipo sono nella sua lingua, sulla pagina e nel PDF, dove la pagina del recesso c'è in italiano e nella lingua del cliente. Questi testi non sono una nostra traduzione: per ogni lingua partono dalla versione ufficiale del modulo previsto dalla direttiva 2011/83/UE, che esiste in tutte le lingue dell'Unione. Cosa cambia, e cosa no, quando il cliente è straniero lo trovi nella guida al [preventivo per il cliente straniero](/guide/preventivo-cliente-straniero).",
      ],
    },
    {
      titolo: "Cosa resta in italiano, e perché",
      paragrafi: [
        "Alcune cose restano in italiano di proposito. Conviene saperlo prima di mandare il preventivo.",
      ],
      punti: [
        {
          titolo: "Il testo italiano del preventivo",
          testo: "C'è sempre, sopra la traduzione, ed è quello che fa fede. È anche quello che controlli tu.",
        },
        {
          titolo: "Le condizioni di pagamento e l'avviso che scrivi tu",
          testo:
            "Le condizioni di pagamento e l'eventuale avviso in fondo al preventivo li scrivi nei dati dell'impresa, e non passano dalla traduzione. Tienili brevi e chiari, con le cifre in numeri: un acconto in percentuale si capisce in qualunque lingua.",
        },
        {
          titolo: "Il tuo lavoro",
          testo:
            "La bozza, il racconto del sopralluogo, le note e il tuo listino restano in italiano. Il cliente non li vede.",
        },
        {
          titolo: "Nomi e indirizzi",
          testo: "Il nome del cliente, l'indirizzo del lavoro e i dati della tua impresa si scrivono come sono.",
        },
      ],
    },
  ],
  domande: {
    titolo: "Domande sul preventivo in un'altra lingua",
    voci: [
      {
        d: "Devo sapere l'inglese per mandare un preventivo in inglese?",
        r: "No. Lo prepari e lo controlli in italiano. La traduzione la fa il sistema, e se una voce tradotta non ti convince la correggi o ti fai aiutare da chi conosce la lingua, prima di approvare.",
      },
      {
        d: "Il cliente parla portoghese. Posso mandarglielo nella sua lingua?",
        r: "Per ora no: le lingue per il cliente sono inglese, tedesco, francese, spagnolo e olandese. Negli altri casi il preventivo parte in italiano, oppure in inglese se il cliente lo legge.",
      },
      {
        d: "Se c'è una contestazione, quale testo vale?",
        r: "Quello italiano. La clausola è scritta nel PDF in tutte e due le lingue, e la ripete la frase che il cliente spunta per accettare.",
      },
      {
        d: "Il cliente vede anche l'italiano?",
        r: "Sì. Nel PDF l'italiano viene prima della traduzione, sulla pagina ogni voce tradotta ha sotto quella italiana, e con un tocco passa alla versione tutta in italiano.",
      },
      {
        d: "Ho tradotto e poi ho cambiato una quantità. Devo rifare la traduzione?",
        r: "No: le quantità e i prezzi non si traducono, quindi la traduzione resta valida. Va rifatta solo se cambi il testo di una voce o di un'esclusione, o se ne aggiungi o ne togli una. Il sistema te lo segnala.",
      },
      {
        d: "Il prezzo cambia se il preventivo è in un'altra lingua?",
        r: "No. Prezzi, IVA e totale sono gli stessi del preventivo italiano: cambia solo la lingua in cui il cliente li legge.",
      },
    ],
  },
};
