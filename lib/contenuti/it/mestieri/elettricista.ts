import type { PaginaMestiere } from "../../tipi";

export const elettricista: PaginaMestiere = {
  meta: {
    titolo: "Preventivo elettricista a voce, col tuo listino",
    descrizione:
      "Racconti il sopralluogo e ricevi la bozza del preventivo elettricista: punti luce, prese e quadro coi prezzi del tuo listino. Il cliente accetta online.",
  },
  nome: "Elettricista",
  riga: "Punti luce, prese, quadro, linee dedicate e dichiarazione di conformità.",
  h1: "Preventivo elettricista: lo racconti, e la bozza esce col tuo listino",
  sottotitolo:
    "Punti luce, prese, quadro, tracce e dichiarazione di conformità. Finito il sopralluogo lo dici come lo diresti a un collega: la bozza usa solo i prezzi del tuo listino e ti segnala quello che manca.",
  esempio: {
    titolo: "Cosa racconti, cosa ricevi",
    intro:
      "Un rifacimento parziale inventato, detto di fila appena salito in furgone. A destra c'è come il sistema separa i punti luce semplici da quello deviato, conta le prese, mette il quadro su una riga sua e ti chiede quante prese vuole il cliente in camera.",
    lavoro: "Soggiorno e camera, rifacimento parziale",
    dettatura:
      "Allora, appartamento del signor Colombo, terzo piano. In soggiorno rifaccio tutto: sei prese normali, due prese TV e tre punti luce, uno deviato vicino alla portafinestra. In camera due punti luce semplici e le prese ai lati del letto, quante non l'ha ancora deciso. Il quadro è vecchio, lo cambio: centralino da dodici moduli con il differenziale e tre magnetotermici. Poi una linea dedicata per il forno, saranno otto metri. Le tracce le chiude il muratore, quelle non le metto. I lampadari li ha già comprati lui, sono quattro, glieli monto io. L'antenna non la tocco, la sistema l'antennista.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da elettricista",
    intro:
      "Punti, linee, protezioni e documenti: sono le righe che compaiono quando metti mano all'impianto di una casa. Il prezzo di ogni punto lo decidi tu e arriva dal tuo listino; un punto che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Punto luce interrotto", unita: "cad", nota: "Una lampada comandata da un interruttore. Il punto più comune, in ogni stanza." },
      { voce: "Punto luce deviato", unita: "cad", nota: "Comandato da due posizioni: ingresso e letto, inizio e fine corridoio." },
      { voce: "Punto luce invertito", unita: "cad", nota: "Da tre posizioni o più: scale, corridoi lunghi, stanze con tre porte." },
      { voce: "Punto presa 10/16 A", unita: "cad", nota: "Presa bivalente o Schuko per l'uso normale. Conviene dire che tipo di presa è compresa." },
      { voce: "Linea dedicata elettrodomestici", unita: "cad", nota: "Forno, piano a induzione, lavatrice, condizionatore: linea propria con la sua protezione." },
      { voce: "Punto presa TV", unita: "cad", nota: "Presa coassiale o satellitare. Se l'antenna è esclusa, scrivilo." },
      { voce: "Punto dati / telefono", unita: "cad", nota: "Presa RJ45 per la rete o il telefono, con il cavo fino al punto di raccolta." },
      { voce: "Centralino da incasso", unita: "cad", nota: "Indica i moduli (12, 24, 36): il cliente capisce cosa paga e tu eviti discussioni dopo." },
      { voce: "Interruttore magnetotermico differenziale", unita: "cad", nota: "Separato dal centralino, così il cliente vede le protezioni che monti." },
      { voce: "Interruttore magnetotermico", unita: "cad", nota: "Uno per linea: luci, prese, cucina, lavatrice." },
      { voce: "Linea montante dal contatore", unita: "m", nota: "La dorsale dal contatore al quadro di casa. Si conta a metro." },
      { voce: "Tracce su muratura", unita: "m", nota: "Se la chiusura e il ripristino li fa il muratore, scrivi che sono esclusi." },
      { voce: "Montaggio corpo illuminante", unita: "cad", nota: "Lampadari e plafoniere del cliente: solo montaggio, il materiale è suo." },
      { voce: "Videocitofono", unita: "cad", nota: "Fornitura e posa. Per l'IVA è un bene significativo: vedi più sotto." },
      { voce: "Ricerca guasti", unita: "h", nota: "Lavoro a ore, quando non sai in anticipo quanto ci vuole." },
      { voce: "Dichiarazione di conformità", unita: "corpo", nota: "Con gli allegati previsti. Molti la includono nel prezzo: decidi tu, ma scrivilo." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da elettricista",
    intro:
      "Il modo di prezzare cambia da un elettricista all'altro, e va bene così. Quello che conta è che il cliente capisca cosa c'è dentro ogni riga, perché è lì che nascono le discussioni a fine lavoro.",
    punti: [
      {
        titolo: "A punto",
        testo:
          "È il modo più usato nelle case: ogni punto luce o presa ha il suo prezzo, con tubo, scatola, cavo e frutto. Scrivi se la placca è compresa e di che serie, perché placche e frutti di design cambiano il conto.",
      },
      {
        titolo: "A corpo",
        testo:
          "Per un rifacimento completo il cliente spesso vuole un numero solo. Puoi darglielo, ma tieni il dettaglio per stanza: se a metà lavoro cambia idea su una camera, sai subito di quanto cambia il prezzo.",
      },
      {
        titolo: "Le tracce",
        testo:
          "Aprire le tracce è tuo, chiuderle e ripristinare l'intonaco spesso no. Se lo fa il muratore, scrivilo fra le esclusioni: è la prima cosa che il cliente dà per scontata.",
      },
      {
        titolo: "Il materiale del cliente",
        testo:
          "Lampadari, plafoniere, placche comprate da lui: la riga diventa solo montaggio. Il sistema lo capisce quando dici «li ha già comprati lui» e non ti propone la voce con la fornitura.",
      },
      {
        titolo: "I punti in più",
        testo:
          "Durante il lavoro il cliente chiede sempre una presa in più. Se nel preventivo c'è il prezzo del singolo punto, la variante si calcola da sola e non devi rifare tutto.",
      },
      {
        titolo: "Ore e chiamate",
        testo:
          "Ricerca guasti e piccoli interventi si fanno a ore, con l'uscita a parte se la fai pagare. Scrivi da quando parte il conto, così il cliente non ha sorprese.",
      },
    ],
  },
  documenti: {
    titolo: "Documenti, norme e IVA da tenere presenti",
    intro:
      "Un preventivo da elettricista che cita i documenti giusti fa capire al cliente che sa con chi ha a che fare. Queste sono le cose che tornano più spesso nei lavori di casa.",
    punti: [
      {
        titolo: "Dichiarazione di conformità",
        testo:
          "A fine lavori l'impresa installatrice rilascia al cliente la dichiarazione di conformità prevista dal DM 37/2008, con i suoi allegati: il progetto, la relazione con i materiali usati, lo schema dell'impianto realizzato e la copia del certificato dei requisiti tecnico-professionali. Scrivi nel preventivo se è compresa nel prezzo.",
      },
      {
        titolo: "Progetto del professionista",
        testo:
          "Oltre certe soglie l'impianto va progettato da un professionista iscritto all'albo. Per le abitazioni il DM 37/2008 indica la potenza impegnata oltre 6 kW o la superficie oltre 400 m². Se serve, dillo nel preventivo: è un costo che il cliente deve sapere prima.",
      },
      {
        titolo: "Dotazioni minime dell'impianto",
        testo:
          "La norma CEI 64-8 fissa le dotazioni minime per gli impianti delle abitazioni, in tre livelli: il livello 1 è il minimo per un impianto nuovo o rifatto. Scrivere il livello nel preventivo aiuta il cliente a confrontare offerte diverse.",
      },
      {
        titolo: "Il videocitofono e l'IVA",
        testo:
          "Un impianto rifatto in un appartamento è di solito manutenzione, con l'IVA al 10%. Il videocitofono però è un bene significativo: il 10% vale per lui solo fino al valore del resto del lavoro, e la parte che supera va al 22%. Se nel listino la voce è segnata come bene significativo, la bozza ti chiede quanto vale l'apparecchio dentro quella riga e con quel dato divide l'IVA.",
      },
      {
        titolo: "Impianti per uffici e negozi",
        testo:
          "Se installi impianti in un edificio per un cliente con partita IVA, spesso si applica l'inversione contabile (reverse charge): in fattura non metti l'IVA, la applica il cliente. Oggi il sistema calcola il 10%, il 22% e la divisione dei beni significativi; l'inversione contabile non ancora, quindi con questi clienti controlla il totale prima di mandare il preventivo.",
      },
    ],
    avvertenza:
      "Queste note servono a orientarti e non sostituiscono il parere del tuo commercialista o del tuo consulente. Norme e aliquote possono cambiare: verifica sempre il caso concreto.",
  },
  straniero: {
    titolo: "Se il cliente non parla italiano",
    testo:
      "A chiamare l'elettricista sono spesso stranieri che hanno appena comprato casa e trovano un impianto vecchio, o uffici di aziende estere che aggiungono postazioni. Per loro il preventivo può partire in inglese, tedesco, francese, spagnolo o olandese: punti luce e prese con la traduzione sotto, l'italiano che fa fede e il modulo di recesso nella loro lingua. La bozza la controlli in italiano.",
  },
  domande: {
    titolo: "Domande dagli elettricisti",
    voci: [
      {
        d: "Posso mettere nello stesso preventivo voci a punto e voci a corpo?",
        r: "Sì. Ogni riga ha la sua unità: punti luce e prese a numero, la linea montante a metro, la dichiarazione di conformità a corpo. Il sistema usa l'unità della voce che hai nel listino e rifà il conto se dici le misure in un altro modo.",
      },
      {
        d: "Non so ancora quante prese vuole in camera. Cosa succede?",
        r: "Il sistema non tira a indovinare: la riga resta senza quantità e ti arriva una domanda secca, «quante prese in camera?». Rispondi quando lo sai, e il totale si aggiorna.",
      },
      {
        d: "La dichiarazione di conformità va nel preventivo?",
        r: "Non è obbligatorio scriverla, ma conviene: se è compresa nel prezzo il cliente lo vede, se è a parte non ci sono sorprese. Puoi tenerla come voce fissa nel listino, così entra in ogni preventivo di impianto.",
      },
      {
        d: "Le tracce le chiude il muratore. Come evito che il cliente pensi siano mie?",
        r: "Dillo nel racconto, «le tracce le chiude il muratore». Finisce fra le esclusioni del preventivo, scritte in chiaro sotto le voci.",
      },
      {
        d: "L'appartamento supera i 6 kW impegnati. Come metto il progetto nel preventivo?",
        r: "Se il progetto lo fa un professionista pagato dal cliente, dillo nel racconto come esclusione, «progetto dell'impianto a carico del cliente». Se lo fai fare tu e lo ribalti, tienilo come voce a corpo nel listino: nella bozza entra come le altre righe.",
      },
      {
        d: "Il cliente vuole una serie di placche diversa da quella che ho a listino.",
        r: "Se dici la serie nel racconto e nel listino non c'è, la riga resta da prezzare, evidenziata, e il prezzo lo metti tu. Se quella serie ti capita spesso, aggiungila al listino come voce sua.",
      },
      {
        d: "Una ricerca guasti con l'uscita: come la metto?",
        r: "Con due voci nel listino, l'uscita a corpo e la ricerca guasti a ore. Se nel racconto non dici quante ore prevedi, la riga oraria resta senza quantità e te la chiede.",
      },
    ],
  },
};
