import type { PaginaMestiere } from "../../tipi";

export const serramentista: PaginaMestiere = {
  meta: {
    titolo: "Preventivo serramentista: finestre e tapparelle",
    descrizione:
      "Racconti misure e modelli di finestre, persiane e porte blindate: il preventivo serramentista esce con i prezzi del tuo listino e l'IVA sugli infissi.",
  },
  nome: "Serramentista",
  riga: "Finestre, portefinestre, persiane, tapparelle, porte blindate, smontaggio del vecchio e posa.",
  h1: "Preventivo serramentista: misure e modelli a voce, prezzi dal tuo listino",
  sottotitolo:
    "Finestre, portefinestre, persiane, tapparelle e porte blindate. Racconti il rilievo foro per foro, come l'hai segnato sul blocco: la bozza prende i prezzi dal tuo listino, tiene separate le parti che per l'IVA vanno separate e ti chiede quello che manca.",
  esempio: {
    titolo: "Il rilievo detto a voce, la bozza da controllare",
    intro:
      "Quattro serramenti in PVC da cambiare, con tapparelle nuove e una porta blindata già comprata dai clienti. A destra vedi ogni finestra su una riga con le sue misure, le tapparelle separate dagli infissi, la blindata come sola posa e la domanda sulle zanzariere.",
    lavoro: "Sostituzione serramenti, appartamento",
    dettatura:
      "Rilievo dai signori Marchetti. Cambiamo tutte le finestre, PVC bianco, doppio vetro basso emissivo. In cucina finestra a due ante, uno e venti per uno e quaranta. In soggiorno la portafinestra a due ante, uno e quaranta per due e venti circa. Le due camere hanno finestre a un'anta, ottanta per uno e trenta. La vasistas del bagno la lasciano. Smontaggio delle vecchie in legno e smaltimento, ci penso io. Tapparelle nuove in alluminio coibentato su tutte, con il motore solo in soggiorno. Le zanzariere le vogliono, ma su quante finestre non l'hanno ancora deciso. La porta blindata d'ingresso l'hanno già comprata loro, io la monto e basta. Le opere murarie sui davanzali non sono mie, le fa il loro muratore.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da serramentista",
    intro:
      "Infisso, oscurante, smontaggio, posa e finiture: in un cambio di serramenti queste righe stanno separate, anche per l'IVA. Il prezzo di ogni modello è il tuo e arriva dal tuo listino; un sistema di profili che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Finestra a un'anta", unita: "cad", nota: "Con le misure del foro e la vetrata compresa: è quello che il cliente confronta fra due preventivi." },
      { voce: "Finestra a due ante", unita: "cad", nota: "Indica il sistema del profilo e il tipo di vetro, non solo il materiale." },
      { voce: "Portafinestra a due ante", unita: "cad", nota: "Scrivi se la soglia ribassata è compresa." },
      { voce: "Finestra a vasistas", unita: "cad", nota: "Bagni e lavanderie. Anche in versione anta e ribalta." },
      { voce: "Serramento in alluminio a taglio termico", unita: "m²", nota: "Per vetrate e misure fuori serie, a metro quadro di foro." },
      { voce: "Smontaggio serramento esistente", unita: "cad", nota: "Con o senza il vecchio telaio a muro: scrivi quale, cambia il lavoro." },
      { voce: "Smaltimento serramenti vecchi", unita: "cad", nota: "Legno, vetro e ferramenta da portare via. Se lo fa il cliente, va fra le esclusioni." },
      { voce: "Controtelaio", unita: "cad", nota: "Nuovo o recupero di quello esistente: decidilo al rilievo, perché cambia la posa." },
      { voce: "Posa in opera serramento", unita: "cad", nota: "Per serramenti forniti da altri: fissaggi, sigillature e nastri del giunto." },
      { voce: "Tapparella in alluminio coibentato", unita: "m²", nota: "A metro quadro di telo. Per l'IVA non si somma al valore dell'infisso." },
      { voce: "Motorizzazione tapparella", unita: "cad", nota: "Motore tubolare con comando. Scrivi se il collegamento elettrico lo fa l'elettricista." },
      { voce: "Persiana in alluminio", unita: "cad", nota: "Ad ante, con i cardini a muro. Indica colore e lamelle fisse o orientabili." },
      { voce: "Isolamento cassonetto", unita: "cad", nota: "Il cassonetto della tapparella è spesso il punto da cui passa il freddo." },
      { voce: "Zanzariera a rullo", unita: "cad", nota: "Verticale per le finestre, laterale per le portefinestre." },
      { voce: "Porta blindata", unita: "cad", nota: "Indica la classe antieffrazione e il pannello di rivestimento: sono le prime cose che il cliente chiede." },
      { voce: "Posa porta blindata", unita: "cad", nota: "Solo montaggio, quando la porta l'ha comprata il cliente." },
      { voce: "Coprifili interni", unita: "m", nota: "Finiture fra telaio e muro, dentro casa." },
      { voce: "Regolazione e riparazione serramenti", unita: "h", nota: "Ante che toccano, ferramenta che non chiude: lavoro a ore." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da serramentista",
    intro:
      "Nei serramenti il cliente confronta preventivi con lo stesso nome e contenuti diversi. Il modo per non perdere il lavoro sul prezzo è far vedere cosa c'è dentro ogni riga.",
    punti: [
      {
        titolo: "Le misure del rilievo",
        testo:
          "Il preventivo si basa sulle misure prese al sopralluogo. Scrivi sul preventivo che le misure definitive si verificano prima dell'ordine: un serramento sbagliato di qualche centimetro non si rimanda indietro.",
      },
      {
        titolo: "Cosa c'è dentro la finestra",
        testo:
          "Profilo, vetro, ferramenta, colore. Due finestre «in PVC» possono essere due prodotti diversi: nella voce del listino scrivi il sistema, la vetrata e il colore, così il cliente confronta cose uguali.",
      },
      {
        titolo: "Smontaggio, smaltimento, controtelaio",
        testo:
          "Sono le tre righe che separano un preventivo completo da uno che sembra solo più basso. Mettile sempre, oppure scrivi chiaramente che non ci sono e chi se ne occupa. Se nel racconto dici solo «le porto via io», lo smaltimento resta compreso nello smontaggio: se lo vuoi su una riga sua, di' quanti serramenti smaltisci.",
      },
      {
        titolo: "Le parti staccate su righe proprie",
        testo:
          "Tapparelle, persiane, zanzariere: su righe separate il cliente capisce cosa paga, e servono anche per l'IVA, perché il loro valore non si somma a quello degli infissi.",
      },
      {
        titolo: "Porte e finestre comprate dal cliente",
        testo:
          "Porte blindate o finestre comprate da lui: la riga diventa solo posa. Scrivi cosa comprende, smontaggio del vecchio, fissaggi, regolazione, e che della qualità del prodotto non rispondi tu.",
      },
      {
        titolo: "Le opere murarie attorno",
        testo:
          "Davanzali, spallette, intonaco attorno al telaio: se non li fai, mettili fra le esclusioni. È quello che il cliente scopre il giorno della posa, se nessuno gliel'ha scritto.",
      },
    ],
  },
  documenti: {
    titolo: "Marcatura, posa, IVA e detrazioni",
    intro:
      "Chi cambia le finestre fa domande su carte e detrazioni prima ancora che sul colore. Queste sono le cose da sapere per rispondere bene e scriverle giuste nel preventivo.",
    punti: [
      {
        titolo: "Marcatura CE e dichiarazione di prestazione",
        testo:
          "Finestre e porte esterne pedonali vanno marcate CE secondo la norma armonizzata UNI EN 14351-1 (Regolamento UE 305/2011), con la dichiarazione di prestazione (DoP). Al cliente consegni DoP, etichetta CE e istruzioni di manutenzione: servono anche per le pratiche delle detrazioni.",
      },
      {
        titolo: "La posa a regola d'arte",
        testo:
          "La UNI 11673-1 dà i criteri per progettare la posa dei serramenti, giunti compresi, e la UNI 11673-2 descrive le competenze del posatore. Sono norme volontarie: diventano vincolanti se le richiami nel contratto. Citarle nel preventivo dice al cliente come posi.",
      },
      {
        titolo: "IVA: infissi e parti staccate",
        testo:
          "Cambiare le finestre di un'abitazione è di solito manutenzione, al 10%, ma gli infissi esterni e interni sono beni significativi (DM 29/12/1999): il 10% vale sul loro valore solo fino al valore del resto della prestazione, la parte che supera va al 22%. Per la circolare 15/E del 2018 tapparelle, persiane, scuri, veneziane e zanzariere hanno autonomia funzionale e non si sommano all'infisso, salvo che siano integrate nel serramento.",
      },
      {
        titolo: "Serramenti per aziende e imprese",
        testo:
          "Se monti serramenti forniti da altri per un'impresa o in un ufficio, la sola posa è un lavoro di completamento e di solito va in inversione contabile (art. 17, comma 6, lettera a-ter del DPR 633/1972). Se invece vendi il serramento con la posa, è una cessione di beni e l'inversione contabile non si applica. Il sistema oggi calcola il 10%, il 22% e la divisione dei beni significativi, non l'inversione contabile: per la sola posa a un'impresa controlla il totale prima di mandarlo.",
      },
      {
        titolo: "Pratiche e vincoli",
        testo:
          "Riparare, sostituire o rinnovare serramenti e infissi esterni rientra nell'edilizia libera secondo il glossario del DM 2 marzo 2018. Nelle zone con vincolo paesaggistico l'autorizzazione non serve solo se rispetti materiali, finiture e caratteristiche esistenti: se il cliente vuole cambiare colore o materiale, va verificato prima.",
      },
      {
        titolo: "Detrazioni e comunicazione all'ENEA",
        testo:
          "Se il cliente chiede la detrazione per il risparmio energetico, la scheda dell'intervento va trasmessa all'ENEA entro 90 giorni dalla fine dei lavori. Serve l'asseverazione di un tecnico o, per la singola unità abitativa, la certificazione del fornitore o dell'installatore. Scrivi nel preventivo se te ne occupi tu.",
      },
    ],
    avvertenza:
      "Sono appunti di lavoro per orientarsi, non un parere: aliquote, detrazioni e regole cambiano spesso, e sul caso concreto decidono il tuo commercialista e il tecnico.",
  },
  straniero: {
    titolo: "Seconde case e clienti stranieri",
    testo:
      "Il proprietario di una seconda casa che vive all'estero vuole chiuderla bene prima dell'inverno e confronta i preventivi da lontano, guardando vetro, profilo e colore. Il preventivo gli arriva in inglese, tedesco, francese, spagnolo o olandese, con le misure del foro identiche, la spiegazione dei beni significativi nella sua lingua, l'italiano che fa fede e il modulo di recesso tradotto.",
  },
  domande: {
    titolo: "Domande dai serramentisti",
    voci: [
      {
        d: "Nel listino alcune finestre sono a pezzo e altre a metro quadro. Il sistema si confonde?",
        r: "No. Le misure che dici vengono rifatte nell'unità di ogni voce: se la voce è a metro quadro il conto lo fa il sistema, se è a pezzo conta i pezzi. Prima di approvare controlli riga per riga.",
      },
      {
        d: "Come divido l'IVA fra finestre, tapparelle e posa?",
        r: "Nel listino segni come beni significativi le voci dei serramenti, non quelle di tapparelle e zanzariere. Quando rispondi alle tre domande sul lavoro (abitazione, tipo di intervento, chi compra i materiali), la bozza ti chiede quanto vale il serramento in ogni riga segnata e divide fra 10% e 22%, con l'avviso di verificare con il commercialista.",
      },
      {
        d: "Le misure definitive le prendo dopo l'accettazione. Posso scriverlo?",
        r: "Sì. Mettilo nell'avviso in fondo al preventivo, nei dati dell'impresa: «misure da verificare prima dell'ordine». Compare su ogni PDF e il cliente lo accetta insieme al resto. Le note della bozza invece restano a te.",
      },
      {
        d: "Il cliente vuole la detrazione per il risparmio energetico. Cosa scrivo nel preventivo?",
        r: "Scrivi nel nome delle voci i dati che servono per la pratica, come la trasmittanza del serramento, e di' nel racconto chi manda la scheda all'ENEA. Se non te ne occupi tu, finisce fra le esclusioni.",
      },
      {
        d: "Recupero il controtelaio vecchio o lo cambio: come lo scrivo?",
        r: "Con due voci a listino, recupero e controtelaio nuovo, e nel racconto dici quale fai su quali fori. Se lo decidi solo dopo aver smontato, dillo: la riga resta senza quantità e te la chiede.",
      },
      {
        d: "Le finestre sono fatte sulle misure del cliente. Può recedere lo stesso?",
        r: "Per i beni fatti su misura di regola il recesso non c'è, ma non vale se il contratto nasce da una tua visita non richiesta, e la posa resta un servizio. Il modulo di recesso è comunque sulla pagina di accettazione; i casi li spiega la guida sul [recesso dal preventivo accettato a casa](/guide/recesso-preventivo-accettato-a-casa).",
      },
      {
        d: "Vendo e poso le finestre per la sede di un'azienda. La fattura va senza IVA?",
        r: "Di solito no: se vendi il serramento e la posa è accessoria, è una cessione di beni e l'IVA la metti tu, al 22% se non è un'abitazione. L'inversione contabile riguarda la sola posa di serramenti forniti da altri.",
      },
    ],
  },
};
