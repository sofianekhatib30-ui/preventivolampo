import type { PaginaMestiere } from "../../tipi";

export const impresa: PaginaMestiere = {
  meta: {
    titolo: "Preventivo ristrutturazione per imprese edili",
    descrizione:
      "Bagno chiavi in mano o appartamento intero: racconti il cantiere e il preventivo lavori edili esce voce per voce, con i prezzi del tuo listino.",
  },
  nome: "Impresa edile",
  riga: "Ristrutturazioni complete, bagno chiavi in mano, appartamento intero, più squadre in un solo preventivo.",
  h1: "Preventivo ristrutturazione: tutto il cantiere in una bozza, col tuo listino",
  sottotitolo:
    "Impianti, finiture, serramenti, oneri del cantiere e lavorazioni delle squadre che coordini. Racconti il sopralluogo stanza per stanza: la bozza mette insieme le voci con i prezzi del tuo listino e ti chiede quello che il cliente non ha ancora deciso.",
  esempio: {
    titolo: "Un cantiere intero, raccontato a voce",
    intro:
      "Un bagno chiavi in mano, una camera e le spese di cantiere, ricapitolati dal titolare all'uscita. A destra vedi le lavorazioni di più squadre messe in una bozza sola, il cassone su una riga sua, la rubinetteria della cliente come solo montaggio e le domande su quello che i clienti non hanno ancora deciso.",
    lavoro: "Bagno chiavi in mano e camera, appartamento",
    dettatura:
      "Ricapitolo il cantiere della famiglia Moretti. Bagno chiavi in mano: impianto idraulico nuovo, pavimento e rivestimenti, il bagno è circa due e mezzo per due. Piatto doccia a filo, vaso e bidet sospesi. La rubinetteria l'ha scelta e comprata la signora, noi la montiamo. In camera tinteggiamo pareti e soffitto, una cinquantina di metri. Cambiamo la finestra della camera, una e venti per uno e quaranta. Cassone per le macerie in cortile, è un terzo piano senza ascensore. Cambiamo anche le porte interne delle altre stanze, laccate bianche: quante non l'hanno ancora deciso. Il condizionatore lo fa il loro tecnico, è escluso.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo di ristrutturazione",
    intro:
      "Oltre alle lavorazioni delle squadre, un'impresa scrive le spese del cantiere e la propria regia: sono le righe che il cliente confronta di più fra due offerte. I prezzi di vendita sono i tuoi e arrivano dal tuo listino; una lavorazione che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Allestimento cantiere", unita: "corpo", nota: "Accessi, protezioni, allacci provvisori, attrezzature. Si mette una volta, all'inizio." },
      { voce: "Oneri della sicurezza", unita: "corpo", nota: "Su una riga propria, così il cliente li vede e non li confonde con il tuo margine." },
      { voce: "Protezione parti comuni", unita: "corpo", nota: "Scale, ascensore, androne del condominio: teli, cartoni, pulizia durante i lavori." },
      { voce: "Cassone per macerie", unita: "cad", nota: "Con trasporto e svuotamento. Se serve occupare il suolo pubblico, scrivi chi chiede il permesso." },
      { voce: "Rifacimento bagno completo", unita: "corpo", nota: "La voce chiavi in mano: elenca nel nome della voce cosa comprende, così il corpo non resta un mistero." },
      { voce: "Rifacimento impianto idrico-sanitario", unita: "corpo", nota: "Bagno o cucina, eseguito dalla tua squadra o da un idraulico di fiducia: per il cliente è una riga." },
      { voce: "Rifacimento impianto elettrico", unita: "corpo", nota: "Appartamento o singole stanze, con la dichiarazione di conformità dell'installatore." },
      { voce: "Fornitura e posa sanitari sospesi", unita: "cad", nota: "Per l'IVA sono beni significativi nella manutenzione: vedi più sotto." },
      { voce: "Montaggio rubinetteria", unita: "cad", nota: "Quando la rubinetteria la compra il cliente: solo posa." },
      { voce: "Fornitura e posa porta interna", unita: "cad", nota: "Indica il tipo: battente, scorrevole a scomparsa, laccata, tamburata." },
      { voce: "Fornitura e posa pavimenti e rivestimenti", unita: "m²", nota: "Con la fascia del materiale considerato: è la scelta del cliente che cambia di più il totale." },
      { voce: "Tinteggiatura pareti e soffitti", unita: "m²", nota: "Scrivi quante mani e se le rasature sono comprese." },
      { voce: "Sostituzione serramento esterno", unita: "cad", nota: "Finestre e portefinestre. Bene significativo per l'IVA: tienilo su una riga separata." },
      { voce: "Direzione e coordinamento del cantiere", unita: "corpo", nota: "Il tuo lavoro di regia: ordini, squadre, tempi, sopralluoghi. Se lo fai pagare, dagli una riga." },
      { voce: "Pratiche e tecnico", unita: "corpo", nota: "Pratica edilizia, direzione lavori, coordinatore della sicurezza. Se li paga il cliente a parte, vanno fra le esclusioni." },
      { voce: "Pulizia di fine cantiere", unita: "corpo", nota: "La pulizia grossa prima di riconsegnare le chiavi." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza una ristrutturazione",
    intro:
      "In un cantiere con più mestieri il rischio non è sbagliare un prezzo, è dimenticare una riga. Il cliente confronta il tuo totale con quello di un'altra impresa, e vince chi ha scritto meglio cosa c'è dentro e cosa no.",
    punti: [
      {
        titolo: "Un totale, tante squadre",
        testo:
          "Il cliente vuole un numero solo, e va bene. Ma sotto lascia le lavorazioni: quando a metà cantiere cambia piastrella o rinuncia alla vasca, ragioni su una riga e non su tutto il preventivo.",
      },
      {
        titolo: "Le spese che non si vedono",
        testo:
          "Allestimento, protezioni, cassone, pulizie, oneri della sicurezza. Nascoste dentro le singole voci gonfiano ogni prezzo senza spiegazione; su righe proprie il cliente capisce che sono costi del cantiere, non ricarichi.",
      },
      {
        titolo: "Il prezzo delle squadre esterne",
        testo:
          "Se idraulico ed elettricista sono artigiani di fiducia, quello che paghi tu non è il prezzo per il cliente: dentro c'è il tuo coordinamento e la tua garanzia. Nel listino tieni il prezzo di vendita, non quello d'acquisto.",
      },
      {
        titolo: "I materiali scelti dopo",
        testo:
          "Pavimenti, sanitari, porte: spesso il cliente li sceglie a lavori iniziati. Scrivi la fascia o il modello che hai considerato, e sotto le voci che una scelta diversa cambia il prezzo di quella riga, non di tutto il resto.",
      },
      {
        titolo: "Cosa resta fuori dall'appalto",
        testo:
          "Tecnico, pratiche, arredi, elettrodomestici, condizionatori: in una ristrutturazione l'elenco di quello che non c'è conta quanto quello che c'è. Scritto sotto le voci, evita il classico «pensavo fosse compreso».",
      },
      {
        titolo: "Le decisioni rimandate",
        testo:
          "Quante porte cambiare, doccia o vasca, il colore delle pareti: se il cliente non ha deciso, il sistema non inventa un numero. Ti arriva una domanda sulla quantità, oppure la cosa finisce nelle note per te, da sistemare prima di approvare. Meglio una cosa in sospeso che un numero inventato dentro un totale.",
      },
    ],
  },
  documenti: {
    titolo: "Pratiche, sicurezza e IVA in un cantiere di ristrutturazione",
    intro:
      "Quando l'impresa prende tutto il lavoro, il cliente si aspetta che sappia anche cosa serve prima, durante e dopo. Queste sono le cose che tornano più spesso nelle ristrutturazioni di casa.",
    punti: [
      {
        titolo: "Il titolo edilizio",
        testo:
          "Spostare pareti o aprire porte interne senza toccare le strutture è manutenzione straordinaria con CILA (art. 6-bis del DPR 380/2001); per gli interventi più pesanti il titolo lo indica il tecnico. Nella comunicazione vanno i dati dell'impresa esecutrice: chiarisci nel preventivo chi incarica e paga il tecnico.",
      },
      {
        titolo: "Più imprese nello stesso cantiere",
        testo:
          "Se in cantiere lavorano più imprese, anche in momenti diversi, il committente deve nominare il coordinatore per la sicurezza (art. 90 del D.Lgs. 81/2008) e trasmettere la notifica preliminare (art. 99). Con una sola impresa la notifica serve dai 200 uomini-giorno in su. Dirlo prima evita che il cliente lo scopra a lavori avviati.",
      },
      {
        titolo: "Patente a crediti, anche per chi porti",
        testo:
          "Tu e le imprese o gli artigiani che lavorano in cantiere dovete avere la patente a crediti (art. 27 del D.Lgs. 81/2008), salvo le esclusioni previste. Il committente la verifica anche per i subappaltatori, quindi conviene avere pronti i dati di tutti.",
      },
      {
        titolo: "Congruità della manodopera",
        testo:
          "Nei lavori edili privati di valore pari o superiore alla soglia fissata dal DM 143/2021, prima del saldo finale serve l'attestazione di congruità della manodopera, rilasciata dalla Cassa Edile su richiesta dell'impresa affidataria o del committente. Nei cantieri grandi tienine conto quando fissi il saldo.",
      },
      {
        titolo: "Contratto collettivo e detrazioni",
        testo:
          "Se il cliente usa le detrazioni per lavori sopra la soglia della legge 234/2021 (art. 1, comma 43-bis), l'atto di affidamento deve dire che i lavori edili sono eseguiti applicando i contratti collettivi del settore edile, e l'indicazione va anche in fattura. Senza quella frase nel contratto il cliente rischia l'agevolazione.",
      },
      {
        titolo: "IVA: manutenzione o ristrutturazione",
        testo:
          "In un cantiere completo la qualifica dell'intervento decide l'IVA. Se è manutenzione ordinaria o straordinaria di un'abitazione, il 10% vale con il limite dei beni significativi del DM 29/12/1999, fra cui sanitari e rubinetteria, infissi, caldaie e condizionatori: la bozza ti chiede il valore di ogni bene segnato e divide fra 10% e 22%. Se il tecnico l'ha qualificata come restauro, risanamento conservativo o ristrutturazione edilizia, l'appalto va al 10% senza quel calcolo. Le fatture dei tuoi subappaltatori edili ti arrivano in inversione contabile; se invece sei tu a lavorare in subappalto, il sistema oggi non la calcola ancora, quindi controlla il totale prima di mandarlo.",
      },
    ],
    avvertenza:
      "È un riassunto per non dimenticare niente, non un parere tecnico o fiscale: sul tuo cantiere decidono il progettista, il coordinatore e il commercialista, e queste regole vengono aggiornate spesso.",
  },
  straniero: {
    titolo: "Il cantiere di un cliente straniero",
    testo:
      "Chi vive all'estero e compra casa qui cerca un'impresa che prenda tutto il cantiere, perché non può coordinare le squadre da lontano. A lui serve un preventivo unico che capisca riga per riga: in inglese, tedesco, francese, spagnolo o olandese, con oneri e lavorazioni tradotti, l'italiano che fa fede e il modulo di recesso nella sua lingua. Lo accetta dal link, senza dover venire a firmare.",
  },
  domande: {
    titolo: "Domande dalle imprese edili",
    voci: [
      {
        d: "Nel cantiere lavorano idraulico ed elettricista esterni. Le loro voci vanno nel mio preventivo?",
        r: "Sì, se il contratto con il cliente lo fai tu. Metti nel listino le loro lavorazioni al tuo prezzo di vendita: quando racconti il bagno, quelle righe entrano insieme alle altre, e il cliente riceve un preventivo unico.",
      },
      {
        d: "Il cliente vuole un prezzo chiavi in mano per il bagno. Posso tenere una voce sola?",
        r: "Sì, se nel listino hai la voce a corpo. Scrivi nel nome della voce quello che comprende e quello che no, così il cliente non immagina dentro più cose di quelle che hai messo.",
      },
      {
        d: "Gli oneri della sicurezza li metto su una riga a parte?",
        r: "Puoi tenerli come voce fissa nel listino e dirli nel racconto, «più gli oneri della sicurezza». Una riga separata fa capire al cliente cosa sta pagando, e il resto delle voci non sembra gonfiato.",
      },
      {
        d: "Il cliente deve ancora scegliere pavimenti e sanitari. Faccio il preventivo lo stesso?",
        r: "Sì. Dici cosa hai considerato, per esempio «gres di fascia media, sanitari sospesi standard», e controlli che stia nel nome delle voci: è quello che il cliente legge sul PDF. Le note della bozza restano a te. Se manca una quantità, ti torna come domanda e la completi quando il cliente decide.",
      },
      {
        d: "Manutenzione straordinaria o ristrutturazione: chi decide cosa rispondere al sistema?",
        r: "La qualifica viene dal titolo edilizio, quindi chiedila al tecnico che segue la pratica. Poi rispondi alla domanda sul tipo di intervento: con ristrutturazione l'IVA esce al 10% senza il calcolo dei beni significativi, con manutenzione la bozza ti chiede il valore di infissi e sanitari segnati nel listino.",
      },
      {
        d: "In cantiere entrano altre imprese. Lo devo dire al cliente nel preventivo?",
        r: "Conviene. Con più imprese il cliente deve nominare il coordinatore per la sicurezza e mandare la notifica preliminare: se non te ne occupi tu, dillo nel racconto come esclusione, «coordinatore della sicurezza a carico del committente».",
      },
      {
        d: "Il preventivo esce con il logo dell'impresa?",
        r: "Sì, il PDF porta il tuo logo. Il cliente lo riceve con il link per accettarlo online, e tu vedi quando lo apre e quando lo accetta.",
      },
    ],
  },
};
