import type { PaginaMestiere } from "../../tipi";

export const idraulico: PaginaMestiere = {
  meta: {
    titolo: "Preventivo idraulico a voce, col tuo listino",
    descrizione:
      "Il preventivo idraulico per bagni, cucine e scarichi: racconti il sopralluogo, la bozza usa solo i prezzi del tuo listino e il cliente accetta dal link.",
  },
  nome: "Idraulico",
  riga: "Bagni da rifare, punti acqua e scarico, sanitari, perdite e attacchi in cucina.",
  h1: "Preventivo idraulico: esci dal bagno del cliente e la bozza è già pronta",
  sottotitolo:
    "Rifacimenti di bagni, spostamenti in cucina, scarichi, perdite. Racconti quello che hai visto mentre è ancora fresco, anche dettandolo al telefono: i prezzi arrivano solo dal tuo listino, e quello che non hai detto torna indietro come domanda.",
  esempio: {
    titolo: "Dal sopralluogo alla bozza",
    intro:
      "Un bagno da rifare con la vasca che diventa doccia, più due ritocchi in cucina e in lavanderia. A destra trovi come il sistema conta gli attacchi, mette a metro lo scarico fino alla colonna, tiene come sola posa i sanitari presi dalla cliente e ti chiede quanti attacchi servono in lavanderia.",
    lavoro: "Bagno da rifare, ritocchi in cucina e lavanderia",
    dettatura:
      "Dunque, casa della signora Ferrari. Il bagno si rifà tutto: smonto i sanitari vecchi e tolgo la vasca, al posto della vasca va un piatto doccia ottanta per centoventi. Rifaccio carico e scarico per lavabo, vaso, bidet e doccia, quindi quattro attacchi. Lo scarico va rifatto fino alla colonna, saranno sei metri abbondanti. Vaso e bidet sospesi, con la rubinetteria, li ha già comprati lei: io li monto e metto i telai. In cucina sposto il lavello di un metro e mezzo verso la finestra. In lavanderia vuole gli attacchi per lavatrice e forse asciugatrice, quanti non l'ha ancora deciso. Piastrelle e ripristini dei muri li fa il piastrellista, non sono miei.",
  },
  voci: {
    titolo: "Le voci che tornano in un preventivo da idraulico",
    intro:
      "Dal punto acqua al telaio del sanitario sospeso, sono le righe con cui si scompone un bagno o una cucina. Il prezzo di ogni attacco è il tuo e arriva dal tuo listino; un pezzo speciale che a listino non hai resta da prezzare.",
    righe: [
      { voce: "Smontaggio sanitari esistenti", unita: "cad", nota: "Vaso, bidet, lavabo: a pezzo. Scrivi se il trasporto in discarica è compreso." },
      { voce: "Rimozione vasca da bagno", unita: "cad", nota: "Una vasca murata non è una vasca appoggiata: se lo sai già, scrivilo nel nome della voce." },
      { voce: "Punto acqua calda e fredda", unita: "cad", nota: "Il carico per ogni utenza, dal collettore o dalla dorsale fino all'attacco." },
      { voce: "Punto scarico", unita: "cad", nota: "Lo scarico di ogni utenza fino alla tubazione principale del bagno." },
      { voce: "Tubazione di scarico fino alla colonna", unita: "m", nota: "Il tratto che porta alla colonna condominiale. Si conta a metro, con pezzi speciali e pendenza." },
      { voce: "Collettore di distribuzione sanitaria", unita: "cad", nota: "Con le valvole per ogni utenza: chi lo vuole ne capisce il valore se lo vede in una riga a parte." },
      { voce: "Posa piatto doccia", unita: "cad", nota: "Con piletta e collegamento allo scarico. Il box doccia di solito è un'altra voce." },
      { voce: "Telaio per sanitari sospesi con cassetta a incasso", unita: "cad", nota: "Il pezzo che regge vaso o bidet sospesi. Va murato o chiuso in parete: scrivi chi lo fa." },
      { voce: "Posa vaso e bidet sospesi", unita: "cad", nota: "Solo posa quando i sanitari li compra il cliente." },
      { voce: "Posa lavabo con sifone", unita: "cad", nota: "Lavabo appoggiato, sospeso o su mobile: il mobile da montare conviene tenerlo a parte." },
      { voce: "Posa miscelatore", unita: "cad", nota: "Lavabo, bidet, doccia, lavello. Per l'IVA la rubinetteria da bagno è un bene significativo." },
      { voce: "Attacco lavatrice o lavastoviglie", unita: "cad", nota: "Carico, scarico e rubinetto d'arresto." },
      { voce: "Spostamento lavello cucina", unita: "corpo", nota: "Carico e scarico portati nella nuova posizione. Se lo spostamento è lungo, meglio a metro." },
      { voce: "Rubinetto d'arresto", unita: "cad", nota: "Per chiudere un'utenza o un bagno senza chiudere tutta la casa." },
      { voce: "Ricerca perdite", unita: "h", nota: "Quando non sai dove sia la perdita finché non apri. Il ripristino va a parte." },
      { voce: "Disostruzione scarico", unita: "h", nota: "Lavandini, docce, colonne: a ore, con l'attrezzatura specificata se la fai pagare." },
      { voce: "Dichiarazione di conformità impianto idrico", unita: "corpo", nota: "Con la relazione sui materiali usati. Se è compresa nel prezzo, scrivilo." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da idraulico",
    intro:
      "Ogni idraulico ha il suo modo di fare i conti. Quello che salva da una discussione a fine lavoro è che il cliente veda cosa c'è dentro ogni riga e cosa ne resta fuori.",
    punti: [
      {
        titolo: "A punto acqua e a punto scarico",
        testo:
          "Nei bagni il modo più chiaro è contare gli attacchi: carico e scarico per ogni utenza. Scrivi da dove parte il punto (collettore, dorsale, colonna), perché un punto lontano dallo scarico non costa come uno vicino.",
      },
      {
        titolo: "Il bagno a corpo, ma con il dettaglio sotto",
        testo:
          "Il cliente chiede «quanto viene il bagno?» e vuole un numero solo. Daglielo, ma tieni le righe: quando a metà lavoro decide di aggiungere il bidet o di spostare la doccia, sai subito di quanto cambia il conto.",
      },
      {
        titolo: "Sanitari e rubinetti del cliente",
        testo:
          "Se li compra lui, la riga diventa solo posa. Scrivi anche che i pezzi mancanti o arrivati rotti non sono a tuo carico: con i sanitari presi in rete capita più di quanto il cliente immagini.",
      },
      {
        titolo: "Le opere murarie",
        testo:
          "Rompere per arrivare ai tubi è spesso tuo, chiudere e rifare piastrelle quasi mai. Mettilo fra le esclusioni con il nome di chi lo fa, così il cliente non pensa che il ripristino sia compreso.",
      },
      {
        titolo: "Perdite e urgenze",
        testo:
          "Una perdita non si sa quanto costa finché non la trovi. Prezzala a ore, con l'uscita a parte se la fai pagare, e scrivi che il ripristino di muri e pavimenti si valuta dopo.",
      },
      {
        titolo: "Smaltimento",
        testo:
          "Vasca, sanitari e tubi vecchi vanno portati via. Se dici solo «li porto via io», il trasporto resta compreso nella rimozione. Se vuoi una riga a parte, tieni la voce nel listino e di' la quantità: «un metro cubo di macerie da portare in discarica».",
      },
    ],
  },
  documenti: {
    titolo: "Documenti, pratiche e IVA nei lavori idraulici",
    intro:
      "Le cose che un cliente attento ti chiede, o che è meglio dire prima che le chieda. Valgono per i lavori idraulici nelle case.",
    punti: [
      {
        titolo: "Dichiarazione di conformità",
        testo:
          "Gli impianti idrici e sanitari rientrano nel DM 37/2008. Finito il lavoro, l'impresa installatrice rilascia al committente la dichiarazione di conformità, con la relazione sui materiali impiegati e il progetto. Per un impianto di casa il progetto non deve farlo per forza un professionista iscritto all'albo: può redigerlo il responsabile tecnico dell'impresa.",
      },
      {
        titolo: "Bagno rifatto o bagno nuovo",
        testo:
          "Rinnovare o sostituire l'impianto idrico-sanitario esistente e i sanitari rientra nell'edilizia libera, secondo il glossario del DM 2 marzo 2018. Realizzare un bagno dove prima non c'era è invece manutenzione straordinaria (DPR 380/2001, art. 3) e serve una pratica in Comune. Se la pratica non è tua, scrivilo fra le esclusioni.",
      },
      {
        titolo: "Sanitari, rubinetteria e IVA",
        testo:
          "Il bagno rifatto in un'abitazione è di regola manutenzione, al 10%. Sanitari e rubinetteria da bagno però sono beni significativi del DM 29/12/1999: se il loro valore supera quello di tutto il resto del lavoro, la differenza va al 22%, e in fattura il loro valore va indicato a parte. Se nel listino sono segnati come beni significativi, la bozza ti chiede quanto vale il bene dentro ogni riga e con quel dato divide l'IVA.",
      },
      {
        titolo: "Se i sanitari li compra il cliente",
        testo:
          "Per l'Agenzia delle Entrate (circolare 15/E del 2018) il 10% sui beni significativi vale solo quando li fornisce chi fa il lavoro. Se il cliente li compra da solo, li paga con l'aliquota ordinaria del negozio, e tu fatturi la posa.",
      },
      {
        titolo: "Impianti per clienti con partita IVA",
        testo:
          "Se rifai l'impianto idraulico di un ufficio, di un bar o di un'impresa che ristruttura, di regola si applica l'inversione contabile (DPR 633/1972, art. 17, comma 6): la fattura esce senza IVA e la applica il cliente. Con un privato no. Il sistema oggi calcola il 10%, il 22% e la divisione dei beni significativi; l'inversione contabile non ancora, quindi in questi casi controlla il totale prima di mandarlo.",
      },
    ],
    avvertenza:
      "Sono indicazioni per orientarti, non una consulenza fiscale o tecnica: ogni lavoro ha i suoi dettagli, e le regole cambiano. Prima di applicarle a un caso vero, sentile confermare dal tuo commercialista.",
  },
  straniero: {
    titolo: "Quando il cliente parla un'altra lingua",
    testo:
      "Il proprietario che vive all'estero e affitta l'appartamento ti chiama per una perdita e vuole il preventivo prima di autorizzare il lavoro; la famiglia straniera che ha appena comprato casa vuole rifare il bagno. Il preventivo può arrivargli in inglese, tedesco, francese, spagnolo o olandese, con attacchi e sanitari tradotti voce per voce, l'italiano che fa fede e il modulo di recesso nella sua lingua. Tu lo approvi in italiano.",
  },
  domande: {
    titolo: "Domande dagli idraulici",
    voci: [
      {
        d: "Rifaccio un bagno intero. Meglio un prezzo a corpo o voce per voce?",
        r: "Puoi fare tutte e due le cose: racconti il bagno pezzo per pezzo e nella bozza trovi le righe con le quantità. Se nel tuo listino hai una voce «rifacimento bagno» a corpo, la usi; altrimenti tieni il dettaglio, che serve anche quando il cliente cambia idea a metà lavoro.",
      },
      {
        d: "Il cliente ha comprato vaso, bidet e miscelatori in rete. Cosa cambia nel preventivo?",
        r: "Dillo nel racconto, per esempio «i sanitari li ha comprati lei». Le righe diventano solo posa, senza fornitura. Che pezzi mancanti o difettosi non sono a carico tuo scrivilo nel nome delle voci di posa, così il cliente lo legge sul PDF.",
      },
      {
        d: "Dico «sei metri abbondanti» di scarico. Cosa finisce nella bozza?",
        r: "Una riga a metro con la quantità che hai detto, nell'unità della tua voce di listino. La misura detta a spanne la vedi scritta, la correggi se serve e solo dopo approvi.",
      },
      {
        d: "Ho in mano il listino del grossista, non il mio. Posso caricare quello?",
        r: "Il sistema usa i prezzi che carichi, e solo quelli: se carichi i prezzi di acquisto, nel preventivo vanno quelli. Meglio caricare il listino con i tuoi prezzi di vendita, anche da una foto se è su carta, e controllare le voci prima di usarle.",
      },
      {
        d: "Il cliente è un'impresa che ristruttura. Devo mettere l'IVA?",
        r: "Spesso no: fra soggetti con partita IVA, per gli impianti negli edifici, si applica l'inversione contabile. Oggi il sistema non la calcola ancora, quindi con un cliente impresa controlla il totale con il commercialista prima di mandare il preventivo.",
      },
      {
        d: "Il bagno nuovo va dove prima c'era un ripostiglio. Lo scrivo nel preventivo?",
        r: "Sì, perché è manutenzione straordinaria e serve una pratica in Comune. Se la segue il tecnico del cliente, dillo nel racconto, «la pratica la fa il suo geometra»: finisce fra le esclusioni sotto le voci.",
      },
      {
        d: "Sposto il lavello di un metro e mezzo. Lo prezzo a corpo o a metro?",
        r: "Come lo hai nel listino. Se la voce di spostamento è a corpo, la riga esce da uno; se è a metro, la misura detta nel racconto diventa la quantità. Per spostamenti lunghi la voce a metro evita di regalare il lavoro.",
      },
    ],
  },
};
