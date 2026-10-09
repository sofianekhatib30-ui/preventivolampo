import type { PaginaGlossario } from "../tipi";

export const glossario: PaginaGlossario = {
  meta: {
    titolo: "Glossario dei preventivi per lavori in casa",
    descrizione:
      "Glossario dei preventivi per lavori in casa: a corpo, a misura, SAL, varianti, beni significativi, inversione contabile, CILA, SCIA, recesso e altro.",
  },
  h1: "Glossario dei preventivi e dei lavori in casa",
  intro:
    "Le parole che trovi nei preventivi, nei contratti e nelle pratiche dei lavori di casa, spiegate in poche righe. Dove un termine ha una definizione di legge, la riportiamo con l'articolo da cui viene, così puoi andare a controllare.",
  termini: [
    {
      termine: "A corpo",
      definizione:
        "Formula di prezzo in cui il corrispettivo si riferisce al lavoro nel suo insieme, così come è descritto nel preventivo: se le quantità risultano maggiori del previsto, il prezzo non cambia. Il rischio delle misure è di chi esegue. Vedi la guida su [a corpo o a misura](/guide/preventivo-a-corpo-o-a-misura).",
    },
    {
      termine: "A misura",
      definizione:
        "Formula di prezzo in cui il preventivo fissa i prezzi unitari (al metro quadro, al metro, al pezzo) e il totale si calcola sulle quantità effettivamente eseguite, misurate a fine lavoro o per stati di avanzamento.",
    },
    {
      termine: "Accettazione",
      definizione:
        "L'atto con cui il cliente accetta il preventivo. Per il codice civile il contratto è concluso quando chi ha fatto la proposta viene a conoscenza dell'accettazione, e un'accettazione che modifica la proposta vale come nuova proposta (art. 1326).",
    },
    {
      termine: "Acconto",
      definizione:
        "Somma pagata in anticipo sul prezzo, che si scala dal totale. Non ha gli effetti della caparra e, nei lavori pagati per partite, il versamento di semplici acconti non fa presumere l'accettazione dell'opera (art. 1666).",
    },
    {
      termine: "Appalto",
      definizione:
        "Il contratto con cui una parte si impegna, con organizzazione dei mezzi necessari e gestione a proprio rischio, a compiere un'opera o un servizio verso un corrispettivo in denaro (art. 1655 del codice civile). È la forma tipica del preventivo accettato per lavori in casa.",
    },
    {
      termine: "Assistenze murarie",
      definizione:
        "Le opere da muratore che servono al lavoro di un altro mestiere: aprire e chiudere tracce, fare fori, murare scatole e cassette per gli impianti. Nel preventivo va scritto se sono comprese o se le fa un'altra impresa.",
    },
    {
      termine: "Beni significativi",
      definizione:
        "I beni elencati dal decreto ministeriale del 29 dicembre 1999: ascensori e montacarichi, infissi esterni e interni, caldaie, videocitofoni, apparecchiature di condizionamento e riciclo dell'aria, sanitari e rubinetterie da bagno, impianti di sicurezza. Nella manutenzione delle abitazioni hanno l'IVA al 10% solo fino al valore del resto del lavoro, e l'eccedenza va al 22%. Vedi la guida sull'[IVA nei lavori in casa](/guide/iva-preventivo-lavori-casa).",
    },
    {
      termine: "Bonifico parlante",
      definizione:
        "Il bonifico con la causale prevista per le detrazioni fiscali, che riporta il codice fiscale di chi chiede la detrazione e la partita IVA o il codice fiscale di chi riceve il pagamento. Su questi accrediti la banca o le Poste trattengono una ritenuta d'acconto a carico di chi riceve il pagamento.",
    },
    {
      termine: "Caparra confirmatoria",
      definizione:
        "Somma data alla conclusione del contratto. Se il lavoro va a buon fine si scala dal prezzo; se è inadempiente chi l'ha data, l'altra parte può recedere e trattenerla; se è inadempiente chi l'ha ricevuta, l'altra parte può recedere e chiedere il doppio (art. 1385).",
    },
    {
      termine: "CILA",
      definizione:
        "Comunicazione di inizio lavori asseverata (art. 6-bis del testo unico dell'edilizia). Serve per gli interventi che non sono edilizia libera e non richiedono SCIA o permesso di costruire, come molte manutenzioni straordinarie senza opere strutturali. La assevera un tecnico abilitato.",
    },
    {
      termine: "Committente",
      definizione:
        "Chi commissiona il lavoro e lo paga. Per le norme sulla sicurezza dei cantieri è il soggetto per conto del quale l'opera viene realizzata (art. 89 del decreto legislativo 81 del 2008).",
    },
    {
      termine: "Computo metrico estimativo",
      definizione:
        "L'elenco delle lavorazioni di un progetto con le quantità misurate e i prezzi unitari, che dà il costo stimato dell'opera. È tipico dei lavori progettati da un tecnico e degli appalti pubblici.",
    },
    {
      termine: "Consumatore",
      definizione:
        "Per il codice del consumo, la persona fisica che agisce per scopi estranei alla propria attività imprenditoriale, commerciale, artigianale o professionale (art. 3). È il cliente che ha diritto al recesso nei contratti conclusi fuori dei locali commerciali o a distanza.",
    },
    {
      termine: "Contratto a distanza",
      definizione:
        "Il contratto con un consumatore concluso senza la presenza fisica e simultanea delle parti, usando solo mezzi di comunicazione a distanza, nell'ambito di un sistema organizzato di vendita o di prestazione di servizi a distanza (art. 45 del codice del consumo).",
    },
    {
      termine: "Contratto d'opera",
      definizione:
        "Il contratto con cui una persona si obbliga a compiere un'opera o un servizio verso un corrispettivo, con lavoro prevalentemente proprio e senza vincolo di subordinazione (art. 2222 del codice civile). È tipico dell'artigiano che lavora da solo; per i vizi i termini sono di otto giorni per la denuncia e un anno per agire (art. 2226).",
    },
    {
      termine: "Contratto fuori dei locali commerciali",
      definizione:
        "Il contratto con un consumatore concluso alla presenza fisica e simultanea delle parti in un luogo diverso dai locali del professionista, per esempio a casa del cliente (art. 45 del codice del consumo). Il cliente ha di regola il diritto di recesso.",
    },
    {
      termine: "Dichiarazione di conformità",
      definizione:
        "Il documento che l'impresa installatrice rilascia alla fine dei lavori su un impianto, previsto dal decreto ministeriale 37 del 2008, con allegati come la relazione sui materiali usati e il progetto o lo schema dell'impianto.",
    },
    {
      termine: "Dichiarazione di rispondenza",
      definizione:
        "Il documento che sostituisce la dichiarazione di conformità per gli impianti realizzati prima del 27 marzo 2008, quando quella non è stata prodotta o non si trova più. La rilascia, dopo un sopralluogo, un professionista iscritto all'albo con almeno cinque anni di esperienza nel settore o, per gli impianti sotto le soglie di progetto, chi è da almeno cinque anni responsabile tecnico di un'impresa abilitata (art. 7, comma 6, del decreto ministeriale 37 del 2008).",
    },
    {
      termine: "Difformità e vizi",
      definizione:
        "I difetti dell'opera rispetto a quanto pattuito o alla regola d'arte. Nell'appalto il cliente deve denunciarli entro sessanta giorni dalla scoperta e l'azione si prescrive in due anni dalla consegna; la garanzia non è dovuta se ha accettato l'opera e i vizi erano conosciuti o riconoscibili (art. 1667). Per i gravi difetti di un edificio l'appaltatore risponde per dieci anni (art. 1669), anche nelle ristrutturazioni.",
    },
    {
      termine: "Edilizia libera",
      definizione:
        "Gli interventi che si eseguono senza titolo abilitativo, fra cui la manutenzione ordinaria (art. 6 del testo unico dell'edilizia). Restano da rispettare le altre norme di settore, per esempio quelle sugli impianti e sulla sicurezza.",
    },
    {
      termine: "Esclusioni",
      definizione:
        "L'elenco di quello che il preventivo non comprende: opere di altri mestieri, pratiche edilizie, smaltimento, materiali forniti dal cliente. Per il cliente tutto ciò che non è escluso è compreso, quindi conviene scriverle sempre.",
    },
    {
      termine: "Fornitura e posa",
      definizione:
        "Voce che comprende sia il materiale sia il lavoro per montarlo. Si distingue dalla sola posa, che si usa quando il materiale lo compra il cliente.",
    },
    {
      termine: "In economia",
      definizione:
        "Lavoro pagato sul tempo effettivamente impiegato, con una tariffa oraria per ogni operaio, più i materiali usati. Si usa quando non si può sapere prima quanto lavoro servirà, come nella ricerca guasti o nei piccoli interventi.",
    },
    {
      termine: "Inversione contabile",
      definizione:
        "Il meccanismo IVA, detto anche reverse charge, in cui la fattura si emette senza imposta e l'IVA la applica il cliente. Nell'edilizia riguarda i subappalti fra imprese del settore e i servizi di pulizia, demolizione, installazione di impianti e completamento di edifici resi a soggetti IVA (art. 17, comma 6, del decreto IVA). Non riguarda i clienti privati.",
    },
    {
      termine: "IVA agevolata",
      definizione:
        "Le aliquote ridotte previste per alcuni lavori edili: il 10% per la manutenzione ordinaria e straordinaria delle abitazioni e per restauro, risanamento e ristrutturazione, il 4% per la costruzione in appalto della prima casa non di lusso. Dipendono dal tipo di immobile, dal tipo di intervento e da chi compra i materiali.",
    },
    {
      termine: "Listino",
      definizione:
        "L'elenco dei prezzi unitari dell'artigiano per le lavorazioni e i materiali che usa più spesso, ognuno con la sua unità di misura. È la base da cui nascono le righe del preventivo: vedi il [listino prezzi](/funzioni/listino-prezzi).",
    },
    {
      termine: "Manutenzione ordinaria",
      definizione:
        "Gli interventi di riparazione, rinnovamento e sostituzione delle finiture degli edifici e quelli necessari a mantenere in efficienza gli impianti esistenti (art. 3 del testo unico dell'edilizia). Rientra nell'edilizia libera.",
    },
    {
      termine: "Manutenzione straordinaria",
      definizione:
        "Le opere per rinnovare e sostituire parti anche strutturali degli edifici e per realizzare o integrare servizi igienico-sanitari e tecnologici, senza alterare la volumetria complessiva né cambiare la destinazione d'uso (art. 3 del testo unico dell'edilizia). Sulle abitazioni ha di regola l'IVA al 10%.",
    },
    {
      termine: "Modulo di recesso",
      definizione:
        "Il modulo tipo previsto dall'allegato I del codice del consumo, che il professionista deve consegnare al consumatore insieme alle informazioni sul recesso nei contratti fuori dei locali e a distanza. Il cliente può usarlo oppure recedere con qualsiasi altra dichiarazione esplicita.",
    },
    {
      termine: "Oneri della sicurezza",
      definizione:
        "I costi delle misure per lavorare in sicurezza in cantiere: apprestamenti, protezioni collettive, impianti di terra, misure di coordinamento. Quando c'è un piano di sicurezza e coordinamento sono stimati lì e non vanno assoggettati a ribasso nelle offerte (allegato XV del decreto legislativo 81 del 2008).",
    },
    {
      termine: "POS",
      definizione:
        "Piano operativo di sicurezza: il documento che il datore di lavoro dell'impresa esecutrice redige per il singolo cantiere (art. 89 del decreto legislativo 81 del 2008).",
    },
    {
      termine: "Prezzario",
      definizione:
        "Elenco di prezzi di riferimento per le lavorazioni edili. I prezzari regionali sono predisposti dalle regioni, valgono un anno e servono soprattutto per gli appalti pubblici; nei lavori privati possono essere un termine di confronto, ma il prezzo lo decide chi fa il preventivo.",
    },
    {
      termine: "Recesso del committente",
      definizione:
        "Nell'appalto il committente può recedere anche a lavori iniziati, purché tenga indenne l'appaltatore delle spese sostenute, dei lavori eseguiti e del mancato guadagno (art. 1671 del codice civile).",
    },
    {
      termine: "Recesso del consumatore",
      definizione:
        "Il diritto del cliente privato di sciogliersi senza motivi da un contratto concluso fuori dei locali commerciali o a distanza: 14 giorni, 30 se il contratto nasce da una visita non richiesta (art. 52 del codice del consumo). Per i servizi il termine parte dalla conclusione del contratto; se il contratto comprende anche beni, dal giorno in cui il consumatore li riceve. Vedi la guida sul [recesso dal preventivo accettato a casa](/guide/recesso-preventivo-accettato-a-casa).",
    },
    {
      termine: "Restauro e risanamento conservativo",
      definizione:
        "Gli interventi che conservano l'organismo edilizio e ne assicurano la funzionalità rispettandone gli elementi tipologici, formali e strutturali (art. 3 del testo unico dell'edilizia). Per l'IVA hanno il 10% senza il calcolo dei beni significativi.",
    },
    {
      termine: "Revisione prezzi",
      definizione:
        "La modifica del prezzo prevista dal codice civile quando, per circostanze imprevedibili, il costo dei materiali o della manodopera cambia di oltre un decimo del prezzo complessivo: si rivede solo la parte che supera il decimo (art. 1664). Le parti possono escluderla per contratto.",
    },
    {
      termine: "Ristrutturazione edilizia",
      definizione:
        "Gli interventi che trasformano un edificio con un insieme sistematico di opere, che può portare anche a un edificio in tutto o in parte diverso dal precedente (art. 3 del testo unico dell'edilizia). Gli appalti per ristrutturazione hanno l'IVA al 10%.",
    },
    {
      termine: "SAL",
      definizione:
        "Stato di avanzamento lavori: la misura, a una certa data, del lavoro eseguito, su cui si chiede un pagamento parziale. Per le opere da eseguire per partite il codice civile consente di chiedere il pagamento in proporzione dell'opera eseguita (art. 1666).",
    },
    {
      termine: "Saldo",
      definizione:
        "L'ultimo pagamento, che chiude il conto. Salvo patti o usi diversi, l'appaltatore ha diritto al corrispettivo quando il committente accetta l'opera (art. 1665).",
    },
    {
      termine: "SCIA",
      definizione:
        "Segnalazione certificata di inizio attività (art. 22 del testo unico dell'edilizia). Serve, fra l'altro, per la manutenzione straordinaria che riguarda parti strutturali o i prospetti, per il restauro su parti strutturali e per la ristrutturazione edilizia che non richiede il permesso di costruire.",
    },
    {
      termine: "Smaltimento",
      definizione:
        "Il trasporto e il conferimento dei materiali di risulta, come macerie, vecchi sanitari e imballaggi, a un impianto autorizzato. Nel preventivo va scritto se è compreso, chi carica e trasporta, e se i costi dell'impianto sono a parte.",
    },
    {
      termine: "Subappalto",
      definizione:
        "L'affidamento di una parte del lavoro a un'altra impresa da parte di chi ha preso l'appalto. L'appaltatore non può subappaltare se il committente non lo ha autorizzato (art. 1656 del codice civile).",
    },
    {
      termine: "Supporto durevole",
      definizione:
        "Ogni strumento che permette di conservare le informazioni ricevute per un periodo adeguato e di riprodurle identiche (art. 45 del codice del consumo). Nei contratti fuori dei locali le informazioni sul recesso vanno date su carta o, se il cliente è d'accordo, su un altro supporto durevole.",
    },
    {
      termine: "Validità dell'offerta",
      definizione:
        "Il periodo in cui il preventivo resta valido. Se ti sei impegnato a mantenere ferma la proposta per un certo tempo, durante quel periodo la revoca non ha effetto (art. 1329 del codice civile).",
    },
    {
      termine: "Varianti",
      definizione:
        "Le modifiche al lavoro rispetto a quanto pattuito. Vanno autorizzate dal committente e l'autorizzazione si prova per iscritto (art. 1659); il committente può ordinarne fino a un sesto del prezzo complessivo, pagando i lavori in più anche se il prezzo era globale (art. 1661).",
    },
  ],
};
