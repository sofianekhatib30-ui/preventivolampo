import type { PaginaFunzione } from "../../tipi";

export const listinoPrezzi: PaginaFunzione = {
  meta: {
    titolo: "Il tuo listino prezzi, da Excel o da una foto",
    descrizione:
      "Il listino prezzi è la base di ogni preventivo: lo carichi da Excel, PDF o foto e lo controlli voce per voce. I prezzi vengono solo da lì, mai inventati.",
  },
  nome: "Il tuo listino prezzi",
  riga: "Excel, PDF o la foto del foglio scritto a mano: i prezzi dei preventivi vengono solo da lì.",
  h1: "Il listino prezzi: i preventivi usano i tuoi prezzi, e nessun altro",
  sottotitolo:
    "Carichi il listino che hai già, anche scritto a mano, e lo controlli prima di usarlo. Da lì in poi ogni prezzo della bozza viene da una tua voce. Quello che manca resta da prezzare, e se vuoi entra nel listino per la volta dopo.",
  sezioni: [
    {
      titolo: "I prezzi vengono solo dal tuo listino",
      paragrafi: [
        "Quando [racconti un sopralluogo](/funzioni/preventivo-da-vocale), il sistema cerca ogni lavorazione fra le voci del tuo listino e sceglie solo fra quelle. Se una voce descrive davvero il lavoro detto, la riga prende il suo prezzo e la sua unità. Se nessuna voce va bene, o se l'abbinamento è incerto, la riga resta **da prezzare**: niente prezzi di mercato, niente medie, niente stime.",
        "Senza listino non si parte: il primo preventivo si fa quando c'è almeno qualche voce. Se nella bozza cambi un prezzo, il cambio vale per quel preventivo e viene registrato come prezzo tuo. Il listino non cambia da solo.",
      ],
    },
    {
      titolo: "Come si carica, e come si controlla",
      paragrafi: [
        "Va bene il listino che hai già. Nulla entra nel listino prima che tu l'abbia controllato e confermato.",
      ],
      punti: [
        {
          titolo: "Da Excel",
          testo:
            "Carichi il file .xlsx o .csv così com'è. Le colonne si riconoscono dai titoli (Descrizione, U.M., Prezzo); se i titoli non sono chiari, il sistema prova a capirle e tu puoi sceglierle a mano e far rileggere il file. Un Excel vecchio (.xls) va prima salvato come .xlsx.",
        },
        {
          titolo: "Da PDF, foto o vecchi preventivi",
          testo:
            "Puoi caricare un PDF, più foto insieme del foglio scritto a mano, o qualche preventivo vecchio. Il sistema trascrive le voci di prezzo e salta titoli, totali, IVA e condizioni. Dai vecchi preventivi prende il prezzo unitario, e se una voce compare più volte con prezzi diversi te lo segnala. I nomi dei clienti non li trascrive.",
        },
        {
          titolo: "Il controllo, riga per riga",
          testo:
            "Prima di importare vedi tutte le righe. Quelle con un dubbio (unità che non si legge, prezzo poco leggibile) sono in giallo, con il motivo: le correggi o togli la spunta. Le unità scritte in tanti modi (mq, ml, nr, pz, a corpo) diventano quelle del preventivo. I codici che mancano o si ripetono li assegna il sistema, e quelli che hai già nel listino non vengono sovrascritti.",
        },
        {
          titolo: "Se non hai un listino",
          testo:
            "Puoi scrivere a mano le lavorazioni che fai più spesso, una alla volta. Oppure partire da un listino di esempio con prezzi presi da prezzari pubblici: finché non li cambi restano segnati come prezzi d'esempio, e ti ricordiamo di controllarli prima di mandare preventivi veri.",
        },
      ],
    },
    {
      titolo: "Le parole del mestiere: come chiami le voci a voce",
      paragrafi: [
        "Nel listino una voce si chiama «Rasatura pareti con stucco», ma in cantiere dici «rasare», «stuccare tutto», «una mano di rasante». Per questo ogni voce ha un campo **come la chiami a voce**: qualche parola, separata da virgole. Quando il sistema cerca la voce giusta, quelle parole pesano più del nome e della descrizione.",
        "Dopo un import il campo è vuoto. Conviene riempirlo per le voci che usi di più, con le parole che usi davvero, anche quelle di cantiere. Bastano pochi minuti e le bozze successive trovano più voci al primo colpo. Ogni voce può avere anche una descrizione più lunga, che aiuta il sistema a capire che cosa comprende. Sul preventivo va il nome della voce, che nella bozza puoi sempre ritoccare.",
      ],
    },
    {
      titolo: "Quando una voce manca, e come il listino cresce",
      paragrafi: [
        "Una riga da prezzare è evidenziata nella bozza. Puoi scegliere tu una voce del listino, oppure scrivere il prezzo a mano. Se scrivi il prezzo, puoi spuntare «proponi di aggiungerla al mio listino con questo prezzo».",
        "Quando approvi il preventivo, le righe spuntate finiscono nella pagina **Da prezzare**. Lì decidi con calma: le aggiungi al listino con nome, unità e codice, oppure premi «Non serve». Una proposta non entra mai nel listino da sola. Quella che aggiungi, la volta dopo arriva con il suo prezzo senza che tu la scriva.",
        "C'è un altro caso tipico: il materiale lo compra il cliente. Se una voce del tuo listino comprende il materiale (lo segni sulla voce), con il materiale del cliente la riga diventa solo posa e resta da prezzare, perché il prezzo di fornitura e posa sarebbe sbagliato. Se nel listino hai anche una voce di solo posa per quel lavoro, la bozza può prendere direttamente quella; altrimenti il prezzo lo metti tu.",
        "Se togli una voce dal listino, i preventivi già fatti non cambiano. Lo stesso se ne modifichi il prezzo: un preventivo già preparato tiene i prezzi che aveva.",
      ],
    },
    {
      titolo: "I beni significativi",
      paragrafi: [
        "Nella manutenzione delle abitazioni l'IVA è al 10%, ma alcuni beni ci rientrano solo in parte. Sono i beni significativi del DM 29/12/1999: ascensori e montacarichi, infissi esterni e interni, caldaie, videocitofoni, apparecchiature di condizionamento e riciclo dell'aria, sanitari e rubinetteria da bagno, impianti di sicurezza. Per questi il 10% vale solo fino al valore del resto del lavoro, e la parte che supera va al 22%.",
        "Nel listino segni quali voci sono beni significativi. Quando il lavoro è manutenzione su un'abitazione e i materiali li compri tu, la bozza ti chiede, per ogni riga segnata, quanto vale il bene dentro quella riga: il prezzo comprende anche la posa, e il valore del bene lo sai solo tu. Con quel dato l'IVA esce divisa fra 10% e 22%, e il PDF lo scrive. Se il cliente compra i beni da sé, o se è una ristrutturazione, la divisione non serve. Come funziona nel dettaglio lo spiega la guida sull'[IVA nei lavori in casa](/guide/iva-preventivo-lavori-casa).",
        "Il calcolo segue le tue risposte e le regole dell'Agenzia delle Entrate, ma non è una consulenza fiscale: ogni preventivo riporta l'avviso di verificare con il tuo commercialista.",
      ],
    },
    {
      titolo: "Come trattiamo i tuoi prezzi",
      paragrafi: [
        "**Restano tuoi.** Listino, preventivi e dati dell'impresa sono tuoi, e su richiesta ti mandiamo il listino in Excel e i PDF dei preventivi. Non vendiamo i dati e non li usiamo per pubblicità.",
        "**Servono solo ai tuoi preventivi.** Il listino è legato alla tua impresa: le tue bozze cercano solo fra le tue voci, e le tue voci non entrano nei preventivi di nessun altro. Per scegliere le voci il sistema guarda nomi e descrizioni; il prezzo lo prende dopo, dal tuo listino.",
        "**Nessuna cifra inventata.** Un prezzo nella bozza viene da una tua voce o lo scrivi tu. Se carichi il listino da PDF o da foto, il file serve a leggere le voci e poi non viene conservato.",
        "Quando smetti di usare PreventivoLampo, i tuoi dati si cancellano nei tempi scritti nell'informativa privacy, salvo quello che la legge obbliga a conservare.",
      ],
    },
  ],
  domande: {
    titolo: "Domande sul listino",
    voci: [
      {
        d: "Quante voci servono per cominciare?",
        r: "Non c'è un minimo: comincia dalle lavorazioni che fai più spesso. Quello che manca resta da prezzare, e con la spunta «proponi di aggiungerla» il listino si completa mentre lavori.",
      },
      {
        d: "Ho prezzi diversi per i privati e per le imprese. Come faccio?",
        r: "Il listino è uno. Nella bozza puoi cambiare il prezzo di una riga per quel preventivo, e il listino resta com'è.",
      },
      {
        d: "Se aumento un prezzo, cambiano i preventivi già mandati?",
        r: "No. Un preventivo già preparato tiene i prezzi con cui è nato, e uno approvato non cambia più. Il prezzo nuovo vale dalle bozze successive.",
      },
      {
        d: "Il mio listino è un quaderno scritto a mano. Va bene?",
        r: "Sì. Fai le foto delle pagine, anche più di una insieme, e le carichi. Il sistema trascrive le voci, segna dove non è sicuro e tu controlli ogni prezzo prima di importare.",
      },
      {
        d: "Posso correggere una voce dopo averla importata?",
        r: "Sì. Nel listino apri la voce e cambi nome, prezzo, unità e le parole con cui la chiami a voce, e segni se è un bene significativo o se il prezzo comprende il materiale. Dopo l'import queste due spunte sono vuote: conviene guardarle sulle voci che usi di più.",
      },
      {
        d: "A cosa serve la spunta «il prezzo comprende il materiale»?",
        r: "Dice al sistema che quella voce è fornitura e posa. Se racconti che il materiale lo compra il cliente, la riga non prende quel prezzo: diventa solo posa e resta da prezzare, a meno che la bozza non trovi una tua voce di solo posa.",
      },
    ],
  },
};
