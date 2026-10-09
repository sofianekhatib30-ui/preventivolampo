import type { PaginaMestiere } from "../../tipi";

export const fabbro: PaginaMestiere = {
  meta: {
    titolo: "Preventivo fabbro: ringhiere e cancelli a voce",
    descrizione:
      "Preventivo fabbro dal tuo racconto: ringhiere, cancelli, inferriate e automazioni, a metro o a chilo, coi prezzi del tuo listino. Accettazione online.",
  },
  nome: "Fabbro",
  riga: "Ringhiere, cancelli e automazioni, inferriate, scale in ferro e piccole strutture.",
  h1: "Preventivo fabbro: dici le misure, la bozza esce col tuo listino",
  sottotitolo:
    "Ringhiere, cancelli, inferriate, scale e tettoie in ferro. Finito il sopralluogo racconti misure e lavorazioni come le diresti in officina: la bozza usa solo i prezzi del tuo listino, a metro, a chilo o a pezzo, e ti segnala quello che manca.",
  esempio: {
    titolo: "Dall'officina alla bozza",
    intro:
      "Un cancello carraio da rifare e motorizzare, il pedonale, la recinzione e una ringhiera sul balcone. Accanto vedi il cancello separato dall'automazione, il motore del cliente come solo montaggio, recinzione e ringhiera a metro e la domanda sulle inferriate che i clienti non hanno ancora deciso.",
    lavoro: "Casa con giardino: cancello, recinzione e balcone",
    dettatura:
      "Faccio il punto sui signori Mariani. Il cancello carraio scorrevole lo rifaccio nuovo, luce più o meno quattro e venti, alto un metro e sessanta, zincato e verniciato, da motorizzare con due fotocellule e il lampeggiante. Il motore l'ha già comprato lui su internet, io lo monto e lo collego. Il pedonale di fianco, novanta per uno e sessanta, con la serratura elettrica. Sulla recinzione cambio i pannelli, una quindicina di metri. Sul balcone smonto la ringhiera vecchia e ne metto una nuova a bacchette, tre e venti di lunghezza. Al piano terra vogliono le inferriate alle finestre, su quante non l'hanno ancora deciso. Lo scavo per la guida e il cordolo li fa il muratore, non li metto.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da fabbro",
    intro:
      "Officina, trattamenti, montaggio e automazione: un preventivo da fabbro mescola chili, metri, metri quadri e pezzi, e conviene che ogni cosa stia sulla sua riga. Il prezzo è il tuo e arriva dal tuo listino; una lavorazione fuori serie che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Cancello carraio scorrevole in ferro zincato e verniciato", unita: "m²", nota: "Luce per altezza. Scrivi se guida a terra, cremagliera e fermi sono compresi." },
      { voce: "Cancello carraio a due ante a battente", unita: "m²", nota: "Con cardini e fermo centrale. I pilastri, se non sono tuoi, vanno fra le esclusioni." },
      { voce: "Cancello pedonale", unita: "cad", nota: "Con serratura e maniglia. La serratura elettrica è meglio come riga a parte." },
      { voce: "Automazione cancello scorrevole", unita: "cad", nota: "Motore, centralina, fotocellule e lampeggiante. Dichiara la marca o scrivi «equivalente»." },
      { voce: "Montaggio automazione fornita dal cliente", unita: "cad", nota: "Solo montaggio e collegamento. I documenti del cancello automatico restano tuoi: vedi più sotto." },
      { voce: "Messa in servizio cancello automatico", unita: "corpo", nota: "Regolazioni, prove, targa, dichiarazione e istruzioni. Tenerla separata fa capire al cliente cosa paga." },
      { voce: "Ringhiera a bacchette verticali", unita: "m", nota: "A metro lineare, con il corrimano. Scrivi se il fissaggio è a pavimento o laterale." },
      { voce: "Inferriata fissa", unita: "m²", nota: "Sulla luce della finestra. Se è apribile con serratura, è un'altra voce." },
      { voce: "Grata di sicurezza apribile", unita: "cad", nota: "Con telaio, cerniere e serratura. Il cliente spesso la confonde con l'inferriata fissa." },
      { voce: "Pannelli di recinzione in ferro", unita: "m", nota: "Con i paletti. Lo zoccolo in muratura di solito non è tuo." },
      { voce: "Scala in ferro a rampa dritta", unita: "corpo", nota: "Con gradini in lamiera o predisposta per il legno. Il parapetto scrivilo a parte." },
      { voce: "Struttura in ferro per tettoia", unita: "kg", nota: "La carpenteria si prezza spesso a peso. Dai al cliente anche le misure, il chilo da solo non gli dice niente." },
      { voce: "Zincatura a caldo", unita: "kg", nota: "Se la mandi fuori, scrivi che il tempo di consegna dipende anche dallo zincatore." },
      { voce: "Verniciatura a polvere", unita: "m²", nota: "Con il colore RAL scritto nella riga, non a voce." },
      { voce: "Smontaggio e smaltimento ringhiera esistente", unita: "m", nota: "Il ferro vecchio il cliente lo dimentica. Scrivi se il trasporto è compreso." },
      { voce: "Saldatura e riparazione in opera", unita: "h", nota: "Lavoro a ore, con l'uscita a parte se la fai pagare." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da fabbro",
    intro:
      "Un cancello o una ringhiera si possono prezzare in tre modi diversi, e due fabbri seri possono arrivare allo stesso numero per strade opposte. Conta che il cliente capisca cosa c'è dentro, e cosa no.",
    punti: [
      {
        titolo: "A chilo, a metro, a pezzo",
        testo:
          "La carpenteria a peso, ringhiere e recinzioni a metro, cancelli a metro quadro o a corpo. Puoi mescolare le unità nello stesso preventivo. Ma se prezzi a chilo, scrivi anche le misure: il cliente ragiona in metri, non in chili.",
      },
      {
        titolo: "Zincatura e verniciatura",
        testo:
          "È la voce su cui il cliente si perde di più. Scrivi se è zincatura a caldo o a freddo, se la verniciatura è a polvere o a smalto, e di che colore. Una ringhiera «verniciata» senza altro è una discussione rimandata.",
      },
      {
        titolo: "Il supporto e i fissaggi",
        testo:
          "Cemento, mattone forato, cappotto: il fissaggio cambia, e cambia il prezzo. Se le opere murarie le fa un altro, cordoli, plinti e scavi vanno fra le esclusioni, scritti per esteso.",
      },
      {
        titolo: "L'automazione in tre righe",
        testo:
          "Tieni separati il cancello, l'automazione e la messa in servizio. Se il motore lo compra il cliente, la prima riga sparisce ma la terza resta: le prove e i documenti li fai comunque tu.",
      },
      {
        titolo: "Il disegno prima del taglio",
        testo:
          "Ringhiere e cancelli lavorati si fanno su un disegno. Scrivi che il lavoro parte quando il cliente approva il disegno: una bacchetta in più al metro, a pezzo finito, la paghi tu.",
      },
      {
        titolo: "Il montaggio in alto",
        testo:
          "Un balcone al terzo piano non si monta come una recinzione in giardino. Se servono ponteggio, piattaforma o autogru, scrivi chi li porta e se sono compresi.",
      },
    ],
  },
  documenti: {
    titolo: "Cancelli automatici, documenti e IVA",
    intro:
      "Per un fabbro il punto delicato è il cancello automatico: lì i documenti sono un obbligo, non una cortesia. Queste sono le cose che tornano più spesso nei lavori per la casa.",
    punti: [
      {
        titolo: "Cancello automatico: il fabbricante sei tu",
        testo:
          "Chi motorizza un cancello ne diventa il fabbricante ai sensi della Direttiva Macchine 2006/42/CE, anche se il motore è di un'altra marca o l'ha comprato il cliente. A fine lavoro rilasci la dichiarazione CE di conformità, applichi la targa con la marcatura CE, consegni istruzioni e registro di manutenzione, e tieni il fascicolo tecnico. Dal 20 gennaio 2027 si applica il Regolamento (UE) 2023/1230, che prende il posto della direttiva.",
      },
      {
        titolo: "La parte elettrica dell'automazione",
        testo:
          "Il DM 37/2008, all'articolo 1, comma 2, lettera a, comprende gli impianti per l'automazione di porte, cancelli e barriere. Per collegarli serve l'abilitazione per quella lettera, anche limitata alle automazioni, e a fine lavoro va rilasciata la dichiarazione di conformità. Se non ce l'hai, scrivi nel preventivo chi fa il collegamento.",
      },
      {
        titolo: "Ringhiere, inferriate e IVA",
        testo:
          "Sostituire ringhiere o cancelli di un'abitazione è di solito manutenzione, al 10%. Se nello stesso lavoro ci sono anche finestre o porte, che sono beni significativi, le inferriate e le grate non si sommano al loro valore: la circolare 15/E del 2018 le considera beni diversi e indipendenti dagli infissi, e il loro valore resta nel valore del lavoro.",
      },
      {
        titolo: "Lavori per altre imprese",
        testo:
          "Con un cliente con partita IVA conta come è fatto il contratto. Se vendi un manufatto e la posa è solo accessoria, è una cessione di beni e l'inversione contabile non si applica (circolare 14/E del 2015). Se invece è un appalto di lavori sull'edificio, può applicarsi. Decidilo con il commercialista prima di scrivere il preventivo: il sistema oggi calcola il 10% e il 22%, non ancora l'inversione contabile.",
      },
    ],
    avvertenza:
      "Le trovi qui come promemoria per il lavoro di tutti i giorni, non come consulenza. Il caso concreto va sempre visto con il commercialista o con un tecnico, e le norme possono cambiare.",
  },
  straniero: {
    titolo: "Case vacanza e clienti lontani",
    testo:
      "Chi ha una casa vacanza e la vuole chiudere con inferriate e cancello prima di partire segue i lavori a distanza e decide dal telefono. Il preventivo può partire in inglese, tedesco, francese, spagnolo o olandese, con zincatura, verniciatura e automazione spiegate nella sua lingua e l'italiano che fa fede. Tu lo controlli in italiano, e vedi quando il cliente lo apre e quando lo accetta, anche se è lontano.",
  },
  domande: {
    titolo: "Domande dai fabbri",
    voci: [
      {
        d: "Le ringhiere le prezzo a metro, le tettoie a chilo. Posso tenerle insieme?",
        r: "Sì, ogni riga usa l'unità della sua voce di listino. Le misure dette a spanne vengono rifatte nell'unità della voce. Se una voce è a chilo e il peso non l'hai detto, il sistema non lo inventa: ti arriva la domanda.",
      },
      {
        d: "Il motore l'ha comprato il cliente. Devo comunque fare io i documenti?",
        r: "Chi motorizza il cancello ne è il fabbricante, quindi sì. Nel preventivo la riga del motore diventa solo montaggio, mentre la messa in servizio con prove e documenti resta una voce tua: tienila fissa nel listino.",
      },
      {
        d: "Una lavorazione che nel listino non ho, per esempio una pensilina curva?",
        r: "La riga resta da prezzare, evidenziata. Il prezzo lo scrivi tu, e se vuoi lo aggiungi al listino così la prossima volta c'è già.",
      },
      {
        d: "Motorizzo il cancello ma non ho l'abilitazione per la parte elettrica. Come lo scrivo?",
        r: "Dillo nel racconto, «il collegamento elettrico lo fa l'elettricista del cliente»: finisce fra le esclusioni. La dichiarazione di conformità della parte elettrica la rilascia chi fa il collegamento.",
      },
      {
        d: "Mando la zincatura a caldo fuori. Come avviso il cliente dei tempi?",
        r: "Scrivilo nel nome della voce di zincatura, per esempio «zincatura a caldo presso terzi, tempi dello zincatore». Se ti capita sempre, mettilo nell'avviso in fondo al preventivo, nei dati dell'impresa.",
      },
      {
        d: "Monto le inferriate insieme alle finestre nuove di un altro. L'IVA cambia?",
        r: "Le inferriate non si sommano al valore delle finestre: per la circolare 15/E del 2018 sono beni indipendenti, e nel listino non vanno segnate come beni significativi. Restano nel valore del lavoro, con l'aliquota del lavoro.",
      },
      {
        d: "Il lavoro parte solo dopo che il cliente approva il disegno. Si può scrivere?",
        r: "Sì. Mettilo nell'avviso in fondo al preventivo, nei dati dell'impresa, così compare su ogni PDF e il cliente lo accetta insieme al prezzo. Le note della bozza invece restano a te.",
      },
    ],
  },
};
