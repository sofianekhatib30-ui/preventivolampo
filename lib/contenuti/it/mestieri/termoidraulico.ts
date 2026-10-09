import type { PaginaMestiere } from "../../tipi";

export const termoidraulico: PaginaMestiere = {
  meta: {
    titolo: "Preventivo termoidraulico, caldaie e clima",
    descrizione:
      "Il preventivo termoidraulico per caldaie, radiatori e climatizzatori: lo racconti dopo il sopralluogo e la bozza usa solo i prezzi del tuo listino.",
  },
  nome: "Termoidraulico",
  riga: "Caldaie, radiatori, valvole termostatiche, climatizzatori split e pompe di calore.",
  h1: "Preventivo termoidraulico: caldaia, radiatori e clima in una bozza sola",
  sottotitolo:
    "Sostituzione della caldaia, radiatori, termostatiche, split e linee frigorifere. Racconti il sopralluogo come lo racconteresti al tuo aiutante: la bozza prende i prezzi solo dal tuo listino, separa il generatore dal resto e ti chiede quello che non hai contato.",
  esempio: {
    titolo: "Un sopralluogo raccontato, una bozza da controllare",
    intro:
      "Una villetta con la caldaia da cambiare, qualche radiatore e due climatizzatori. A destra vedi la caldaia su una riga sua, separata da scarico fumi e lavaggio, i metri di linea del clima, il cronotermostato del cliente come solo collegamento e la domanda sulle valvole termostatiche da contare.",
    lavoro: "Caldaia, radiatori e due split, villetta",
    dettatura:
      "Bene, casa Fontana, villetta su due piani. La caldaia vecchia la smonto e ne metto una a condensazione, stessa posizione in cucina, con lo scarico fumi nuovo: saranno quattro metri di tubo. Prima di attaccarla faccio il lavaggio dell'impianto, che è pieno di fanghi. Al piano di sopra cambio i radiatori, sono cinque. Quelli di sotto li tengo, ma ci metto le valvole termostatiche su tutti: quanti sono di preciso devo ricontarli. Il cronotermostato l'ha comprato lui, io lo collego e basta. Poi due split, uno in camera e uno in soggiorno, con il motore esterno sul balcone, una dozzina di metri di linea in tutto. Le tracce per le linee del clima le fa il muratore, e la vecchia canna fumaria sul tetto non la tocco.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da termoidraulico",
    intro:
      "Generatore, contorno della caldaia, radiatori e linee del clima: un preventivo di riscaldamento si regge su queste righe. I prezzi sono quelli del tuo listino, e un accessorio che non hai mai messo a listino resta da prezzare.",
    righe: [
      { voce: "Smontaggio caldaia esistente", unita: "cad", nota: "Con lo scollegamento di gas, acqua e scarico fumi. Lo smaltimento conviene scriverlo a parte." },
      { voce: "Caldaia a condensazione, fornitura e posa", unita: "cad", nota: "Il generatore è un bene significativo per l'IVA: tienilo su una riga sua, separato dagli accessori." },
      { voce: "Condotto scarico fumi", unita: "m", nota: "Tubo coassiale o sdoppiato, con curve e terminale. A metro, così un percorso lungo si vede." },
      { voce: "Collegamento scarico condensa", unita: "cad", nota: "Una caldaia a condensazione lo richiede: se manca uno scarico vicino, dillo prima." },
      { voce: "Lavaggio impianto di riscaldamento", unita: "corpo", nota: "Pulizia di tubi e radiatori prima di montare il generatore nuovo, con il prodotto indicato." },
      { voce: "Defangatore magnetico", unita: "cad", nota: "Sul ritorno della caldaia. Molti clienti non sanno cos'è: una riga chiara aiuta." },
      { voce: "Sostituzione radiatore", unita: "cad", nota: "Smontaggio del vecchio e posa del nuovo sugli stessi attacchi. Indica il tipo di radiatore compreso." },
      { voce: "Valvola termostatica", unita: "cad", nota: "Corpo valvola e testina, una per radiatore. Il bagno e il locale col termostato di solito restano senza." },
      { voce: "Collegamento cronotermostato", unita: "cad", nota: "Solo collegamento e programmazione quando l'apparecchio lo compra il cliente." },
      { voce: "Collettore di distribuzione riscaldamento", unita: "cad", nota: "Per impianti a collettore o radianti: con il numero di vie scritto nella voce." },
      { voce: "Climatizzatore split, fornitura e posa", unita: "cad", nota: "Unità interna ed esterna. Anche questo è un bene significativo per l'IVA." },
      { voce: "Linea frigorifera in rame", unita: "m", nota: "Coibentata, con il cavo di collegamento. Scrivi quanti metri sono già compresi nella posa." },
      { voce: "Foro passante su muratura", unita: "cad", nota: "Per la linea del clima o per lo scarico fumi. Su cemento armato è un'altra cosa: separalo." },
      { voce: "Staffe per unità esterna", unita: "cad", nota: "A muro o a pavimento. Se servono piattaforme o ponteggi per montarle, sono a parte." },
      { voce: "Prova di tenuta impianto gas", unita: "corpo", nota: "Dopo aver messo mano alla linea gas della caldaia." },
      { voce: "Manutenzione ordinaria caldaia", unita: "cad", nota: "Controllo, pulizia e analisi di combustione, con la compilazione dei documenti dell'impianto." },
      { voce: "Aggiornamento libretto di impianto", unita: "corpo", nota: "Quando cambi il generatore o aggiungi un apparecchio. Se è compreso, dillo." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da termoidraulico",
    intro:
      "Nel riscaldamento e nel clima il valore del lavoro sta spesso in un apparecchio solo, e il resto sembra contorno. È proprio il contorno che il cliente non si aspetta di pagare, quindi va scritto.",
    punti: [
      {
        titolo: "Il generatore su una riga sua",
        testo:
          "Caldaia o climatizzatore da una parte, posa e accessori dall'altra. Il cliente confronta il prezzo dell'apparecchio con quello che vede in rete, e se è tutto insieme pensa che tu ci abbia caricato sopra. In più per l'IVA ti serve averli separati.",
      },
      {
        titolo: "Quello che c'è intorno alla caldaia",
        testo:
          "Scarico fumi, condensa, lavaggio, defangatore, prova di tenuta del gas: sono le voci che fanno la differenza fra due preventivi che sembrano uguali. Mettile tutte, anche quelle che fai a prezzo basso.",
      },
      {
        titolo: "I metri di linea del clima",
        testo:
          "La posa di uno split di solito comprende un certo numero di metri di linea. Scrivi quanti, e tieni nel listino il metro in più: quando il motore esterno va sull'altro lato della casa, il conto si fa senza discutere.",
      },
      {
        titolo: "Radiatori: a pezzo e con il tipo scritto",
        testo:
          "Un radiatore in alluminio, uno in acciaio e uno scaldasalviette non costano uguale. Scrivi il tipo e l'altezza compresi nella voce, così una scelta diversa del cliente diventa una variante e non una lite.",
      },
      {
        titolo: "Apparecchi comprati dal cliente",
        testo:
          "Il cliente trova il climatizzatore o il termostato in offerta e ti chiede solo di montarlo. La riga diventa posa, e conviene scrivere nel nome della voce che garanzia e assistenza dell'apparecchio restano fra lui e chi glielo ha venduto.",
      },
      {
        titolo: "Manutenzioni e chiamate",
        testo:
          "La manutenzione annuale ha un prezzo fisso, il guasto no. Tieni le due cose separate nel listino: la manutenzione a pezzo, la ricerca del guasto a ore con l'uscita, e i ricambi a parte.",
      },
    ],
  },
  documenti: {
    titolo: "Norme, libretto e IVA per caldaie e climatizzatori",
    intro:
      "Nel riscaldamento e nel clima i documenti non sono un dettaglio: alcuni servono al cliente per i controlli, altri a te per lavorare in regola. Ecco quelli che tornano nei lavori di casa.",
    punti: [
      {
        titolo: "Dichiarazione di conformità e progetto",
        testo:
          "Riscaldamento, climatizzazione e impianti gas rientrano nel DM 37/2008: a fine lavoro rilasci la dichiarazione di conformità con la relazione sui materiali. Il progetto di un professionista iscritto all'albo serve, fra l'altro, per la climatizzazione da 40.000 frigorie/ora in su, per gli impianti gas oltre 50 kW di portata termica e per quelli con canne fumarie collettive ramificate.",
      },
      {
        titolo: "Libretto e rapporto di controllo",
        testo:
          "Ogni impianto termico deve avere il libretto di impianto per la climatizzazione, sul modello del DM 10 febbraio 2014. Nei controlli e nelle manutenzioni si compila anche il rapporto di controllo di efficienza energetica previsto dal DPR 74/2013, per il riscaldamento oltre 10 kW e per la climatizzazione estiva oltre 12 kW.",
      },
      {
        titolo: "Gas fluorurati",
        testo:
          "Per installare, manutenere o smontare climatizzatori e pompe di calore con gas fluorurati servono il certificato della persona e quello dell'impresa (DPR 146/2018). Ogni intervento va comunicato alla Banca dati F-gas entro 30 giorni.",
      },
      {
        titolo: "IVA su caldaie e condizionatori",
        testo:
          "Cambiare la caldaia in un'abitazione è manutenzione, al 10%, ma caldaie e condizionatori sono beni significativi (DM 29/12/1999): il 10% sul bene vale fino al valore del resto del lavoro, l'eccedenza va al 22%. Se nel listino la voce è segnata come bene significativo, la bozza ti chiede quanto vale l'apparecchio e con quel dato divide l'IVA. Se sostituisci solo un componente, come il bruciatore, per l'Agenzia delle Entrate (circolare 15/E del 2018) rientra nel prezzo della prestazione.",
      },
      {
        titolo: "Unità esterna e vincoli",
        testo:
          "Installare un climatizzatore aria-aria sotto i 12 kW è di regola edilizia libera, secondo il glossario del DM 2 marzo 2018. Oltre quella potenza, o su un edificio vincolato, va verificato con un tecnico. In una zona con vincolo paesaggistico un'unità esterna visibile dalla strada o dallo spazio pubblico può richiedere l'autorizzazione paesaggistica semplificata (DPR 31/2017, allegato B, voce B.7). Se c'è il dubbio, scrivi nel preventivo che le autorizzazioni sono a carico del cliente.",
      },
      {
        titolo: "Caldaie e clima per aziende",
        testo:
          "Se installi il riscaldamento o il clima nella sede di un'azienda, fra soggetti con partita IVA di regola vale l'inversione contabile: niente IVA in fattura, la applica il cliente. Il sistema oggi calcola il 10%, il 22% e la divisione dei beni significativi; l'inversione contabile non ancora, quindi per questi lavori controlla il totale prima di mandarlo.",
      },
    ],
    avvertenza:
      "Quello che leggi qui è un promemoria per non dimenticare nulla, non un parere di un tecnico o di un fiscalista. Soglie, modelli e aliquote cambiano: sul caso concreto decidono la norma in vigore e il tuo commercialista.",
  },
  straniero: {
    titolo: "Clienti che non parlano italiano",
    testo:
      "Chi ha una seconda casa e vuole il clima prima dell'estate, o la famiglia arrivata per lavoro che al primo inverno si trova la caldaia da cambiare: per il termoidraulico sono chiamate frequenti. Il preventivo può partire in inglese, tedesco, francese, spagnolo o olandese, con generatore, accessori e manutenzioni spiegati nella loro lingua, l'italiano che fa fede e il modulo di recesso tradotto. Tu lo controlli in italiano.",
  },
  domande: {
    titolo: "Domande dai termoidraulici",
    voci: [
      {
        d: "Cambio una caldaia. Come tengo separati l'apparecchio e il resto del lavoro?",
        r: "Se nel listino la caldaia è una voce sua, nella bozza esce su una riga separata da posa, scarico fumi e accessori. Se la segni come bene significativo, la bozza ti chiede quanto vale la caldaia e divide l'IVA fra 10% e 22% quando serve. La verifica con il commercialista resta tua.",
      },
      {
        d: "Devo mettere nel preventivo la comunicazione alla Banca dati F-gas?",
        r: "È un obbligo tuo, non un servizio da vendere, ma conviene nominarla: tienila nel listino come voce a corpo, anche a prezzo zero se è compresa, e dilla nel racconto. Così il cliente vede che lo split è montato in regola.",
      },
      {
        d: "Nella posa dello split ho compresi alcuni metri di linea. Se ne servono di più?",
        r: "Tieni nel listino due voci: la posa e il metro di linea in più. Dici quanti metri servono, anche a occhio, e nella bozza trovi la riga a metro con la quantità detta. Prima di approvare controlli la quantità: se una parte dei metri è già nella posa, la correggi tu.",
      },
      {
        d: "Cambio solo il bruciatore o la pompa della caldaia. Va trattato come una caldaia nuova?",
        r: "No. Per l'Agenzia delle Entrate un componente sostituito su un apparecchio già installato rientra nel prezzo della prestazione, senza la regola dei beni significativi. Nel listino tieni i ricambi come voci normali, non segnate come beni significativi, e la bozza li tratta di conseguenza.",
      },
      {
        d: "I radiatori li conto a pezzo o a elemento?",
        r: "Come li hai nel listino. Se la tua voce è a pezzo, la bozza conta i radiatori; se hai anche voci per tipo e altezza, dillo nel racconto e il sistema cerca quella giusta. Se non la trova, la riga resta da prezzare.",
      },
      {
        d: "Faccio molte manutenzioni annuali. Ha senso usarlo anche per quelle?",
        r: "Sì, soprattutto quando dalla manutenzione esce un lavoro in più: termostatiche, un defangatore, un vaso di espansione da cambiare. Lo dici appena finito il controllo e il cliente riceve il preventivo con il tuo logo mentre si ricorda ancora di cosa avete parlato.",
      },
      {
        d: "Mando il preventivo per la caldaia e il cliente non risponde. Posso sapere se l'ha letto?",
        r: "Sì. Vedi quando il cliente apre il preventivo e quando lo accetta dal link. Se l'ha aperto e non ha accettato, sai che è il momento di chiamarlo.",
      },
    ],
  },
};
