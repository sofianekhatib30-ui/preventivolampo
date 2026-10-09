import type { PaginaMestiere } from "../../tipi";

export const piastrellista: PaginaMestiere = {
  meta: {
    titolo: "Preventivo piastrellista: posa, massetto, fughe",
    descrizione:
      "Racconti metri di posa, massetto e battiscopa come li hai presi al sopralluogo: il preventivo piastrellista esce con i prezzi del tuo listino.",
  },
  nome: "Piastrellista",
  riga: "Posa a metro quadro, massetti, battiscopa, rivestimenti del bagno, demolizione del vecchio pavimento.",
  h1: "Preventivo piastrellista: dici i metri, la bozza fa i conti col tuo listino",
  sottotitolo:
    "Pavimenti, rivestimenti, massetti, battiscopa e scale. Racconti il sopralluogo con le misure che hai preso, anche a occhio: le stanze diventano metri quadri, il perimetro metri lineari, e i prezzi sono solo quelli che hai messo tu.",
  esempio: {
    titolo: "Due stanze raccontate, una bozza da controllare",
    intro:
      "Una cucina e un bagno da rifare, misurati a passi e raccontati sul pianerottolo. A destra vedi i metri quadri di pavimento ricavati dalla stanza, la parete del bagno calcolata fino a due metri, la posa del gres della cliente senza fornitura e la domanda sui profili che mancano.",
    lavoro: "Cucina e bagno, pavimenti e rivestimenti",
    dettatura:
      "Ecco, sono appena uscito dalla signora Esposito. In cucina tolgo il pavimento vecchio, la stanza è tre e venti per due e settanta, poi rasatura e posa del gres sessanta per sessanta, dritto. Le piastrelle le ha già prese lei, quindi solo posa. Battiscopa su tutto il giro della cucina, una dozzina di metri. In bagno demolisco il rivestimento fino a due metri d'altezza, il bagno è due per uno e ottanta. Il massetto del bagno va rifatto, cinque centimetri più o meno, poi guaina liquida nella doccia e pavimento e rivestimento nuovi. Profili in alluminio sugli spigoli, quanti ancora non lo so, devo vedere il disegno che vuole. Le macerie le porto via io. I sanitari non li tocco, li smonta e rimonta il suo idraulico.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da piastrellista",
    intro:
      "Demolizione, sottofondo, posa e finiture: un preventivo di pavimenti e rivestimenti si legge in quest'ordine. Il metro quadro di posa lo decidi tu per ogni formato e arriva dal tuo listino; una posa che non hai mai prezzato resta da prezzare.",
    righe: [
      { voce: "Demolizione pavimento esistente", unita: "m²", nota: "Scrivi se è compreso il sottofondo: cambia il lavoro e i sacchi da portare via." },
      { voce: "Demolizione rivestimento a parete", unita: "m²", nota: "Superficie di parete, fino all'altezza del vecchio rivestimento. Indica l'altezza." },
      { voce: "Massetto in sabbia e cemento", unita: "m²", nota: "Con lo spessore medio nella descrizione: un massetto alto non vale come uno da pochi centimetri." },
      { voce: "Rasatura autolivellante", unita: "m²", nota: "Per rimettere in piano un supporto vecchio prima della posa, anche sopra il pavimento esistente." },
      { voce: "Impermeabilizzazione con guaina liquida", unita: "m²", nota: "Docce, piatti a filo pavimento, balconi. Con le bandelle sugli angoli e sugli scarichi." },
      { voce: "Posa pavimento in gres porcellanato", unita: "m²", nota: "Specifica il formato: un sessanta per sessanta e una lastra grande non si posano nello stesso tempo." },
      { voce: "Posa in diagonale o a disegno", unita: "m²", nota: "Supplemento sulla posa dritta, per i tagli in più e lo sfrido." },
      { voce: "Posa rivestimento a parete", unita: "m²", nota: "Bagno e cucina. Scrivi se i vani di porte e finestre sono tolti dal conto." },
      { voce: "Fornitura piastrelle", unita: "m²", nota: "Solo se le compri tu. Indica se lo sfrido è compreso nella quantità." },
      { voce: "Stuccatura fughe epossidica", unita: "m²", nota: "A parte rispetto alla cementizia: costa di più in materiale e in tempo." },
      { voce: "Posa battiscopa", unita: "m", nota: "A metro lineare. Tagliato dalla stessa piastrella o già pronto: scrivilo." },
      { voce: "Profilo angolare in alluminio", unita: "m", nota: "Spigoli dei rivestimenti, bordi della doccia, gradini." },
      { voce: "Posa soglia o davanzale in pietra", unita: "cad", nota: "Pezzi tagliati su misura per porte e finestre." },
      { voce: "Rivestimento gradino", unita: "cad", nota: "Pedata e alzata insieme. Le scale si contano a gradino, non a metro quadro." },
      { voce: "Foro su piastrella", unita: "cad", nota: "Per scarichi e attacchi. Sul gres duro serve la fresa diamantata." },
      { voce: "Carico e smaltimento macerie", unita: "corpo", nota: "Trasporto e conferimento. Se lo fa un altro, va fra le esclusioni." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da piastrellista",
    intro:
      "Il metro quadro sembra un'unità semplice, ed è proprio per questo che nascono le discussioni: il cliente conta i metri della stanza, tu conti quelli da posare. Ecco dove conviene essere chiari.",
    punti: [
      {
        titolo: "Quale metro quadro",
        testo:
          "Per i rivestimenti scrivi se i vani di porte e finestre li togli dal conto o no. Per i pavimenti, se i metri sono quelli calpestabili o comprendono sotto i mobili fissi. È una frase sola e ti evita di rifare i conti a fine lavoro.",
      },
      {
        titolo: "Una voce per ogni tipo di posa",
        testo:
          "Grande formato, lastre sottili, mosaico, posa a spina o in diagonale: ogni posa ha i suoi tempi. Se nel listino hai una sola voce «posa pavimento», finisci per regalare il lavoro difficile o per far pagare troppo quello facile.",
      },
      {
        titolo: "Il supporto che non vedi",
        testo:
          "Quello che c'è sotto il pavimento vecchio lo scopri solo quando apri. Metti a preventivo il massetto o la rasatura se pensi che servano, e scrivi sotto le voci che i rifacimenti del sottofondo non previsti si contano a parte.",
      },
      {
        titolo: "Le piastrelle del cliente",
        testo:
          "Capita spesso che le scelga e le compri lui. La riga diventa solo posa: lo dici nel racconto e il sistema non mette la fornitura. Scrivi nel nome della voce di posa chi risponde se le scatole non bastano o arrivano con toni diversi.",
      },
      {
        titolo: "Demolire e portare via",
        testo:
          "Buttare giù il vecchio rivestimento è una voce, portare via i sacchi è un'altra. Se lo smaltimento è tuo mettilo come riga, se lo fa il cliente o l'impresa che ti chiama scrivilo fra le esclusioni.",
      },
      {
        titolo: "Le finiture che si dimenticano",
        testo:
          "Battiscopa, profili, soglie, fori per gli scarichi: sono a metro o a pezzo, e sono le righe che il cliente non si aspetta. Se le dici nel racconto entrano nella bozza con la loro unità e non le aggiungi dopo.",
      },
    ],
  },
  documenti: {
    titolo: "Pratiche, norme e IVA per chi posa",
    intro:
      "Per rifare un pavimento non servono molte carte, ma qualcuna sì. Queste sono le cose che conviene conoscere quando prepari un preventivo di posa in una casa.",
    punti: [
      {
        titolo: "Rifare i pavimenti interni",
        testo:
          "Riparare, sostituire o rinnovare la pavimentazione interna, compresi guaine e sottofondi, e i rivestimenti interni rientra nell'edilizia libera secondo il glossario del DM 2 marzo 2018. Se la posa fa parte di una ristrutturazione più ampia, la pratica la segue chi coordina il cantiere.",
      },
      {
        titolo: "La norma sulla posa",
        testo:
          "Per le piastrellature ceramiche a pavimento e a parete c'è la UNI 11493-1, con le istruzioni per progettazione, posa e manutenzione. Non è una legge, ma è il riferimento della posa fatta bene: citarla nel preventivo dice al cliente come lavori.",
      },
      {
        titolo: "Piastrelle e IVA",
        testo:
          "Rifare un pavimento o un rivestimento in un'abitazione è manutenzione, con l'IVA di regola al 10%. Le piastrelle non sono fra i beni significativi del DM 29/12/1999, quindi se le fornisci tu seguono l'aliquota del lavoro senza calcoli a parte. Se in un bagno fornisci anche sanitari e rubinetteria, quelli invece lo sono.",
      },
      {
        titolo: "Posa per un'impresa",
        testo:
          "Posare pavimenti in un negozio, in un ufficio o in subappalto per un'impresa edile è un lavoro di completamento dell'edificio: di regola si applica l'inversione contabile (art. 17, comma 6, lettera a-ter del DPR 633/1972), e l'IVA la applica il cliente. Il sistema oggi non la calcola ancora, quindi in questi casi controlla il totale prima di mandare il preventivo.",
      },
      {
        titolo: "Macerie",
        testo:
          "I rifiuti dei lavori di manutenzione si considerano prodotti presso la sede di chi fa il lavoro (art. 193, comma 19, del D.Lgs. 152/2006). Per quantità limitate il trasporto fino alla sede può avvenire con il documento di trasporto al posto del formulario. Scrivi nel preventivo se lo smaltimento è compreso.",
      },
    ],
    avvertenza:
      "Sono indicazioni generali per orientarti, non una consulenza: per il tuo caso senti il commercialista o un tecnico, anche perché regole e aliquote cambiano nel tempo.",
  },
  straniero: {
    titolo: "Pavimenti per chi parla un'altra lingua",
    testo:
      "Il proprietario che vive fuori e passa solo per scegliere le piastrelle, o chi rifà il bagno prima di affittare l'appartamento: vuole capire cosa paga senza un interprete. Il preventivo può partire in inglese, tedesco, francese, spagnolo o olandese, con massetto, fughe e battiscopa tradotti voce per voce e l'italiano che fa fede. Tu le voci le controlli in italiano.",
  },
  domande: {
    titolo: "Domande dai piastrellisti",
    voci: [
      {
        d: "Ho preso le misure della stanza, ma il rivestimento si conta in parete. Come faccio?",
        r: "Dici le misure come le hai prese, per esempio «bagno due per uno e ottanta, rivestimento fino a due metri». Il sistema rifà il conto nell'unità della tua voce, i metri quadri di parete, e prima di approvare lo controlli riga per riga.",
      },
      {
        d: "Non so ancora com'è messo il sottofondo. Lo metto o no?",
        r: "Mettilo come voce se pensi che servirà, oppure dillo come esclusione: «eventuale rifacimento del massetto escluso». Le esclusioni finiscono scritte in chiaro sotto le voci, e il cliente le legge prima di accettare.",
      },
      {
        d: "Ho prezzi diversi per il sessanta per sessanta e per il grande formato. Il sistema li distingue?",
        r: "Usa le voci del tuo listino così come le hai scritte. Se nel racconto dici il formato, la bozza prende la voce che corrisponde; se non la trova, la riga resta da prezzare, evidenziata, e scegli tu.",
      },
      {
        d: "Posso consigliare al cliente di prendere qualche scatola in più?",
        r: "Sì. Nella bozza aggiungilo al nome della voce di posa, per esempio «piastrelle della cliente, con una scatola in più per i tagli»: è il testo che il cliente legge sul PDF. Detto solo nel racconto finisce nelle note, che restano a te.",
      },
      {
        d: "Lavoro per un'impresa che porta via le macerie. Come tolgo lo smaltimento?",
        r: "Dici «macerie a carico dell'impresa». La voce dello smaltimento non entra nella bozza e la frase compare fra le esclusioni.",
      },
      {
        d: "Le scale le conto a gradino. Il sistema lo capisce?",
        r: "Sì, se nel listino la voce è a pezzo. Dici «quattordici gradini, pedata e alzata» e la riga esce a gradini. Se invece dai le misure in metri, la quantità viene rifatta nell'unità della voce, e la controlli prima di approvare.",
      },
      {
        d: "Poso sopra il pavimento vecchio senza demolire. Come lo scrivo?",
        r: "Tieni a listino la posa in sovrapposizione come voce sua, con la rasatura o il primer se servono, e nel racconto di' che non demolisci. Così non compare nessuna riga di demolizione, e il cliente capisce perché il prezzo è diverso da un rifacimento completo.",
      },
    ],
  },
};
