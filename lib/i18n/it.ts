// Dizionario italiano: la lingua principale e la fonte di tutte le altre (lib/i18n/<lingua>.json,
// generati da scripts/traduci-dizionario.ts e controllati da test/dizionari.test.ts).
// Segni ammessi nei testi: **grassetto**, [testo](indirizzo), {segnaposto}. Mai la lineetta lunga.
// I testi dell'area dell'artigiano stanno in lib/i18n/it-area.ts.
// Le frasi protette della home (test/promesse-home.test.ts) vivono qui: cambiarle è cambiare una promessa.

import { area } from "./it-area";

export const it = {
  area,
  comune: {
    lingua: "Lingua",
    scegliLingua: "Scegli la lingua",
    faFede: "Traduzione di cortesia: in caso di dubbio fa fede il testo italiano.",
    saltaAlContenuto: "Salta al contenuto",
    logoTop: "PreventivoLampo, torna all'inizio",
    logoHome: "PreventivoLampo, home",
    entra: "Accedi",
    apriMenu: "Apri il menu",
    chiudiMenu: "Chiudi il menu",
    principale: "Principale",
    ctaPilota: "Diventa artigiano pilota",
    ctaProva: "Prova con un esempio",
    privacy: "Privacy",
    cookie: "Cookie",
    condizioni: "Condizioni",
    infoLegali: "Informazioni legali",
    servizioDi: "PreventivoLampo è un servizio di K Digital Solution",
    aggiornata: "Aggiornata il {data}",
    comeFunziona: "Come funziona",
    briciole: "Sei qui",
  },
  nav: {
    come: "Come funziona",
    mestieri: "Mestieri",
    numeri: "I numeri",
    prezzi: "Prezzi",
    domande: "Domande",
    guide: "Guide",
    modelli: "Modelli gratis",
    glossario: "Glossario",
    chiSiamo: "Chi siamo",
    tuttiIMestieri: "Tutti i mestieri",
    risorse: "Risorse",
  },
  hero: {
    etichetta: "Per tutti i mestieri della casa",
    titolo: "Finisci il sopralluogo. Il preventivo parte dal furgone.",
    testo:
      "Lo racconti a voce o lo scrivi, come faresti con un collega. Ti torna la bozza con i prezzi del **tuo** listino, l'IVA giusta e le voci dubbie segnate. Controlli, approvi, e il cliente riceve il PDF da accettare con un clic.",
    garanzia: "Prezzi solo dal tuo listino. Se una voce non c'è resta da prezzare: niente cifre inventate.",
    guarda: "Guarda come funziona",
    punti: ["Niente da installare", "Listino anche da una foto", "Decidi sempre tu"],
  },
  demo: {
    gruppo: "Scegli un mestiere per l'esempio",
    altroMestiere: "Altro mestiere",
    didascalia: "Esempio: lavoro e prezzi inventati, listino di prova",
    pausa: "Pausa",
    riprendi: "Riprendi",
    riguarda: "Riguarda",
    sig: "sig.",
    bozza: "Bozza dal tuo listino",
    voci: "{n} voci",
    daPrezzare: "da prezzare",
    prezzoTuo: "prezzo tuo: lo puoi aggiungere al listino",
    iva: "IVA {aliquota}%: abitazione, manutenzione",
    stati: ["Inviato", "Visto", "Accettato"],
    accettato: "Accettato online dal sig. {cliente}: nome, data, ora e copia del PDF restano a te.",
    altroTitolo: "Serramenti, cartongesso, caldaie, giardini, cancelli, cucine su misura.",
    altroTesto:
      "Se lavori a voci e misure, funziona con il tuo listino: le parole del mestiere le trova lì, e quello che non c'è resta da prezzare. Carichi il listino che hai, anche in foto, e lo provi sui tuoi lavori.",
    altroCta: "Provalo sul tuo lavoro",
    mestieri: { elettricista: "Elettricista", idraulico: "Idraulico", imbianchino: "Imbianchino", piastrellista: "Piastrellista", muratore: "Muratore" },
    lavori: { elettricista: "Cucina", idraulico: "Cucina", imbianchino: "Bilocale", piastrellista: "Soggiorno", muratore: "Cameretta" },
    // Il racconto dell'artigiano nella lingua della pagina: le voci della bozza restano in italiano.
    vocali: {
      elettricista:
        "Cucina del signor Ferrari. Quattro punti luce semplici e due deviati sopra il tavolo. Le prese da sedici per gli elettrodomestici. Nel quadro ci va un differenziale nuovo. E gli monto il lampadario che ha comprato lui.",
      idraulico:
        "Cucina della signora Rinaldi. Spostiamo il lavello sulla parete di fronte: nuovo allaccio acqua calda e fredda con lo scarico, tre metri di scarico da quaranta. Allaccio anche la lavastoviglie. Il miscelatore ce l'ha già lei, lo monto io.",
      imbianchino:
        "Bilocale del signor Greco, soggiorno e camera: pareti e soffitti fanno centoventi metri. Raschio dove si sfoglia, fissativo dappertutto e due mani di lavabile. Sei metri di antimuffa sul soffitto del bagno. I mobili li spostiamo noi.",
      piastrellista:
        "Soggiorno della signora Marino, ventotto metri quadri. Tolgo il pavimento vecchio e il battiscopa, rifaccio il massetto e poso il gres trenta per trenta che ha comprato lei. Battiscopa nuovo in gres.",
      muratore:
        "Cameretta del signor Conti. Butto giù il tramezzo vecchio e lo rifaccio spostato di un metro: forati da otto, tre e venti per due e settanta, intonaco da tutte e due le parti. Macerie, un metro cubo. Il controtelaio della porta lo metto io.",
    },
  },
  mestieri: {
    titolo: "Ogni mestiere ha le sue parole. Il tuo listino le ha già.",
    testo:
      "Non devi imparare a parlare in un altro modo: dici le misure a spanne, i nomi che usi tu, «quello che ha comprato lei». Il sistema cerca fra le voci del tuo listino, rifà i conti delle misure e quello che non trova te lo segna.",
    guarda: "Guarda l'esempio",
    scorri: "Scorri per vedere gli altri mestieri.",
    nota: "Righe di esempio. Funziona con qualunque listino a voci e misure: se il tuo mestiere non è qui, vale lo stesso.",
    etichettaLista: "Esempi per mestiere",
    voci: {
      elettricista: { nome: "Elettricista", detto: "sei punti luce, due deviati" },
      idraulico: { nome: "Idraulico", detto: "sposto il lavello di un metro e mezzo" },
      imbianchino: { nome: "Imbianchino", detto: "due mani di lavabile, centoventi metri" },
      piastrellista: { nome: "Piastrellista", detto: "poso il gres che ha comprato lei" },
      muratore: { nome: "Muratore", detto: "tre e venti per due e settanta" },
      cartongessista: { nome: "Cartongessista", detto: "controsoffitto nel corridoio, sei per uno e dieci" },
      serramentista: { nome: "Serramentista", detto: "tre finestre a due ante e una portafinestra" },
      termoidraulico: { nome: "Termoidraulico", detto: "cambio la caldaia, i radiatori restano" },
      falegname: { nome: "Falegname", detto: "armadio a muro, due e quaranta per due e sessanta" },
      fabbro: { nome: "Fabbro", detto: "ringhiera del balcone, sei metri" },
      giardiniere: { nome: "Giardiniere", detto: "siepe da tagliare, quaranta metri" },
      impresa: { nome: "Impresa edile", detto: "bagno completo, chiavi in mano" },
    },
  },
  come: {
    titolo: "Dal vocale al preventivo accettato, in quattro passaggi.",
    sotto: "Tu racconti e controlli. Conti, listino, IVA, PDF e invio li fa il sistema.",
    passi: [
      {
        titolo: "Racconti il lavoro",
        testo: "A voce o per iscritto, dal telefono, appena finito il sopralluogo: misure, lavori, cosa porta il cliente, cosa è escluso.",
        nota: "«tre per due e mezzo, più o meno»",
      },
      {
        titolo: "Ti chiede cosa manca",
        testo: "Se una quantità non è chiara non la indovina: ti fa una domanda secca e aspetta la risposta.",
        nota: "«Quanti m² di pavimento?»",
      },
      {
        titolo: "Controlli dal telefono",
        testo: "Voce per voce: correggi, togli, aggiungi. Quello che non è nel tuo listino è evidenziato.",
        nota: "Modifica · Approva",
      },
      {
        titolo: "Il cliente accetta",
        testo: "Riceve il PDF con il tuo logo e un link per accettarlo. Tu vedi quando lo apre e quando dice sì.",
        nota: "Inviato · Visto · Accettato",
      },
    ],
  },
  numeri: {
    titolo: "Quello che ti garantiamo, ogni volta.",
    testo:
      "Il preventivo porta il tuo nome, quindi deve essere giusto. Per questo il sistema non tira mai a indovinare: quello che sa lo scrive, quello che non sa te lo chiede.",
    cifre: [
      { cifra: "100%", cosa: "dei prezzi dal tuo listino", dettaglio: "Nessun prezzo inventato. Quello che manca resta da prezzare finché non lo decidi tu." },
      {
        cifra: "6 lingue",
        cosa: "per il tuo cliente",
        dettaglio: "Italiano, inglese, tedesco, francese, spagnolo e olandese. E tu racconti anche in rumeno, albanese o arabo.",
      },
      { cifra: "13 s", cosa: "per avere la bozza", dettaglio: "Dal racconto del sopralluogo alla bozza completa, con le domande su quello che manca." },
    ],
    sotto1:
      "Prima di arrivare al cliente, ogni preventivo passa da te. Le voci da controllare sono evidenziate, le misure che mancano te le chiede, e niente parte senza la tua approvazione.",
    sotto2: "Con il programma pilota lo mettiamo alla prova sui lavori veri di dieci artigiani di mestieri diversi. Quello che non va ce lo dicono, e lo sistemiamo.",
  },
  cosa: {
    titolo: "Trascrivere un vocale lo sanno fare in tanti. Noi ci occupiamo di quello che ti fa perdere soldi.",
    listinoTitolo: "Il tuo listino, com'è",
    listinoTesto:
      "Carichi il listino che hai: Excel, PDF, la foto del foglio scritto a mano o qualche preventivo vecchio. Il sistema legge voci, unità di misura e prezzi, e tu controlli e confermi. Nessun prezzo entra senza che tu l'abbia visto. Se ti blocchi, ti aiutiamo noi.",
    tabella: { didascalia: "Esempio di listino", voce: "Voce", unita: "Unità", tipoIva: "Tipo IVA", prestazione: "prestazione", beneSign: "bene sign." },
    prezzoTitolo: "Nessun prezzo inventato",
    prezzoTesto:
      "Diverse app, quando non trovano una voce, la stimano con «prezzi di mercato». Noi no: se non è nel tuo listino la segniamo da prezzare, e il prezzo lo metti tu. Un preventivo sbagliato al ribasso è un lavoro in perdita.",
    dalListino: "dal listino ✓",
    ivaTitolo: "L'IVA edile fatta bene, da sola",
    ivaTesto1:
      "Manutenzione su un'abitazione? Il 10% vale per il lavoro, ma i beni significativi (sanitari, rubinetteria, infissi, caldaie) ci rientrano solo fino al valore del resto dell'intervento. La parte che eccede va al 22%.",
    ivaTesto2: "Ti facciamo tre domande: che immobile è, che lavoro è, chi compra i materiali. Sul PDF l'IVA 10% e 22% esce ripartita giusta, con la dicitura.",
    ivaNota: "Esempio tratto dalla guida dell'Agenzia delle Entrate. Per i casi particolari resta sempre il tuo commercialista.",
    scontrino: {
      etichetta: "Esempio di ripartizione IVA",
      titolo: "Manutenzione straordinaria · abitazione",
      manodopera: "Manodopera e altri materiali",
      beni: "Beni significativi",
      imp10: "Imponibile al 10%",
      imp22: "Imponibile al 22%",
      iva: "IVA 10% + IVA 22%",
      totale: "Totale",
    },
    lingueTitolo: "Tu racconti nella tua lingua. Il cliente legge nella sua.",
    lingueTesto:
      "Scrivi o detti il sopralluogo in rumeno, albanese, arabo o un'altra lingua: la bozza esce in italiano. Se il cliente è straniero, il preventivo gli arriva in inglese, tedesco, francese, spagnolo o olandese, con il testo italiano accanto che fa fede. La traduzione la vedi e la correggi prima di mandarla.",
    lingueDalListino: "dal tuo listino, in italiano",
    lingueAlCliente: "al cliente tedesco, con l'italiano accanto",
    aiutoTitolo: "Un aiuto vero, da una persona",
    aiutoTesto:
      "Logo, dati, condizioni di pagamento, acconti, esclusioni: li imposti tu in pochi minuti. Se ti blocchi, ci scrivi o ci chiami e ti risponde una persona, non un bot. E il primo preventivo lo mandi tu, dal furgone.",
    ultimaTitolo: "L'ultima parola è sempre tua",
    ultimaTesto:
      "Il sistema propone, tu decidi. Nessun preventivo arriva al cliente senza che tu l'abbia aperto e approvato. Le voci nuove che prezzi entrano nel tuo listino, per la volta dopo.",
  },
  confronto: {
    titolo: "Tre modi di fare lo stesso preventivo.",
    colonne: ["Word o Excel, la sera", "Un chatbot qualsiasi", "PreventivoLampo"],
    righe: [
      { tema: "I prezzi", celle: ["Li copi tu dal listino", "Li stima: il tuo listino non lo conosce", "Solo dal tuo listino. Quello che manca resta da prezzare"] },
      { tema: "Le misure che mancano", celle: ["Te ne accorgi quando scrivi", "Spesso le dà per buone", "Te le chiede prima di fare i conti"] },
      { tema: "IVA con beni significativi", celle: ["A mano, con il dubbio", "Dipende da come glielo chiedi", "10% e 22% ripartiti, con la dicitura"] },
      { tema: "Il documento", celle: ["Da impaginare ogni volta", "Testo da copiare altrove", "PDF con il tuo logo, pronto da mandare"] },
      { tema: "Il sì del cliente", celle: ["Un messaggio, se va bene", "Non c'è", "Accettazione online: nome, data, ora e copia del PDF"] },
      { tema: "Dove lo fai", celle: ["Al computer, dopo cena", "Al telefono, poi lo rifai", "Dal telefono, appena finito il sopralluogo"] },
    ],
    etichettaLista: "Confronto per tema",
    scorri: "Scorri per gli altri confronti.",
    nota: "«Chatbot qualsiasi»: un assistente generico usato senza il tuo listino, come fanno in tanti oggi.",
  },
  calcolo: {
    titolo: "Quanto ti costano oggi i preventivi?",
    preventivi: "Preventivi a settimana",
    minuti: "Minuti per ognuno, fra conti, Word e invio",
    min: "{n} min",
    passi: "Ogni mese passi sui preventivi circa",
    ore: "{n} ore",
    costa: "quasi sempre la sera, dopo il cantiere. PreventivoLampo costa 19,90 € al mese:",
    allOra: "{n} € per ognuna di quelle ore.",
    nota: "I numeri li metti tu. Quanto tempo ti restituisce lo misuriamo con il pilota, sui lavori veri.",
  },
  prezzi: {
    titolo: "Prima lo provi sui tuoi lavori veri. Poi decidi.",
    pilota: "Programma pilota",
    perGiorni: "per 30 giorni",
    pilotaTesto:
      "Preventivi illimitati e assistenza se ti serve. In cambio ci dici cosa non funziona. Richiamiamo in ordine di arrivo. Dal 31° giorno 19,90 € al mese o 199 € l'anno, solo se decidi di restare: nessun rinnovo automatico.",
    candidati: "Candidati",
    posti: "{n} posti",
    postiLiberi: "{n} posti liberi su {totale}",
    ultimoPosto: "Ultimo posto su {totale}",
    esauriti: "Posti esauriti",
    mensile: "Mensile",
    alMese: "al mese",
    perMese: "/mese",
    mensileVoci: ["Preventivi illimitati", "Link di accettazione per il cliente", "Assistenza da una persona"],
    mensileNota: "Nessun costo di avvio. Disdici quando vuoi, senza vincoli.",
    annuale: "Annuale",
    allAnno: "all'anno",
    perAnno: "/anno",
    annualeVoci: ["Tutto quello del mensile", "Due mesi in regalo", "Si rinnova solo se lo chiedi tu"],
    ivaEsclusa: "Prezzi IVA esclusa.",
  },
  domande: {
    titolo: "Le domande che ci fanno tutti",
    nonTrovi: "Non trovi la tua? Scrivici a [{email}](mailto:{email}): rispondiamo noi, non un bot.",
    lista: [
      {
        d: "E se sbaglia?",
        r: "Al cliente non arriva niente senza la tua approvazione. Le voci incerte le vedi evidenziate, quelle che non sono nel listino restano da prezzare, e nessun prezzo è mai inventato.",
      },
      {
        d: "Non sono bravo con il computer.",
        r: "Se sai mandare un vocale su WhatsApp, sai usarlo. Si apre dal browser del telefono, niente da installare, e se ti blocchi ti risponde una persona.",
      },
      {
        d: "I prezzi li so solo io.",
        r: "Appunto: usiamo solo i tuoi. Il listino lo carichi com'è, anche in foto o da vecchi preventivi, e quello che non c'è resta da prezzare finché non lo decidi tu.",
      },
      {
        d: "Non basta un chatbot?",
        r: "Un assistente generico non conosce il tuo listino, quindi i prezzi li stima. Non ripartisce l'IVA con i beni significativi, non fa il PDF con il tuo logo e non raccoglie il sì del cliente.",
      },
      {
        d: "Va bene per il mio mestiere?",
        r: "Se lavori a voci e misure, sì: elettricisti, idraulici, imbianchini, piastrellisti, muratori, cartongessisti, serramentisti, fabbri, giardinieri. Le parole del mestiere le trova nel tuo listino. Con il pilota lo misuriamo anche sui mestieri che non abbiamo ancora provato.",
      },
      {
        d: "Posso raccontarlo nella mia lingua? E se il cliente è straniero?",
        r: "Sì. Scrivi o detti il sopralluogo in rumeno, albanese, arabo, ucraino, spagnolo o un'altra lingua, e la bozza esce in italiano con i prezzi del tuo listino. A voce dipende dal telefono: dove la tua lingua non c'è, la scrivi. E se il cliente parla inglese, tedesco, francese, spagnolo o olandese, gli mandi il preventivo nella sua lingua: la traduzione la controlli tu, e il testo italiano resta accanto e fa fede.",
      },
      {
        d: "Parlo veloce, c'è rumore, uso termini miei.",
        r: "Il sistema conosce le voci del tuo listino e i nomi che usi tu. Se una misura non è chiara, te la richiede invece di tirare a indovinare.",
      },
      {
        d: "Il cliente vuole la carta.",
        r: "Il PDF si stampa come qualunque preventivo. Con il link però accetta in un minuto, senza registrarsi, e tu hai la prova di che cosa ha accettato.",
      },
      {
        d: "Dove finiscono i vocali e i dati dei miei clienti?",
        r: "Listino e preventivi stanno su server nell'Unione Europea. Per preparare la bozza il testo del sopralluogo passa da un servizio di intelligenza artificiale, indicato nella [pagina Privacy](/privacy). Ai nostri server arriva solo il testo, non l'audio, e con te firmiamo l'accordo per il trattamento dei dati dei tuoi clienti.",
      },
      { d: "Devo cambiare il programma delle fatture?", r: "No, tieni il tuo. PreventivoLampo si occupa dei preventivi; le fatture restano dove sono." },
    ],
  },
  candidatura: {
    titolo: "Il prossimo preventivo mandalo dal furgone.",
    testo: "Cerchiamo 10 artigiani per il programma pilota, di qualunque mestiere della casa. Lasciaci i tuoi dati: ti richiamiamo noi, in ordine di arrivo, per capire se fa per te.",
    vederlo:
      "Vuoi vederlo prima di candidarti? [Provalo su WhatsApp]({whatsapp}): il primo messaggio è già scritto, premi invio e poi racconta un sopralluogo. Oppure [prova con un esempio](/prova).",
    scrivere: "Preferisci scrivere? [{email}](mailto:{email})",
    modulo: {
      etichetta: "Candidatura al programma pilota",
      nome: "Nome e cognome",
      mestiere: "Mestiere",
      scegli: "Scegli",
      comune: "Comune",
      cellulare: "Cellulare",
      volume: "Preventivi a settimana",
      privacy: "Ho letto l'[informativa privacy](/privacy) e acconsento a essere ricontattato per il programma pilota.",
      invia: "Invia la candidatura",
      invio: "Invio in corso…",
      conferma: "Grazie, {nome}. Ti richiamiamo entro due giorni lavorativi.",
      errore: "Invio non riuscito. Riprova fra poco o scrivici a studio@kdigitalsolution.it.",
      errori: {
        nome: "Scrivi nome e cognome.",
        mestiere: "Scegli il tuo mestiere.",
        comune: "Scrivi il comune.",
        telefono: "Scrivi un cellulare italiano valido.",
        volume: "Scegli una delle opzioni.",
        privacy: "Serve il consenso per poterti ricontattare.",
      },
      mestieri: {
        Elettricista: "Elettricista",
        Idraulico: "Idraulico",
        Termoidraulico: "Termoidraulico",
        Imbianchino: "Imbianchino",
        Piastrellista: "Piastrellista",
        Muratore: "Muratore",
        Cartongessista: "Cartongessista",
        Serramentista: "Serramentista",
        Falegname: "Falegname",
        Fabbro: "Fabbro",
        Giardiniere: "Giardiniere",
        "Impresa edile": "Impresa edile",
        "Impresa di ristrutturazioni": "Impresa di ristrutturazioni",
        Altro: "Altro",
      },
      volumi: { "1 o 2": "1 o 2", "da 3 a 5": "da 3 a 5", "più di 5": "più di 5" },
    },
  },
  legale: {
    privacy: {
      titolo: "Privacy",
      blocchi: [
        { t: "p", testo: "Questa pagina spiega quali dati personali tratta PreventivoLampo, perché, dove finiscono e per quanto tempo restano." },
        { t: "h2", testo: "Chi tratta i dati" },
        { t: "p", testo: "Titolare del trattamento è Sofiane Khatib, K Digital Solution, Monza (MB). Per qualsiasi richiesta sui tuoi dati scrivi a [{email}](mailto:{email})." },
        {
          t: "p",
          testo:
            "Per i dati dei clienti di un artigiano (nomi, indirizzi dei cantieri, preventivi) il titolare è l'artigiano: noi li trattiamo per suo conto, come responsabile del trattamento, secondo l'accordo che firmiamo con lui.",
        },
        { t: "h2", testo: "Quali dati, perché e per quanto" },
        { t: "h3", testo: "Se ti candidi al programma pilota" },
        {
          t: "ul",
          voci: [
            "Nome, mestiere, comune, cellulare e, se lo indichi, quanti preventivi fai a settimana.",
            "Li usiamo solo per richiamarti e capire se il pilota fa per te (base giuridica: la tua richiesta e il tuo consenso).",
            "Se non entri nel pilota li cancelliamo entro 12 mesi; puoi chiederci di farlo prima in qualunque momento.",
          ],
        },
        { t: "h3", testo: "Se usi l'area artigiani" },
        {
          t: "ul",
          voci: [
            "Email di accesso, dati dell'impresa che inserisci (ragione sociale, partita IVA, indirizzo, telefono, IBAN se lo indichi), logo, listino e preventivi.",
            "Se carichi il listino da PDF o foto, o da vecchi preventivi, l'intelligenza artificiale ne legge solo le voci di prezzo: i nomi dei clienti non vengono trascritti e il file non viene conservato.",
            "Servono per fornirti il servizio (base giuridica: il contratto, anche durante il pilota gratuito).",
            "Restano finché usi il servizio. Quando smetti li cancelliamo entro 30 giorni, salvo quello che la legge ci obbliga a conservare (per esempio le fatture, 10 anni).",
          ],
        },
        { t: "h3", testo: "Se sei il cliente di un artigiano e apri il suo preventivo" },
        {
          t: "ul",
          voci: [
            "Quando accetti o rifiuti un preventivo registriamo il nome che scrivi, data e ora, indirizzo IP e l'impronta del PDF.",
            "Servono all'artigiano come prova dell'accettazione. Li conserviamo per suo conto, finché lui usa il servizio.",
            "Per vedere, correggere o cancellare questi dati puoi rivolgerti all'artigiano o a noi: gli giriamo la richiesta.",
          ],
        },
        { t: "h3", testo: "Se provi PreventivoLampo con un esempio o su WhatsApp" },
        {
          t: "ul",
          voci: [
            "Il testo che scrivi, la bozza che ne nasce e, su WhatsApp, il numero da cui scrivi.",
            "Le bozze di prova si cancellano da sole dopo 7 giorni; su WhatsApp la bozza in attesa della tua risposta resta al massimo un'ora.",
            "Per le prove non scrivere dati di persone reali: bastano lavori inventati.",
            "Per limitare gli abusi conserviamo un'impronta (hash) dell'indirizzo IP, non l'indirizzo in chiaro.",
          ],
        },
        { t: "h2", testo: "A chi li affidiamo" },
        { t: "p", testo: "Usiamo questi fornitori, ciascuno solo per la sua parte:" },
        {
          t: "ul",
          voci: [
            "Supabase: database, accesso all'area e archivio dei PDF, in Irlanda (UE).",
            "Vercel: il sito e le sue funzioni, a Francoforte (UE).",
            "Anthropic (Claude): legge il testo del sopralluogo e prepara la bozza, e traduce le voci del preventivo quando il cliente parla un'altra lingua, negli Stati Uniti.",
            "Twilio e WhatsApp (Meta): ricevono e mandano i messaggi WhatsApp.",
            "n8n: collega i messaggi WhatsApp a PreventivoLampo.",
            "Resend: manda le email con il codice di accesso.",
          ],
        },
        {
          t: "p",
          testo:
            "Quando i dati vanno fuori dall'Unione europea, ci basiamo sulle garanzie previste dal GDPR: la certificazione EU-US Data Privacy Framework o le clausole contrattuali standard della Commissione europea. Non vendiamo i dati e non li usiamo per pubblicità né per addestrare modelli di intelligenza artificiale.",
        },
        { t: "h2", testo: "I tuoi diritti" },
        {
          t: "p",
          testo:
            "Puoi chiederci di vedere i tuoi dati, correggerli, cancellarli, limitarne l'uso, opporti al trattamento o riceverli in un formato leggibile, e ritirare il consenso quando vuoi. Scrivi all'indirizzo qui sopra: rispondiamo entro 30 giorni. Puoi anche presentare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).",
        },
      ],
    },
    condizioni: {
      titolo: "Condizioni del servizio",
      blocchi: [
        {
          t: "p",
          testo:
            "PreventivoLampo è un servizio di Sofiane Khatib, K Digital Solution, Monza (MB). Aiuta artigiani e imprese edili a preparare i preventivi: dal racconto del sopralluogo prepara una bozza con i prezzi del listino dell'impresa, che l'artigiano controlla, approva e manda al cliente. Il servizio è riservato a imprese e professionisti con partita IVA.",
        },
        { t: "h2", testo: "Programma pilota" },
        {
          t: "ul",
          voci: [
            "Dieci posti, assegnati da noi dopo una telefonata.",
            "30 giorni gratuiti dall'avvio, con preventivi illimitati. Il listino lo carichi tu (Excel, PDF o foto); se ti serve, ti assistiamo noi.",
            "Nessun rinnovo automatico: alla fine dei 30 giorni decidi tu se restare. Se non ci dici niente, il pilota finisce lì.",
            "In cambio ti chiediamo di usarlo sui tuoi lavori veri e di dirci cosa funziona e cosa no.",
          ],
        },
        { t: "h2", testo: "Dopo il pilota" },
        {
          t: "ul",
          voci: [
            "Canone: 19,90 € al mese oppure 199 € l'anno, IVA esclusa, con preventivi illimitati. Nessun costo di avvio.",
            "Il mensile si disdice quando vuoi, con effetto alla fine del mese già pagato. L'annuale vale 12 mesi e si rinnova solo se lo chiedi tu.",
            "Se cambiamo i prezzi te lo diciamo almeno 30 giorni prima, e valgono solo dal rinnovo successivo.",
          ],
        },
        { t: "h2", testo: "Il preventivo lo decidi tu" },
        {
          t: "ul",
          voci: [
            "PreventivoLampo propone, tu decidi: nessun preventivo arriva al cliente senza che tu l'abbia aperto e approvato. Prima di approvare controlla voci, quantità e prezzi.",
            "I prezzi vengono solo dal tuo listino. Le voci che non ci sono restano «da prezzare» e il prezzo lo metti tu.",
            "Il calcolo dell'IVA segue le risposte che dai e le regole dell'Agenzia delle Entrate, ma non è consulenza fiscale: per i casi particolari resta il tuo commercialista.",
            "Il rapporto con il cliente, i prezzi e i lavori restano tuoi: PreventivoLampo non è parte del contratto fra te e lui.",
          ],
        },
        { t: "h2", testo: "I tuoi dati restano tuoi" },
        {
          t: "ul",
          voci: [
            "Listino, preventivi e dati dell'impresa sono tuoi. Su richiesta ti mandiamo il listino in Excel e i PDF dei preventivi.",
            "I dati dei tuoi clienti li trattiamo per tuo conto, secondo l'accordo per il trattamento dei dati che firmiamo all'avvio. Come trattiamo gli altri dati è scritto nella pagina Privacy.",
            "Non inserire dati sulla salute o altri dati particolari dei tuoi clienti: al preventivo non servono.",
          ],
        },
        { t: "h2", testo: "Cosa garantiamo e cosa no" },
        {
          t: "ul",
          voci: [
            "Facciamo il possibile perché il servizio funzioni sempre e senza errori, ma la lettura del sopralluogo può sbagliare: per questo ogni bozza va controllata prima di approvarla.",
            "Possono esserci interruzioni per manutenzione o guasti dei fornitori; le grandi manutenzioni te le annunciamo prima.",
            "Nei limiti di legge, e salvo dolo o colpa grave, la nostra responsabilità non supera quanto ci hai pagato negli ultimi 12 mesi. Durante il pilota gratuito il servizio è fornito così com'è.",
          ],
        },
        { t: "h2", testo: "Uso corretto" },
        {
          t: "p",
          testo:
            "Usa PreventivoLampo solo per i preventivi della tua impresa. Non condividere il tuo accesso con persone esterne e non usare il servizio per caricare testi offensivi o richieste in massa. Se queste regole non vengono rispettate possiamo sospendere l'accesso, dopo averti avvisato.",
        },
        { t: "h2", testo: "Modifiche e legge applicabile" },
        {
          t: "p",
          testo:
            "Se cambiamo queste condizioni te lo diciamo via email almeno 30 giorni prima. Valgono la legge italiana e, per le controversie, il foro di Monza. Per qualsiasi domanda scrivi a [{email}](mailto:{email}).",
        },
      ],
    },
    cookie: {
      titolo: "Cookie",
      blocchi: [
        {
          t: "p",
          testo:
            "PreventivoLampo usa solo cookie tecnici: senza, l'area artigiani non saprebbe che sei entrato e il sito non ricorderebbe la lingua che hai scelto. Niente cookie di profilazione, niente statistiche, niente strumenti di terze parti che ti seguono da un sito all'altro. Per questo non trovi un banner dei cookie.",
        },
        {
          t: "ul",
          voci: [
            "**kds-sessione**: tiene aperto l'accesso all'area artigiani, che si fa dall'account di K Digital Solution (lo stesso per tutti i suoi strumenti). Lo mette l'account quando entri, vale su tutti gli indirizzi kdigitalsolution.it, dura 30 giorni dall'ultimo uso e si cancella quando esci.",
            "**pl_lingua**: ricorda la lingua del sito. Lo mettiamo quando scegli una lingua con il selettore o quando apri una pagina in una lingua diversa dall'italiano, e dura un anno.",
          ],
        },
        {
          t: "p",
          testo:
            "I caratteri e le bandiere sono serviti dal sito stesso, non da server esterni. Se un giorno servisse un altro cookie, questa pagina dirà quale, a cosa serve e quanto dura, e se non è tecnico te lo chiederemo prima.",
        },
      ],
    },
  },
  accesso: {
    titolo: "Accedi · PreventivoLampo",
    h1: "Entra nei tuoi preventivi",
    sotto: "Il tuo listino, i tuoi prezzi, i preventivi con il tuo nome sopra.",
    email: "La tua email",
    mandaCodice: "Mandami il codice",
    invioCodice: "Invio il codice…",
    spiegazione: "Ti mandiamo un codice di 6 cifre. Se è la prima volta, con lo stesso codice registri la tua impresa.",
    scritto: "Abbiamo scritto a **{email}**. Se non lo trovi, guarda nella posta indesiderata.",
    codice: "Codice",
    accedi: "Accedi",
    controllo: "Controllo…",
    nuovoTra: "Nuovo codice tra {n} s",
    nuovo: "Mandami un codice nuovo",
    cambiaEmail: "Cambia email",
    errore: "Qualcosa non va. Riprova.",
    condizioni: "Accedendo accetti le [condizioni](/condizioni) e l'[informativa privacy](/privacy).",
  },
  prova: {
    titolo: "Prova il motore",
    h1: "Dal sopralluogo alla bozza",
    testo:
      "Il motore estrae le lavorazioni, le abbina al listino e ti prepara la bozza da controllare. I prezzi vengono solo dal listino: quello che non trova resta da prezzare, quello che manca te lo chiede.",
    nota: "Dati di prova inventati: l'impresa del listino e i clienti degli esempi non esistono. Non inserire nomi, indirizzi o numeri di persone reali: le bozze restano 7 giorni e chiunque abbia il link può aprirle. Il testo libero viene elaborato da un servizio di intelligenza artificiale. [Privacy](/privacy)",
  },
};

// Struttura del dizionario: le stesse chiavi in ogni lingua, solo testi.
type Testi<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly Testi<U>[] : { readonly [K in keyof T]: Testi<T[K]> };
export type Dizionario = Testi<typeof it>;
