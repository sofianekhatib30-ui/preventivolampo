import type { PaginaGuida } from "../../tipi";

export const preventivoACorpoOAMisura: PaginaGuida = {
  meta: {
    titolo: "Preventivo a corpo o a misura: le differenze",
    descrizione:
      "Preventivo a corpo o a misura: cosa dice il codice civile, chi rischia sulle quantità, come gestire varianti e misure finali, con esempi per mestiere.",
  },
  nome: "A corpo o a misura",
  riga: "Prezzo fisso o prezzi unitari: chi si prende il rischio delle quantità e come si gestiscono le varianti.",
  h1: "Preventivo a corpo o a misura: quale scegliere e come scriverlo",
  intro:
    "«Facciamo a corpo» e «facciamo a misura» sono due frasi che ogni artigiano dice e sente dire, spesso senza che le due parti intendano la stessa cosa. Eppure la scelta decide chi paga se i metri quadri sono più del previsto, come si calcola una variante e quanto si discute a fine lavoro. Questa guida spiega la differenza in pratica, cosa dice il codice civile, quando conviene l'una o l'altra formula e come si chiude il conto, con esempi per i mestieri della casa.",
  inBreve: [
    "A corpo il prezzo è uno solo per il lavoro descritto: il rischio di aver misurato male è tuo.",
    "A misura paghi i prezzi unitari sulle quantità eseguite davvero: il totale si conosce solo alla fine.",
    "Anche a corpo conviene scrivere i prezzi unitari: servono per le varianti e per i lavori in meno.",
    "Le varianti vanno autorizzate per iscritto, e a corpo non danno diritto a un compenso in più se non lo hai pattuito.",
  ],
  sezioni: [
    {
      titolo: "Le due formule, in parole semplici",
      paragrafi: [
        "**A corpo** vuol dire che il prezzo si riferisce al lavoro nel suo insieme, così come è descritto nel preventivo. «Tinteggiatura di tutto l'appartamento, pareti e soffitti, due mani di idropittura» a un prezzo unico. Se poi le pareti sono qualche metro più del previsto, il prezzo non cambia.",
        "**A misura** vuol dire che il preventivo fissa i prezzi unitari (al metro quadro, al metro, al pezzo) e il totale si ottiene moltiplicandoli per le quantità effettivamente eseguite, misurate a fine lavoro o per stati di avanzamento. Le quantità del preventivo sono una stima; il conto vero è quello finale.",
        "Il codice civile non usa queste due parole quando parla di appalto, ma conosce bene la situazione: parla di prezzo «determinato globalmente» per l'intera opera (artt. 1659 e 1661), che è il caso del lavoro a corpo. Le definizioni più nette arrivano dagli appalti pubblici, dove la giurisprudenza descrive il prezzo a corpo come una somma fissa e invariabile rispetto alle quantità, e quello a misura come un prezzo per unità che segue la quantità effettiva dei lavori. Nei lavori privati il linguaggio è lo stesso, ma conta quello che scrivi.",
      ],
    },
    {
      titolo: "Chi si prende il rischio delle quantità",
      paragrafi: [
        "La vera differenza fra le due formule è chi paga gli errori di stima. A corpo il rischio è tuo: se hai calcolato male i metri, se la parete da rasare era messa peggio di come sembrava, il prezzo resta quello. A misura il rischio è del cliente: se le quantità crescono, cresce il conto, e lui lo sa fin dall'inizio.",
        "Il codice civile mette un limite agli eventi davvero imprevedibili. Se per circostanze che nessuno poteva prevedere il costo dei materiali o della manodopera aumenta o diminuisce di oltre un decimo del prezzo complessivo, ciascuna parte può chiedere la revisione, ma solo per la parte che supera quel decimo. E se durante il lavoro emergono difficoltà dovute a cause geologiche, idriche e simili, non previste, che rendono il lavoro molto più oneroso, l'appaltatore ha diritto a un equo compenso (art. 1664).",
        "Queste regole valgono anche quando il prezzo è a corpo, a meno che le parti vi abbiano rinunciato in modo chiaro. La Cassazione ha ritenuto che la norma si possa derogare e che sia valida la clausola «a forfait» con cui l'appaltatore si prende anche il rischio delle difficoltà impreviste. Se un committente ti fa firmare un contratto con una clausola del genere, sappi che stai rinunciando a questa tutela.",
      ],
    },
    {
      titolo: "Quando conviene lavorare a corpo",
      paragrafi: [
        "Il prezzo a corpo funziona quando il lavoro è definito e lo puoi misurare per intero prima di cominciare. Al cliente piace perché sa subito quanto spende; a te conviene perché, se lavori bene, il margine che recuperi sull'organizzazione resta tuo.",
      ],
      punti: [
        {
          titolo: "Lavori che vedi tutti",
          testo:
            "Tinteggiare un appartamento vuoto, sostituire sei finestre misurate, montare una cucina: quello che c'è da fare è sotto i tuoi occhi e le sorprese sono poche.",
        },
        {
          titolo: "Clienti che vogliono un numero",
          testo:
            "Il privato che confronta tre preventivi capisce meglio un totale chiuso che una lista di prezzi unitari. Il prezzo a corpo, con il dettaglio sotto, è spesso quello che vince.",
        },
        {
          titolo: "Il costo nascosto",
          testo:
            "Un prezzo a corpo onesto contiene un margine per il rischio. Se non lo metti, l'errore di misura lo paghi tu; se lo metti troppo alto, perdi il lavoro. Per questo il sopralluogo e le misure prese bene valgono più di ogni sconto.",
        },
      ],
    },
    {
      titolo: "Quando conviene lavorare a misura",
      paragrafi: [
        "La misura è la formula giusta quando le quantità non si possono conoscere prima. Chiedere un prezzo chiuso in quei casi vuol dire costringerti a gonfiarlo o a rischiare di lavorare in perdita.",
      ],
      punti: [
        {
          titolo: "Demolizioni e rimozioni",
          testo:
            "Quanto intonaco viene via, quante macerie escono, cosa c'è sotto il pavimento vecchio: lo sai solo quando hai aperto. Prezzo al metro quadro o al metro cubo, e quantità finali misurate insieme.",
        },
        {
          titolo: "Ripristini e rappezzi",
          testo:
            "Rasature, riprese di intonaco, ripristini dopo le tracce: la superficie da sistemare la scopri durante il lavoro.",
        },
        {
          titolo: "Lavori lunghi a stati di avanzamento",
          testo:
            "Nei cantieri che durano settimane, misurare per partite e farsi pagare in proporzione a quanto è stato fatto è previsto anche dal codice civile per le opere eseguite per partite (art. 1666).",
        },
      ],
    },
    {
      titolo: "Le varianti: cosa dice il codice civile",
      paragrafi: [
        "Le varianti sono il punto in cui le due formule si separano davvero. Il codice civile parte da una regola che vale sempre: non puoi cambiare le modalità del lavoro se il cliente non le ha autorizzate, e **l'autorizzazione si prova per iscritto** (art. 1659).",
        "Poi aggiunge una regola che riguarda proprio il lavoro a corpo: anche quando le modifiche sono state autorizzate, se il prezzo dell'intera opera è stato determinato globalmente non hai diritto a un compenso per le variazioni o le aggiunte, salvo diversa pattuizione (art. 1659). Tradotto: se lavori a corpo e il cliente ti chiede una cosa in più, il prezzo della cosa in più va scritto e accettato, altrimenti rischi di farla gratis.",
        "Diverso è il caso delle modifiche chieste dal cliente nei limiti di legge. Il committente può introdurre variazioni purché il loro ammontare non superi un sesto del prezzo complessivo convenuto, e tu hai diritto al compenso per i lavori in più **anche se il prezzo era stato fissato globalmente** (art. 1661). Questo non vale se le variazioni, pur restando sotto il sesto, cambiano in modo notevole la natura dell'opera o le quantità delle singole categorie di lavori.",
        "Ci sono infine le variazioni necessarie per fare il lavoro a regola d'arte. Se non vi mettete d'accordo, le stabilisce il giudice insieme al nuovo prezzo; se superano un sesto del prezzo complessivo puoi recedere dal contratto e ottenere, secondo le circostanze, un'equa indennità, e se sono di notevole entità può recedere anche il cliente, pagandoti un equo indennizzo (art. 1660).",
        "La conseguenza pratica è una sola: **anche nel preventivo a corpo scrivi i prezzi unitari delle voci principali**. Ti servono per prezzare in un minuto la presa in più o il metro di battiscopa in meno, e il cliente li ha già visti e accettati.",
      ],
    },
    {
      titolo: "Le misure finali: come chiudere il conto senza liti",
      paragrafi: [
        "Nel lavoro a misura il momento delicato è la misurazione finale. Conviene decidere prima, e scriverlo, come si misura: le superfici si misurano a vuoto per pieno o si tolgono porte e finestre? Il battiscopa si conta sui metri di parete o sui pezzi montati? Gli sfridi delle piastrelle sono compresi nel prezzo al metro quadro? Sono scelte libere, ma vanno fatte prima, perché a lavoro finito ognuno ricorderà la versione che gli conviene.",
        "Le misure finali si prendono insieme al cliente, o a chi lo rappresenta, e si scrivono su un foglio firmato da entrambi. Per i lavori lunghi lo stesso vale per ogni stato di avanzamento. Il codice civile prevede che, per le opere da eseguire per partite, ciascuno possa chiedere la verifica delle singole partite, e che il pagamento faccia presumere l'accettazione della parte pagata; non producono questo effetto i semplici acconti (art. 1666).",
        "Nel preventivo puoi usare anche una formula mista, molto diffusa: un totale a corpo per la parte certa e prezzi a misura per la parte che non si può prevedere, per esempio «demolizioni e ripristini a misura secondo i prezzi unitari indicati». È spesso la soluzione più onesta per entrambi.",
      ],
    },
    {
      titolo: "Esempi per mestiere",
      paragrafi: [
        "Le abitudini cambiano da un mestiere all'altro. Questi sono gli usi più comuni nei lavori di casa, con le unità che ritrovi anche nelle pagine dedicate, per esempio quella del [preventivo da imbianchino](/preventivo-imbianchino) o del [preventivo da muratore](/preventivo-muratore).",
      ],
      punti: [
        {
          titolo: "Imbianchino",
          testo:
            "Spesso a corpo per stanza o per appartamento, con il metro quadro di pareti e soffitti come prezzo unitario di riserva. Rasature e trattamenti antimuffa meglio a misura, perché la superficie da trattare si vede solo a lavoro iniziato.",
        },
        {
          titolo: "Piastrellista",
          testo:
            "Posa al metro quadro, battiscopa e profili al metro lineare, tagli speciali e gradini al pezzo. Va scritto se gli sfridi sono compresi e chi fornisce colla e fughe.",
        },
        {
          titolo: "Elettricista",
          testo:
            "Il lavoro «a punto» è di fatto un lavoro a misura: ogni punto luce o presa ha il suo prezzo e il totale segue il numero di punti realizzati. Il quadro e la dichiarazione di conformità spesso a corpo.",
        },
        {
          titolo: "Idraulico",
          testo:
            "Il rifacimento di un bagno è spesso a corpo, con l'elenco dei punti acqua e degli scarichi; tubazioni lunghe e ricerche di perdite a misura o a ore.",
        },
        {
          titolo: "Muratore e impresa edile",
          testo:
            "Demolizioni e rimozioni a metro quadro o cubo, tramezzi e intonaci al metro quadro, tracce al metro: è il campo dove la misura è più frequente. Per una ristrutturazione completa il cliente chiede quasi sempre un prezzo complessivo, e la formula mista è quella che regge meglio.",
        },
        {
          titolo: "Cartongessista e serramentista",
          testo:
            "Pareti e controsoffitti al metro quadro, con le aperture e le velette conteggiate a parte. Infissi al pezzo, con misure e modello indicati, e posa a corpo per ogni apertura.",
        },
      ],
    },
  ],
  domande: {
    titolo: "Domande su a corpo e a misura",
    voci: [
      {
        d: "Nel preventivo a corpo devo comunque scrivere le quantità?",
        r: "Conviene sempre. Le quantità e i prezzi unitari sotto il totale fanno capire al cliente cosa compra e ti permettono di calcolare in fretta varianti e lavori in meno. Puoi scrivere che il prezzo è a corpo e che il dettaglio serve solo per le variazioni.",
      },
      {
        d: "Se a corpo i metri sono più del previsto, posso chiedere di più?",
        r: "Di regola no: nel lavoro a corpo il rischio delle quantità è tuo. Restano le tutele del codice civile per gli eventi imprevedibili, come l'aumento dei costi oltre un decimo del prezzo o le difficoltà geologiche e idriche non previste (art. 1664), salvo che vi abbiate rinunciato.",
      },
      {
        d: "Il cliente mi chiede un lavoro in più, ma il prezzo era a corpo. Come faccio?",
        r: "Scrivi la variante con il suo prezzo e fattela approvare prima di eseguirla. Il codice civile chiede la prova scritta dell'autorizzazione e, se il prezzo era globale, ti dà diritto a un compenso per le aggiunte solo se è stato pattuito (art. 1659).",
      },
      {
        d: "A misura, chi misura alla fine?",
        r: "Lo decidete voi, ma la soluzione più sicura è misurare insieme e firmare un foglio con le quantità. Scrivi nel preventivo anche i criteri: come si trattano porte e finestre, se gli sfridi sono compresi, come si conta il battiscopa.",
      },
      {
        d: "Posso mettere voci a corpo e voci a misura nello stesso preventivo?",
        r: "Sì, ed è spesso la scelta migliore: a corpo la parte che puoi misurare prima, a misura quella che scopri solo lavorando, come demolizioni e ripristini. Basta scrivere con chiarezza quale regola vale per ogni voce.",
      },
      {
        d: "Il preventivo a punto dell'elettricista è a corpo o a misura?",
        r: "È di fatto a misura: c'è un prezzo per ogni punto e il totale segue il numero di punti realizzati. Se il cliente vuole un totale chiuso, puoi darglielo a corpo e tenere il prezzo a punto per le aggiunte.",
      },
    ],
  },
  fonti: [
    { nome: "Codice civile, art. 1657: determinazione del corrispettivo", url: "https://www.brocardi.it/codice-civile/libro-quarto/titolo-iii/capo-vii/art1657.html" },
    { nome: "Codice civile, art. 1659: variazioni concordate del progetto", url: "https://brocardi.it/codice-civile/libro-quarto/titolo-iii/capo-vii/art1659.html" },
    { nome: "Codice civile, art. 1660: variazioni necessarie del progetto", url: "https://brocardi.it/codice-civile/libro-quarto/titolo-iii/capo-vii/art1660.html" },
    { nome: "Codice civile, art. 1661: variazioni ordinate dal committente", url: "https://brocardi.it/codice-civile/libro-quarto/titolo-iii/capo-vii/art1661.html" },
    { nome: "Codice civile, art. 1664: onerosità o difficoltà dell'esecuzione", url: "https://www.brocardi.it/codice-civile/libro-quarto/titolo-iii/capo-vii/art1664.html" },
    { nome: "Codice civile, art. 1666: verifica e pagamento di singole partite", url: "https://brocardi.it/codice-civile/libro-quarto/titolo-iii/capo-vii/art1666.html" },
  ],
  avvertenza:
    "Questa guida spiega come si usano in pratica le due formule e cosa dice il codice civile, ma non è un parere legale. Le clausole su prezzo, varianti e revisione si possono scrivere in molti modi: per un contratto importante fatti aiutare da un legale o dalla tua associazione di categoria.",
};
