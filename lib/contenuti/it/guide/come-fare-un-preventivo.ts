import type { PaginaGuida } from "../../tipi";

export const comeFareUnPreventivo: PaginaGuida = {
  meta: {
    titolo: "Come fare un preventivo per lavori in casa",
    descrizione:
      "Come fare un preventivo per lavori in casa: dati, voci con quantità e unità, IVA, tempi, pagamenti, esclusioni e varianti. E gli errori che costano di più.",
  },
  nome: "Come fare un preventivo",
  riga: "Cosa scrivere, riga per riga, perché il preventivo regga anche dopo che il cliente l'ha firmato.",
  h1: "Come fare un preventivo per lavori in casa che regga fino al saldo",
  intro:
    "Un preventivo non serve solo a dire quanto costa un lavoro. Quando il cliente lo accetta diventa il contratto: è il foglio che tirerai fuori se a metà lavoro chiede una presa in più, se paga in ritardo, se a fine cantiere dice che il battiscopa era compreso. Questa guida mette in fila quello che deve esserci, nell'ordine in cui lo scriveresti, con le regole del codice civile e del codice del consumo che contano davvero nei lavori di casa. Vale per l'elettricista come per l'impresa edile, e vale anche se il preventivo lo scrivi a mano.",
  inBreve: [
    "Quando il cliente accetta, il preventivo è il contratto: scrivilo come se dovessi leggerlo davanti a un giudice.",
    "Ogni voce ha una quantità, un'unità e un prezzo, e dice cosa comprende: fornitura, posa, smaltimento.",
    "Scrivi sempre cosa è escluso, per quanti giorni vale l'offerta e come si pagano acconto e saldo.",
    "Le varianti vanno autorizzate per iscritto: il codice civile lo chiede espressamente.",
    "Se il cliente è un privato e firma a casa sua, ha di regola 14 giorni per ripensarci, e devi dirglielo.",
  ],
  sezioni: [
    {
      titolo: "Il preventivo accettato è un contratto",
      paragrafi: [
        "Per il codice civile il contratto è concluso quando chi ha fatto la proposta viene a sapere che l'altro l'ha accettata (art. 1326). Il tuo preventivo è la proposta; la firma del cliente, o la sua accettazione online, chiude il contratto. Da quel momento quello che hai scritto ti obbliga, e quello che non hai scritto lo deciderà qualcun altro.",
        "Nella maggior parte dei lavori di casa quel contratto è un **appalto**: chi esegue organizza i mezzi necessari e lavora a proprio rischio, verso un corrispettivo in denaro (art. 1655). Se lavori da solo o quasi, con il tuo lavoro personale e senza una vera organizzazione di dipendenti, il rapporto può essere invece un **contratto d'opera** (art. 2222). La differenza non è teorica: cambiano per esempio i termini della garanzia, come vedi più sotto.",
        "Se nel preventivo manca il prezzo, il codice civile prevede che si calcoli con le tariffe o gli usi e, in mancanza, lo stabilisca il giudice (art. 1657). Un preventivo che dice «prezzo da concordare» non ti protegge: ti consegna a un perito.",
      ],
    },
    {
      titolo: "Chi sei, chi è il cliente, dove si lavora",
      paragrafi: [
        "La prima parte sembra burocrazia, ma è quella che rende il documento utilizzabile. Metti la tua ragione sociale, la partita IVA, l'indirizzo, il telefono e l'email. Per il cliente servono nome e cognome (o la ragione sociale), l'indirizzo dove abita e l'indirizzo del cantiere, se è diverso. Se poi dovrai fatturare, ti servirà anche il suo codice fiscale: chiederlo subito evita una telefonata dopo.",
        "Quando il cliente è un consumatore e il contratto nasce a casa sua o a distanza, il codice del consumo ti chiede proprio queste cose: la tua identità, l'indirizzo, il numero di telefono e l'email, prima che lui si impegni (art. 49). Non è un dettaglio formale: l'onere di provare di averle date è tuo.",
        "Poi una riga sul lavoro: dove (piano, stanza, esterno), cosa si fa e da che situazione si parte. «Bagno al secondo piano, rifacimento completo, sanitari e piastrelle esistenti da rimuovere» dice già metà del preventivo e fissa lo stato di partenza, cosa che ti servirà se sotto le piastrelle trovi una sorpresa.",
      ],
    },
    {
      titolo: "Le voci: quantità, unità e cosa c'è dentro",
      paragrafi: [
        "Il cuore del preventivo sono le righe. Ogni riga ha quattro cose: una descrizione che il cliente capisce, una quantità, un'unità di misura e un prezzo unitario. Il totale della riga è il prodotto, e il cliente lo deve poter rifare con la calcolatrice del telefono.",
        "Le unità più comuni nei lavori di casa sono il metro quadro (pareti, pavimenti, cartongesso), il metro lineare (battiscopa, tracce, tubazioni), il pezzo (punti luce, sanitari, infissi), l'ora (ricerca guasti, piccoli interventi) e il «corpo», cioè un prezzo unico per una cosa intera. Scegli l'unità con cui misuri davvero, non quella che rende il numero più piccolo.",
      ],
      punti: [
        {
          titolo: "Fornitura e posa, oppure solo posa",
          testo:
            "Scrivi se la riga comprende il materiale. «Fornitura e posa di piatto doccia 80x120» e «Posa di piatto doccia fornito dal cliente» sono due prezzi diversi, e confonderli è la lite più comune a fine lavoro.",
        },
        {
          titolo: "Marca, serie, modello",
          testo:
            "Se il prezzo dipende dalla qualità, nomina il prodotto o almeno la fascia. Una presa o un rubinetto «standard» non vogliono dire niente per il cliente, che a lavoro finito si aspetterà quelli che ha visto in vetrina.",
        },
        {
          titolo: "Le voci che si dimenticano",
          testo:
            "Protezione di pavimenti e mobili, demolizioni, trasporto e smaltimento dei materiali di risulta, ripristini, pulizia finale, ponteggi o trabattelli, dichiarazione di conformità degli impianti. Se le fai, mettile in riga; se non le fai, mettile fra le esclusioni.",
        },
        {
          titolo: "Le quantità che non sai ancora",
          testo:
            "Se il cliente non ha deciso quante prese vuole, non inventare un numero. Lascia la quantità aperta e diglielo, oppure scrivi un numero con la frase «quantità indicativa, si conteggia il numero effettivo». È il modo più semplice di non perdere né soldi né fiducia.",
        },
      ],
    },
    {
      titolo: "Prezzi, IVA e totale",
      paragrafi: [
        "Sotto le righe metti l'imponibile, l'aliquota IVA, l'importo dell'IVA e il totale. Al privato che conclude il contratto a casa sua o a distanza devi indicare il **prezzo totale comprensivo delle imposte**, o almeno il modo per calcolarlo (art. 49 del codice del consumo). Un preventivo con il solo imponibile, mandato a un privato, è la ricetta per sentirsi dire «io avevo capito un'altra cifra».",
        "L'aliquota non la sceglie il cliente e non la scegli tu: dipende dal tipo di immobile, dal tipo di intervento e da chi compra i materiali. Nelle abitazioni capita spesso il 10%, con il calcolo a parte per i beni significativi come caldaie, infissi e sanitari. La guida su [IVA nei preventivi per lavori in casa](/guide/iva-preventivo-lavori-casa) spiega i casi uno per uno. Se sei in regime forfettario, invece, in fattura non addebiti l'IVA al cliente, e conviene scriverlo anche nel preventivo.",
        "Un sistema come PreventivoLampo ti chiede tre cose (se è un'abitazione, che tipo di intervento è, chi compra i materiali) e ricava l'aliquota da lì, con la divisione dei beni significativi sulle voci che hai segnato nel listino. Oggi calcola il 10%, il 22% e quella divisione; inversione contabile, 4% prima casa e regime forfettario non ancora, quindi in quei casi controlla il totale prima di mandarlo. L'ultima parola resta tua e del tuo commercialista.",
      ],
    },
    {
      titolo: "Tempi, validità dell'offerta e pagamenti",
      paragrafi: [
        "Scrivi quando puoi iniziare e quanto dura il lavoro, in giorni lavorativi o in settimane, e cosa può spostare la data: la consegna di un materiale scelto dal cliente, il meteo per i lavori esterni, un'autorizzazione che deve chiedere lui. Una data senza condizioni diventa una promessa; una data con le sue condizioni è un'informazione.",
        "Poi la **validità dell'offerta**. Se scrivi che il preventivo resta valido per un certo numero di giorni, ti obblighi a mantenerlo per quel tempo: per il codice civile, se il proponente si è impegnato a tenere ferma la proposta, la revoca non ha effetto (art. 1329). È una tutela per il cliente, ma anche per te: passato il termine, se i prezzi dei materiali sono cambiati, puoi rifare i conti.",
        "Sui pagamenti scegli le parole con cura. Un **acconto** è un anticipo sul prezzo. Una **caparra confirmatoria** è un'altra cosa: se il cliente non adempie puoi recedere e tenerla, se sei tu a non adempiere lui può chiederti il doppio (art. 1385). Scrivere «caparra» quando intendi «acconto» cambia le conseguenze.",
        "Per i lavori lunghi conviene pagare a stati di avanzamento. Il codice civile lo prevede per le opere da eseguire per partite: puoi chiedere il pagamento in proporzione dell'opera eseguita, e il pagamento fa presumere l'accettazione della parte pagata, mentre i semplici acconti no (art. 1666). Senza patti diversi, il saldo è dovuto quando il cliente accetta l'opera finita (art. 1665).",
      ],
    },
    {
      titolo: "Esclusioni, varianti e imprevisti",
      paragrafi: [
        "La sezione delle esclusioni è quella che ti fa risparmiare più tempo a fine lavoro. Scrivi in chiaro cosa non fai: le tracce le chiude il muratore, la tinteggiatura dopo l'impianto non è compresa, i lampadari li monta un altro, le pratiche comunali le segue il tecnico del cliente. Una riga di esclusione costa dieci secondi; una discussione su una cosa data per scontata costa una giornata e spesso un cliente.",
        "Poi le varianti. Per il codice civile non puoi cambiare le modalità del lavoro se il cliente non le ha autorizzate, e **l'autorizzazione si prova per iscritto** (art. 1659). Se il prezzo è stato fissato in un'unica cifra per tutta l'opera, anche le modifiche autorizzate non ti danno diritto a un compenso in più, salvo che sia stato pattuito. Il cliente, dal canto suo, può chiederti modifiche purché non superino un sesto del prezzo complessivo, e tu hai diritto al compenso per i lavori in più (art. 1661).",
        "Il modo pratico di gestire tutto questo è mettere nel preventivo i prezzi unitari anche quando dai un totale a corpo, e far firmare ogni variante, anche con un messaggio scritto, prima di farla. La guida su [a corpo o a misura](/guide/preventivo-a-corpo-o-a-misura) entra nel dettaglio.",
        "Per gli imprevisti veri, quelli che nessuno poteva vedere, il codice civile prevede la revisione del prezzo se i costi di materiali o manodopera cambiano di oltre un decimo del prezzo complessivo, per la sola parte che supera quel decimo, e un equo compenso per difficoltà di esecuzione dovute a cause geologiche, idriche e simili (art. 1664). Sono regole che si possono escludere per contratto, quindi leggi bene i preventivi che ti fa firmare un'impresa più grande.",
      ],
    },
    {
      titolo: "Accettazione, recesso e garanzia",
      paragrafi: [
        "Il preventivo deve dire come si accetta: una firma con la data sotto la frase «accetto il preventivo e le condizioni sopra indicate», oppure un'accettazione online che lasci traccia di chi, quando e su quale versione. Con PreventivoLampo il cliente accetta dal link e restano nome, data, ora e copia del PDF accettato.",
        "Se il cliente è un privato e il contratto si conclude a casa sua, o a distanza, entra in gioco il codice del consumo: di regola ha 14 giorni per recedere senza dare motivi, e tu devi informarlo e consegnargli il modulo. Se non lo fai, il termine si allunga di dodici mesi. È un tema che merita una pagina a parte: [recesso dal preventivo accettato a casa](/guide/recesso-preventivo-accettato-a-casa).",
        "Infine la garanzia, che non scrivi tu ma che conviene conoscere. Nell'appalto il cliente deve denunciare difformità e vizi entro sessanta giorni dalla scoperta, e l'azione si prescrive in due anni dalla consegna dell'opera (art. 1667). Nel contratto d'opera i termini sono più brevi: otto giorni dalla scoperta per denunciare, un anno dalla consegna per agire (art. 2226). Se il cliente accetta l'opera e i vizi erano conosciuti o riconoscibili, la garanzia non è dovuta: per questo un verbale di fine lavori firmato vale più di quanto sembri. Per i gravi difetti di un edificio però rispondi per dieci anni (art. 1669), e la Cassazione lo applica anche alle ristrutturazioni. E se al cliente privato fornisci anche dei beni, come una caldaia o una finestra, su quei beni vale la garanzia del codice del consumo.",
      ],
    },
    {
      titolo: "Gli errori che fanno perdere soldi o clienti",
      paragrafi: [
        "Quasi tutte le liti sui lavori di casa nascono da poche righe scritte male o mai scritte. Questi sono gli errori che tornano più spesso.",
      ],
      punti: [
        {
          titolo: "Il totale senza dettaglio",
          testo:
            "Una cifra unica per «rifacimento bagno» non ti permette di calcolare una variante e non permette al cliente di capire cosa sta pagando. Tieni il dettaglio anche quando il cliente vuole un numero solo.",
        },
        {
          titolo: "Le misure a occhio",
          testo:
            "Se al sopralluogo hai detto «saranno una trentina di metri», nel preventivo scrivi la misura che hai preso o scrivi che la quantità si conteggia a fine lavoro. Un numero tondo scritto con sicurezza diventa un prezzo chiuso.",
        },
        {
          titolo: "Nessuna esclusione",
          testo:
            "Il cliente legge il preventivo come un elenco di cose che riceverà. Tutto quello che non è escluso, per lui, è compreso.",
        },
        {
          titolo: "Varianti a voce",
          testo:
            "«Già che ci sei, spostami anche questa presa» è il modo in cui si perde il margine di un lavoro. Una variante si scrive, si prezza e si fa approvare prima.",
        },
        {
          titolo: "Il preventivo che arriva dopo una settimana",
          testo:
            "Chi chiede più preventivi tende a muoversi con chi risponde per primo in modo chiaro. Scriverlo la sera stessa del sopralluogo, quando ricordi ogni dettaglio, è il vantaggio più semplice che hai. È il motivo per cui esiste il [preventivo da vocale](/funzioni/preventivo-da-vocale).",
        },
        {
          titolo: "Nessuna data di validità",
          testo:
            "Un preventivo senza scadenza può tornarti indietro sei mesi dopo, accettato, con i prezzi dei materiali di allora.",
        },
      ],
    },
  ],
  domande: {
    titolo: "Domande frequenti sul preventivo",
    voci: [
      {
        d: "Il preventivo firmato dal cliente è un contratto?",
        r: "Sì. Il preventivo è una proposta, e quando il cliente lo accetta e tu lo vieni a sapere il contratto è concluso (art. 1326 del codice civile). Da quel momento le condizioni scritte valgono per entrambi.",
      },
      {
        d: "Quanto deve durare la validità di un preventivo?",
        r: "La durata la decidi tu e la scrivi nel preventivo. Se ti impegni a mantenere l'offerta per un certo tempo, in quel periodo non puoi revocarla (art. 1329). Per i lavori con molti materiali conviene una validità breve, perché i prezzi dei fornitori cambiano.",
      },
      {
        d: "Devo indicare l'IVA nel preventivo a un privato?",
        r: "Sì, conviene sempre. Se il contratto si conclude a casa del cliente o a distanza, il codice del consumo chiede di indicare il prezzo totale comprensivo delle imposte, o il modo di calcolarlo (art. 49).",
      },
      {
        d: "Acconto o caparra: cosa scrivo?",
        r: "Dipende da cosa vuoi. L'acconto è un anticipo sul prezzo. La caparra confirmatoria ha effetti precisi in caso di inadempimento: chi l'ha ricevuta può tenerla, chi l'ha data può chiedere il doppio (art. 1385). Usa la parola giusta, perché le conseguenze cambiano.",
      },
      {
        d: "Il cliente mi chiede lavori in più durante il cantiere. Come mi tutelo?",
        r: "Fatti autorizzare la variante per iscritto prima di eseguirla, con il prezzo: il codice civile chiede la prova scritta dell'autorizzazione (art. 1659). Se nel preventivo ci sono i prezzi unitari, calcolare la variante è immediato.",
      },
      {
        d: "Posso chiedere di essere pagato a stati di avanzamento?",
        r: "Sì, se lo scrivi. Per le opere eseguite per partite il codice civile consente di chiedere il pagamento in proporzione al lavoro fatto (art. 1666). Indica nel preventivo le tappe e la percentuale o l'importo di ciascuna.",
      },
      {
        d: "Per quanto tempo rispondo dei difetti del lavoro?",
        r: "Nell'appalto il cliente deve denunciare i vizi entro sessanta giorni dalla scoperta e può agire entro due anni dalla consegna (art. 1667). Se il rapporto è un contratto d'opera, i termini sono otto giorni e un anno (art. 2226). Per i gravi difetti di un edificio però rispondi per dieci anni (art. 1669), anche nelle ristrutturazioni. E se al cliente privato fornisci anche dei beni, come una caldaia o una finestra, su quei beni vale la garanzia del codice del consumo.",
      },
    ],
  },
  fonti: [
    { nome: "Codice civile, art. 1326: conclusione del contratto", url: "https://www.brocardi.it/codice-civile/libro-quarto/titolo-ii/capo-ii/sezione-i/art1326.html" },
    { nome: "Codice civile, art. 1329: proposta irrevocabile", url: "https://brocardi.it/codice-civile/libro-quarto/titolo-ii/capo-ii/sezione-i/art1329.html" },
    { nome: "Codice civile, art. 1659: variazioni concordate del progetto", url: "https://brocardi.it/codice-civile/libro-quarto/titolo-iii/capo-vii/art1659.html" },
    { nome: "Codice civile, art. 1667: difformità e vizi dell'opera", url: "https://www.brocardi.it/codice-civile/libro-quarto/titolo-iii/capo-vii/art1667.html" },
    { nome: "Codice civile, art. 2226: difformità e vizi nel contratto d'opera", url: "https://brocardi.it/codice-civile/libro-quinto/titolo-iii/capo-i/art2226.html" },
    { nome: "Codice del consumo, art. 49: obblighi di informazione", url: "https://www.brocardi.it/codice-del-consumo/parte-iii/titolo-iii/capo-i/sezione-ii/art49.html" },
  ],
  avvertenza:
    "Questa guida ti orienta su come scrivere un preventivo e cita le norme come sono oggi, ma non è un parere legale né fiscale. Per un contratto importante o un caso che non torna, fatti vedere il testo da un legale o dalla tua associazione di categoria, e per l'IVA dal tuo commercialista.",
};
