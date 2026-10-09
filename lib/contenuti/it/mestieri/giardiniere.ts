import type { PaginaMestiere } from "../../tipi";

export const giardiniere: PaginaMestiere = {
  meta: {
    titolo: "Preventivo giardiniere: prato, siepi e potature",
    descrizione:
      "Preventivo giardiniere dal tuo racconto: prato, siepi, potature, irrigazione, smaltimento del verde, coi prezzi del tuo listino. Il cliente accetta online.",
  },
  nome: "Giardiniere",
  riga: "Prato, siepi, potature, nuove piante, irrigazione e smaltimento del verde.",
  h1: "Preventivo giardiniere: giri il giardino, lo racconti, la bozza è pronta",
  sottotitolo:
    "Taglio del prato, siepi, potature, piantumazioni e impianti di irrigazione. Finito il giro del giardino lo racconti come lo diresti alla tua squadra: la bozza usa solo i prezzi del tuo listino e ti chiede le misure che non hai detto.",
  esempio: {
    titolo: "Dal giro del giardino alla bozza",
    intro:
      "Un giardino da sistemare per la primavera: prato, siepe, due ulivi, un pino secco e un'aiuola nuova. Accanto vedi il prato a metro quadro, la siepe a metro, gli alberi a pianta, le piante del cliente come sola messa a dimora e la domanda su quante piante andranno nell'aiuola.",
    lavoro: "Giardino di una casa singola, sistemazione di primavera",
    dettatura:
      "Giro fatto dal signor Gatti. Il prato è sui trecento metri quadri, va arieggiato e riseminato dove si è diradato. La siepe di lauro lungo la recinzione è una quarantina di metri, alta sui due metri, va potata su tre lati. Ci sono due ulivi da potare e un pino secco da abbattere, la ceppaia la fresiamo. Vicino al portico vuole un'aiuola nuova, più o meno quattro per due: le piante le ha già comprate lui al vivaio, noi prepariamo il terreno e le mettiamo a dimora. Poi l'irrigazione a goccia per l'aiuola, con la centralina; quante piante ci vanno non l'ha ancora deciso. Le ramaglie le portiamo via noi. Il pino del vicino che sporge non lo tocchiamo.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da giardiniere",
    intro:
      "Prato, siepi, alberi, aiuole e irrigazione: nel verde ogni lavoro ha la sua unità, e lo smaltimento pesa quanto il lavoro. Il prezzo è il tuo e arriva dal tuo listino; una potatura particolare che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Taglio del prato con raccolta dell'erba", unita: "m²", nota: "Scrivi se la raccolta e lo smaltimento sono compresi o se l'erba resta in loco." },
      { voce: "Arieggiatura del prato", unita: "m²", nota: "Con la raccolta del feltro. Il cliente spesso la confonde con il taglio." },
      { voce: "Trasemina del prato", unita: "m²", nota: "Seme e copertura compresi. Scrivi che l'attecchimento dipende anche dalle annaffiature." },
      { voce: "Concimazione del prato", unita: "m²", nota: "Con il tipo di concime nella riga: di fondo, di mantenimento, a lenta cessione." },
      { voce: "Posa prato a rotoli", unita: "m²", nota: "Con la preparazione del fondo. Se il fondo è da rifare, è un'altra riga." },
      { voce: "Potatura siepe", unita: "m", nota: "A metro lineare, ma altezza e lati da fare cambiano tutto: scrivili nella riga." },
      { voce: "Potatura albero", unita: "cad", nota: "Per altezza: un ulivo e un pino di quindici metri non sono la stessa voce." },
      { voce: "Abbattimento albero", unita: "cad", nota: "Con l'altezza e il modo: a terra libero o smontato a pezzi." },
      { voce: "Fresatura ceppaia", unita: "cad", nota: "Il cliente pensa che l'abbattimento la comprenda. Scrivi se c'è o no." },
      { voce: "Preparazione terreno per aiuola", unita: "m²", nota: "Vangatura, terriccio, livellamento. Il terriccio in più si può contare a metro cubo." },
      { voce: "Fornitura e messa a dimora arbusto", unita: "cad", nota: "Con la specie e la misura del vaso nella riga." },
      { voce: "Messa a dimora piante fornite dal cliente", unita: "cad", nota: "Solo lavoro. Scrivi che l'attecchimento di piante non tue non è garantito." },
      { voce: "Pacciamatura con corteccia", unita: "m³", nota: "A volume di materiale, o a metro quadro con lo spessore scritto." },
      { voce: "Impianto di irrigazione a goccia", unita: "m", nota: "Ala gocciolante e raccordi. Lo scavo per le linee, se serve, va scritto a parte." },
      { voce: "Programmatore irrigazione", unita: "cad", nota: "Con il numero di zone. Il collegamento elettrico, se non è tuo, fra le esclusioni." },
      { voce: "Raccolta e smaltimento del verde", unita: "m³", nota: "Sfalci e ramaglie a volume. Scrivi se trasporto e conferimento sono compresi." },
      { voce: "Manutenzione stagionale del giardino", unita: "corpo", nota: "Con i passaggi e le lavorazioni comprese scritte per esteso. Il resto è extra." },
      { voce: "Lavoro con piattaforma aerea", unita: "h", nota: "Con il mezzo e l'operatore. Scrivi se il trasporto del mezzo è a parte." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da giardiniere",
    intro:
      "Nel verde lo stesso lavoro può durare un'ora o una giornata, a seconda di quello che non si vede dalla strada. Il preventivo serve a far vedere al cliente perché.",
    punti: [
      {
        titolo: "Superficie, metro, pianta",
        testo:
          "Il prato a metro quadro, le siepi a metro lineare, gli alberi a pianta. Ognuno ha il suo modo, ma il cliente deve poter rifare il conto: se cambia idea su un pezzo di siepe, sa subito di quanto cambia il prezzo.",
      },
      {
        titolo: "Altezza e accesso",
        testo:
          "Un albero alto con la casa sotto non si pota come uno in mezzo al prato. Scrivi se lavori in tree climbing o con la piattaforma, e se il giardino è raggiungibile con i mezzi o va fatto tutto a mano.",
      },
      {
        titolo: "Lo smaltimento",
        testo:
          "È la voce che il cliente dimentica e che a te costa di più. Contala a volume, o scrivi che è compresa. Se le ramaglie restano al cliente, mettilo fra le esclusioni: niente sorprese il giorno dopo.",
      },
      {
        titolo: "Le piante del cliente",
        testo:
          "Se le piante le ha comprate lui, la riga diventa solo messa a dimora. Scrivi che l'attecchimento non lo garantisci: non le hai scelte tu, e non sai come sono state tenute.",
      },
      {
        titolo: "Il contratto a stagione",
        testo:
          "Per la manutenzione continuativa conviene una voce a corpo con i passaggi e le lavorazioni comprese scritte una per una. Tutto quello che non c'è, potature grosse o rifacimenti, va a parte con il suo prezzo.",
      },
      {
        titolo: "Meteo e stagione",
        testo:
          "Semine e trapianti hanno il loro periodo. Scrivi che le date dipendono dal tempo, così un rinvio per la pioggia non diventa un ritardo agli occhi del cliente.",
      },
    ],
  },
  documenti: {
    titolo: "Abilitazioni, rifiuti e IVA da tenere presenti",
    intro:
      "Per il giardiniere le regole non sono quelle dei lavori edili: contano l'abilitazione, i trattamenti e soprattutto dove vanno a finire sfalci e potature. Queste sono le cose che tornano più spesso.",
    punti: [
      {
        titolo: "Chi può fare manutenzione del verde",
        testo:
          "Per lavorare sul verde per conto di altri, la legge 154/2016 (articolo 12) chiede l'iscrizione al Registro ufficiale dei produttori oppure un attestato di idoneità, rilasciato dopo un corso di formazione secondo l'accordo Stato-Regioni del 22 febbraio 2018. Alcuni titoli di studio del settore ne esonerano.",
      },
      {
        titolo: "Trattamenti fitosanitari",
        testo:
          "Per acquistare e usare prodotti fitosanitari per uso professionale serve il certificato di abilitazione previsto dal D.Lgs. 150/2012, il cosiddetto patentino. Vale cinque anni e si rinnova con un corso di aggiornamento. Se i trattamenti non li fai tu, scrivilo fra le esclusioni.",
      },
      {
        titolo: "Sfalci e potature",
        testo:
          "Dopo il DL 153/2024, convertito dalla legge 191/2024, i rifiuti della manutenzione del verde privato fatta da professionisti sono rifiuti urbani. Si possono portare ai centri di raccolta, ma solo alle condizioni del regolamento del comune. Per trasportarli con il tuo mezzo serve l'iscrizione all'Albo gestori ambientali, categoria 2-bis, con il codice EER 20 02 01.",
      },
      {
        titolo: "IVA",
        testo:
          "L'aliquota del 10% della legge 488/1999 riguarda la manutenzione dei fabbricati a prevalente destinazione abitativa. La cura del giardino non è un lavoro sul fabbricato, e per questo di norma si fattura con l'aliquota ordinaria. Se nello stesso lavoro ci sono opere edili, come muretti o pavimentazioni, fatti dire dal commercialista come dividere. Attenzione: il sistema calcola l'IVA con le domande pensate per i lavori sulle case, e se rispondi che è un'abitazione mette il 10%. Per un giardino controlla l'aliquota prima di mandare il preventivo.",
      },
      {
        titolo: "Niente inversione contabile sui giardini",
        testo:
          "Anche con un cliente impresa, la manutenzione dei giardini non va in inversione contabile: la circolare 14/E del 2015 esclude i giardini dalla nozione di edificio, salvo quando ne sono parte integrante, come un giardino pensile su un tetto o un terrazzo.",
      },
    ],
    avvertenza:
      "Prendile come una traccia per orientarti, non come un parere. Regole e interpretazioni cambiano, e per il tuo caso concreto decidono il commercialista e gli uffici competenti.",
  },
  straniero: {
    titolo: "Giardini di chi vive fuori",
    testo:
      "Il proprietario che arriva solo d'estate vuole trovare il giardino in ordine e affida la manutenzione della stagione a distanza. Il preventivo può partire in inglese, tedesco, francese, spagnolo o olandese, con i passaggi compresi nel contratto elencati nella sua lingua e l'italiano che fa fede. Tu lo controlli in italiano, e il cliente lo accetta dal link anche da lontano.",
  },
  domande: {
    titolo: "Domande dai giardinieri",
    voci: [
      {
        d: "Il cliente mi dice «tutto il giardino», ma io il prato lo prezzo a metro quadro.",
        r: "Dì la misura a spanne, per esempio «sui trecento metri quadri», e il sistema la usa nell'unità della voce. Se la misura non la dici, non la inventa: ti arriva la domanda secca, «quanti metri quadri di prato?».",
      },
      {
        d: "Per le siepi conta l'altezza, non solo i metri. Come faccio?",
        r: "Nel listino tieni voci diverse per altezza, e nel racconto dici quanto è alta la siepe. Se il sistema non trova la voce che corrisponde, la riga resta da prezzare e il prezzo lo metti tu.",
      },
      {
        d: "Lo smaltimento del verde lo metto a parte o dentro le altre voci?",
        r: "Come preferisci, purché si legga. Se vuoi una riga a parte, tieni nel listino una voce a metro cubo e di' la quantità nel racconto, «tre metri cubi di ramaglie da portare via». Se dici solo «le portiamo via noi», il trasporto resta compreso nelle lavorazioni. Se invece restano al cliente, dillo e finisce fra le esclusioni.",
      },
      {
        d: "Faccio contratti di manutenzione per tutta la stagione. Posso usarlo?",
        r: "Sì. Metti nel listino una voce a corpo con i passaggi e le lavorazioni comprese, e la bozza la usa quando la nomini. Le cose fuori contratto che racconti finiscono in righe a parte, con i loro prezzi o da prezzare.",
      },
      {
        d: "Per abbattere l'albero serve il permesso. Lo scrivo nel preventivo?",
        r: "Se nel tuo caso serve, dillo nel racconto come esclusione: «il permesso per l'abbattimento lo chiede il cliente». Le esclusioni vanno sotto le voci del PDF e il cliente le legge prima di accettare.",
      },
      {
        d: "Che IVA metto su un giardino? Ogni volta è un dubbio.",
        r: "Per la cura del verde di solito l'aliquota è quella ordinaria, non il 10% dei lavori in casa. Il sistema però calcola l'IVA con le domande pensate per i lavori sulle case: se rispondi che è un'abitazione, mette il 10%. Per un giardino controlla l'aliquota con il commercialista prima di mandare il preventivo.",
      },
      {
        d: "Faccio anche trattamenti contro i parassiti. Li metto nel preventivo?",
        r: "Sì, come voce a parte, con il prodotto o il tipo di trattamento nel nome della voce. Se non hai il patentino e i trattamenti li fa un altro, dillo nel racconto: finiscono fra le esclusioni.",
      },
    ],
  },
};
