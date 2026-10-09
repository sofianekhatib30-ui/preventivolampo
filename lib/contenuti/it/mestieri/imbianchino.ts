import type { PaginaMestiere } from "../../tipi";

export const imbianchino: PaginaMestiere = {
  meta: {
    titolo: "Preventivo imbianchino in pochi minuti",
    descrizione:
      "Il preventivo imbianchino dal sopralluogo raccontato: pareti, soffitti, stuccature e antimuffa, con i prezzi del tuo listino. Il cliente accetta online.",
  },
  nome: "Imbianchino",
  riga: "Tinteggiature, preparazione dei muri, antimuffa, smalti su porte e termosifoni.",
  h1: "Preventivo imbianchino: misuri le stanze, lo racconti, e la bozza fa i conti",
  sottotitolo:
    "Pareti, soffitti, stuccature, rasature, colori e smalti. Giri l'appartamento con il metro, poi racconti stanza per stanza: la bozza usa solo i prezzi del tuo listino, porta le misure nell'unità delle tue voci e ti chiede quello che manca.",
  esempio: {
    titolo: "Stanza per stanza, come lo diresti a voce",
    intro:
      "Tre locali da ritinteggiare, con un angolo di muffa, qualche crepa e un soffitto che si sfoglia. A destra vedi come il sistema rifà i metri quadri dalle misure delle stanze, tiene la raschiatura su una riga sua, segna la cameretta come sola manodopera e ti chiede quante porte smaltare.",
    lavoro: "Appartamento da ritinteggiare, tre locali",
    dettatura:
      "Appunto per i Galli, appartamento di tre locali. Soggiorno quattro e mezzo per tre e ottanta, altezza normale: pareti e soffitto, due mani di idropittura bianca. In camera grande c'è la muffa nell'angolo della finestra, una fascia di un metro e mezzo più o meno: la tratto e ci do l'antimuffa. La cameretta la vogliono azzurra, la tinta l'ha già presa la signora, quindi lì solo manodopera. Nel corridoio ci sono delle crepe da stuccare, saranno una quindicina di metri di parete. Il soffitto del bagno va raschiato perché si stacca, è un due per due. Le porte interne da smaltare, quante non l'hanno ancora deciso. Copro pavimenti e mobili io. Spostare i mobili no, lo fanno loro prima che arrivi.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da imbianchino",
    intro:
      "Preparazione, pitture, smalti e protezioni: in tinteggiatura il preventivo si gioca su come separi queste righe. Il prezzo al metro quadro è il tuo e arriva dal tuo listino; una finitura particolare che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Protezione pavimenti e arredi", unita: "corpo", nota: "Teli, nastro, cartone. Scrivi se lo spostamento dei mobili è compreso o è del cliente." },
      { voce: "Raschiatura pittura esistente", unita: "m²", nota: "Quando la vecchia pittura si sfoglia o fa crosta. È la voce che il cliente tende a non vedere." },
      { voce: "Stuccatura crepe e fori", unita: "m", nota: "Crepe e cavillature a metro lineare. Per buchi isolati c'è chi preferisce il corpo." },
      { voce: "Rasatura pareti", unita: "m²", nota: "Per pareti rovinate o irregolari. Scrivi quante passate sono comprese." },
      { voce: "Fissativo isolante", unita: "m²", nota: "Il fondo prima della pittura, su muri nuovi, rasati o sfarinanti." },
      { voce: "Idropittura traspirante bianca", unita: "m²", nota: "Due mani, pareti o soffitti. Indica il prodotto o la linea, così il confronto è alla pari." },
      { voce: "Idropittura lavabile", unita: "m²", nota: "Per cucine, corridoi, camerette: più resistente, e il cliente deve sapere che è un'altra cosa." },
      { voce: "Tinteggiatura colorata", unita: "m²", nota: "La differenza rispetto al bianco: tinta, mani in più su colori scuri o coprenti." },
      { voce: "Tinteggiatura soffitti", unita: "m²", nota: "Tenuta separata dalle pareti, perché costa più fatica e spesso è l'unica cosa da fare." },
      { voce: "Trattamento antimuffa", unita: "m²", nota: "Pulizia, prodotto risanante e pittura antimuffa sulla zona colpita." },
      { voce: "Smaltatura porte interne", unita: "cad", nota: "Per anta, con o senza telaio: scrivilo, perché i telai portano via tempo." },
      { voce: "Verniciatura termosifoni", unita: "cad", nota: "A pezzo, con la preparazione. Se il radiatore va staccato, serve l'idraulico." },
      { voce: "Verniciatura ringhiere e inferriate", unita: "m", nota: "A metro lineare, con la spazzolatura della ruggine e l'antiruggine se servono." },
      { voce: "Paraspigoli", unita: "m", nota: "Sugli spigoli vivi di corridoi e ingressi, prima della rasatura." },
      { voce: "Pulizia finale", unita: "corpo", nota: "Togliere teli e nastro e lasciare la casa abitabile. Dire che è compresa costa poco e piace." },
      { voce: "Lavori in economia", unita: "h", nota: "Ritocchi, piccole riparazioni, lavori che non si possono misurare prima." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da imbianchino",
    intro:
      "In tinteggiatura la parte che si discute non è quasi mai la pittura: è la preparazione, e il modo in cui hai contato i metri. Scriverlo bene ti risparmia la telefonata del cliente con il metro in mano.",
    punti: [
      {
        titolo: "Come misuri",
        testo:
          "Vuoto per pieno o togliendo porte e finestre: decidi tu, ma scrivilo nel nome della voce o nell'avviso in fondo al preventivo. Un cliente che rifà i conti con un altro metodo trova sempre una differenza, e senza una riga scritta pensa che l'hai gonfiata.",
      },
      {
        titolo: "La preparazione su righe sue",
        testo:
          "Raschiatura, stuccatura, rasatura, fissativo. Se le infili nel prezzo al metro della pittura, il tuo preventivo sembra caro accanto a quello di chi dà una mano sopra lo sporco. Tenute a parte, il cliente vede la differenza fra i due lavori.",
      },
      {
        titolo: "Bianco, colore e numero di colori",
        testo:
          "Il colore costa più del bianco, e una stanza con due tinte costa più di una stanza con una. Tieni nel listino la voce colorata separata, e scrivi quante tinte sono comprese per stanza.",
      },
      {
        titolo: "La pittura comprata dal cliente",
        testo:
          "Se la tinta la porta lui, la riga diventa solo manodopera. Scrivi che la quantità di pittura è a carico suo: se a metà parete finisce il secchio, il tempo perso non è colpa tua.",
      },
      {
        titolo: "Muffa: il trattamento non è la cura",
        testo:
          "L'antimuffa sistema la parete, non l'umidità che la produce. Scrivilo in chiaro sul preventivo: se la causa è un ponte termico o un'infiltrazione, la muffa torna, e il cliente deve saperlo prima.",
      },
      {
        titolo: "Mobili, porte e termosifoni",
        testo:
          "Spostare i mobili, staccare i termosifoni, smontare le porte: sono tre cose che il cliente dà per scontate. Per ognuna scrivi se è tua, se è sua o se la fa un altro artigiano.",
      },
    ],
  },
  documenti: {
    titolo: "Pratiche, prodotti e IVA nella tinteggiatura",
    intro:
      "Un imbianchino non rilascia certificati di impianto, ma qualche regola vale anche per lui. Queste sono quelle che tornano più spesso nei lavori dentro casa.",
    punti: [
      {
        titolo: "Dentro casa non servono pratiche",
        testo:
          "Rifacimento, riparazione e tinteggiatura degli intonaci interni sono edilizia libera, secondo il glossario del DM 2 marzo 2018. Per una tinteggiatura interna, di regola, non serve nessuna pratica in Comune.",
      },
      {
        titolo: "Le facciate sono un'altra cosa",
        testo:
          "Fuori, nelle zone con vincolo paesaggistico, la tinteggiatura non richiede autorizzazione solo se rispetta l'eventuale piano del colore del Comune e le caratteristiche esistenti; se le cambia può servire l'autorizzazione paesaggistica semplificata (DPR 31/2017). Prima di cambiare colore a una facciata, scrivi che le autorizzazioni sono del cliente.",
      },
      {
        titolo: "COV sull'etichetta",
        testo:
          "Il D.Lgs. 161/2006 obbliga a scrivere sull'etichetta di pitture e vernici la sottocategoria del prodotto, il suo valore limite e il contenuto massimo di composti organici volatili. Per chi ha bambini o allergie è un'informazione che conta: indicare il prodotto nel preventivo gli permette di controllarla.",
      },
      {
        titolo: "Pitture e IVA",
        testo:
          "Ritinteggiare un appartamento è manutenzione ordinaria, e su un'abitazione l'IVA è di regola al 10%. Pitture e smalti non sono fra i beni significativi del DM 29/12/1999, che è un elenco chiuso, quindi qui non c'è nessuna divisione da fare. Se la pittura la compra il cliente in negozio, la paga con l'IVA del negozio, e tu fatturi la tua prestazione.",
      },
      {
        titolo: "Uffici, negozi e imprese edili",
        testo:
          "Se ridipingi un ufficio per un'azienda o lavori per l'impresa che segue il cantiere, la tinteggiatura rientra nei lavori di completamento degli edifici, e di regola la fattura esce senza IVA: la applica il cliente con l'inversione contabile (DPR 633/1972, art. 17, comma 6, e circolare 14/E del 2015). Il sistema oggi non la calcola ancora: per questi lavori controlla il totale prima di mandarlo.",
      },
    ],
    avvertenza:
      "Prendi queste righe come una traccia, non come la risposta di un consulente. Ogni lavoro e ogni cliente hanno i loro casi particolari, e le regole vengono aggiornate: chiedi conferma al commercialista prima di decidere.",
  },
  straniero: {
    titolo: "Se il cliente è straniero",
    testo:
      "L'inquilino straniero che deve riconsegnare casa tinteggiata, il proprietario che vive fuori e rinfresca l'appartamento prima di affittarlo: vogliono sapere subito quanto costa e cosa è compreso. Il preventivo può arrivargli in inglese, tedesco, francese, spagnolo o olandese, con parole come «rasatura» o «idropittura» rese nella sua lingua, l'italiano che fa fede e il modulo di recesso tradotto. Tu continui a lavorare in italiano.",
  },
  domande: {
    titolo: "Domande dagli imbianchini",
    voci: [
      {
        d: "Prendo le misure delle stanze a occhio. Come diventano metri quadri?",
        r: "Dille come le prendi, «quattro e mezzo per tre e ottanta». Il sistema porta la misura nell'unità della tua voce di listino; se manca un dato che serve per la quantità, come l'altezza, non lo inventa e ti fa una domanda. Le quantità le vedi tutte prima di approvare.",
      },
      {
        d: "Calcolo vuoto per pieno. Il cliente lo capisce?",
        r: "Se glielo scrivi, sì. Se misuri sempre così, mettilo nell'avviso in fondo al preventivo, nei dati dell'impresa: compare su ogni PDF. Per un lavoro solo, scrivilo nel nome della voce, per esempio «idropittura bianca, due mani, vuoto per pieno». Le note della bozza invece restano a te.",
      },
      {
        d: "La muffa può tornare. Come lo scrivo senza spaventare il cliente?",
        r: "Con una frase semplice sul preventivo, per esempio che il trattamento non elimina le cause dell'umidità. Aggiungila nella bozza al nome della voce dell'antimuffa, o tienila fissa nell'avviso in fondo al preventivo. Le note della bozza il cliente non le vede.",
      },
      {
        d: "Basta scrivere «tinteggiatura» o devo dire che pittura uso?",
        r: "Conviene dirlo. Tieni nel listino voci diverse per traspirante, lavabile, antimuffa e colorata: quando racconti «lavabile in cucina», la bozza prende quella voce e il cliente vede cosa sta comprando.",
      },
      {
        d: "Mi chiedono anche la facciata. Cosa cambia nel preventivo?",
        r: "Cambiano le voci e le esclusioni. Tieni a listino la tinteggiatura esterna separata da quella interna, e nel racconto di' chi porta il ponteggio e chi chiede eventuali autorizzazioni: se non sono tue, finiscono fra le esclusioni.",
      },
      {
        d: "Il cliente vuole due colori nella stessa stanza. Come lo prezzo?",
        r: "Con una voce a listino per la tinta in più, a metro quadro o a corpo per stanza. Nel racconto di' quale parete va colorata e quanto misura: la riga del colore esce separata da quella del bianco.",
      },
      {
        d: "Smalto le porte interne: le conto per anta o con il telaio?",
        r: "Come preferisci, ma tieni due voci a listino, anta sola e anta con telaio, perché i telai portano via tempo. Nel racconto di' quale delle due fai, e la bozza prende quella.",
      },
    ],
  },
};
