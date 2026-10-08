# PreventivoLampo

<img src="public/brand/logo-animato-scuro.gif" alt="Logo animato di PreventivoLampo: il fulmine si traccia sul foglio e si accende" width="480">

> **Progetto dimostrativo.** L'impresa edile del listino e i clienti dei sopralluoghi sono inventati. I numeri invece sono veri: li misura un comando su un banco di prova di 30 casi scritto prima del motore.

**Demo online: [preventivolampo.vercel.app](https://preventivolampo.vercel.app)** — la home racconta il prodotto, [`/progetto`](https://preventivolampo.vercel.app/progetto) è il caso di studio, [`/prova`](https://preventivolampo.vercel.app/prova) fa girare il motore vero. Gli esempi partono subito; per un testo tuo serve un codice d'accesso, perché ogni bozza è una chiamata a pagamento all'API di Claude: chiedimelo.

L'artigiano edile, dopo il sopralluogo, racconta il lavoro come lo direbbe a un collega. PreventivoLampo estrae le lavorazioni, le abbina al suo listino, gli prepara una bozza da controllare dal telefono e, dopo la sua approvazione, genera il PDF del preventivo con l'IVA edile e un link con cui il cliente lo accetta.

**L'AI propone, l'artigiano decide.**
- Nessun prezzo esce dal modello: ogni prezzo viene dal listino o dalla mano dell'artigiano.
- Una lavorazione senza voce sicura nel listino resta **«da prezzare»**, evidenziata, mai completata a fantasia.
- Una misura non detta diventa **una domanda**, mai una stima.
- L'uscita del modello è validata contro uno schema: uscita non valida = errore, non bozza.
- Niente PDF senza l'approvazione esplicita dell'artigiano.

## I numeri

<!-- misura:inizio -->
Da [`misure/2026-10-05b.md`](misure/2026-10-05b.md). Generato da `npm run misura` (non scritto a mano). Modello: `claude-sonnet-5-5`. Casi: 30 eseguiti su 30.

| Misura | Valore |
|---|---|
| Righe giuste senza correzioni (voce, quantità e unità) | 145 su 159 (91,2%) |
| Voci di listino abbinate correttamente | 130 su 137 (94,9%) |
| Voci «da prezzare» riconosciute come tali | 21 su 22 (95,5%) |
| Abbinamenti sbagliati con prezzo di listino (l'errore pericoloso) | 2 |
| **Prezzi inventati** | **0** |
| Domande di chiarimento corrette | 12 su 12 (100,0%); domande in più: 4 |
| Regime IVA corretto (casi con contesto completo) | 15 su 15 |
| Regime IVA dato senza che il vocale bastasse a stabilirlo | 0 su 15 |
| IVA corretta al centesimo (casi calcolabili senza l'artigiano) | 5 su 10 |
| Righe in più rispetto all'atteso | 4 |
| Tempo medio per preventivo | 13,95 s |
| Costo medio per preventivo | $0.0314 ≈ 0,03 € (token reali; $2/$10 per milione di token, cambio 0.86 €/$) |
<!-- misura:fine -->

### Prima e dopo

Dopo la prima misura ho letto gli errori e cambiato tre regole generali: righe separate per le cose che si pagano a parte, una riga anche per quello che è fuori listino, una voce di listino = una riga (in codice, `mergeSameItem`). Rimisurare sugli stessi 30 casi dà un numero ottimistico, perché le regole nascono proprio da quei casi: per questo ho scritto 6 casi nuovi con i loro attesi (`testset/verifica/`) **prima** di farci girare il motore, una volta sola.

<!-- confronto:inizio -->
| Misura | Prima ([`2026-10-05.md`](misure/2026-10-05.md)) | Dopo ([`2026-10-05b.md`](misure/2026-10-05b.md)) | Verifica, 6 casi nuovi ([`2026-10-05-verifica.md`](misure/2026-10-05-verifica.md)) |
|---|---|---|---|
| Righe giuste senza correzioni (voce, quantità e unità) | 138 su 159 (86,8%) | 145 su 159 (91,2%) | 24 su 26 (92,3%) |
| Voci di listino abbinate correttamente | 124 su 137 (90,5%) | 130 su 137 (94,9%) | 25 su 25 (100,0%) |
| Voci «da prezzare» riconosciute come tali | 19 su 22 (86,4%) | 21 su 22 (95,5%) | 1 su 1 (100,0%) |
| Abbinamenti sbagliati con prezzo di listino (l'errore pericoloso) | 7 | 2 | 0 |
| Prezzi inventati | 0 | 0 | 0 |
| IVA corretta al centesimo (casi calcolabili senza l'artigiano) | 6 su 10 | 5 su 10 | 3 su 3 |
| Righe in più rispetto all'atteso | 7 | 4 | 0 |
<!-- confronto:fine -->

Come leggerli: gli attesi dei 30 casi (`testset/atteso/`) sono stati scritti leggendo solo il copione e il listino, prima che il motore esistesse, e non si correggono guardando le uscite. Il report completo, caso per caso, e le uscite grezze del motore sono in `misure/`.

## Come funziona

```
vocale / testo ──► 1. Estrazione (Claude, JSON a schema fisso)
                      cliente, lavorazioni, quantità calcolate dalle misure dette, esclusioni, contesto IVA
                 ──► 2. Candidati (codice deterministico)
                      sinonimi di cantiere, parole della voce, unità di misura → max 8 voci per riga
                 ──► 3. Scelta (Claude, solo fra i candidati, con confidenza)
                 ──► 4. Regole (codice)
                      sotto soglia o fuori dai candidati → «da prezzare»
                      materiale fornito dal cliente su voce «fornitura e posa» → «solo posa», da prezzare
                      quantità mancante o unità diversa dal listino → domanda
                      regime IVA dalle tre risposte (abitazione, tipo di intervento, chi compra i beni)
                 ──► 5. Revisione dal telefono → Approva → PDF → link di accettazione per il cliente
```

- **IVA edile**: 22% / 10% / 10% con beni significativi (DM 29/12/1999). Per i beni significativi il 10% vale sul bene solo fino alla differenza fra il totale e il valore dei beni; l'eccedenza va al 22%. Il test riproduce l'esempio dell'Agenzia delle Entrate (10.000 € di cui 6.000 di beni → 8.000 al 10% e 2.000 al 22%). Il valore del bene lo inserisce l'artigiano; sul PDF c'è sempre «verifica con il commercialista».
- **Listino che impara**: una riga prezzata a mano può diventare una proposta per il listino, che l'artigiano conferma.
- **Importi** sempre in centesimi interi.

## Brand e interfaccia

Ardesia `#343645` come base, lime `#B2F601` solo per l'azione principale, azzurro `#62C0F6` per l'informazione, ambra per le voci da sistemare. Le schermate di lavoro sono chiare e ad alto contrasto (si usano in cantiere, sotto il sole); i contrasti sono verificati da un test (`test/contrasto-token.test.ts`). Il marchio è un foglio con l'orecchia e un fulmine: si anima all'apertura della pagina e nella favicon.

Dalla ricerca sui concorrenti (Jobber, Tradify, Joist, app «vocale → preventivo») sono entrati: stato esplicito di ogni riga con la frase detta accanto, un solo pulsante che porta al prossimo dato mancante, conferma prima dell'approvazione, invio su WhatsApp, linea del tempo approvato → visto → accettato, pagina del cliente col nome dell'impresa in alto e totale in evidenza. Gli esempi della pagina di prova usano l'uscita registrata del motore: sono immediati e non chiamano l'API.

## Stack

Next.js 16 (App Router) e TypeScript, Claude API (`claude-sonnet-5-5`, uscite strutturate), zod per gli schemi, pdf-lib per il PDF, Vitest. Listino di prova dal Prezzario Regionale dei Lavori Pubblici della Lombardia 2026, con la fonte per ogni voce (`dati/listino.json`). I preventivi sono file JSON in locale e oggetti privati su Vercel Blob nella demo online (raggiungibili solo dal server, per id o token casuale); per un servizio reale il disegno prevede Supabase (UE) con RLS.

## Provarlo in locale

```bash
npm install
# crea .env.local con ANTHROPIC_API_KEY=... (mai nel repository)
npm run dev              # http://localhost:3000/prova
npm test                 # test senza rete: Claude è sostituito da un finto
npm run misura           # i 30 casi del banco contro la API vera → misure/AAAA-MM-GG.md
npm run readme           # copia qui sopra la tabella dell'ultima misura
```

Variabili d'ambiente: vedi `.env.example`. Online servono `ANTHROPIC_API_KEY`, `PROVA_ATTIVA=1`, `PROVA_CODICE` e un Blob store collegato al progetto.

Su `/prova` si incolla il testo di un vocale (o si sceglie uno dei 30 sopralluoghi inventati), si corregge la bozza, si approva e si apre il PDF e la pagina del cliente.

## Limiti dichiarati

- **Area imprese (8/10/2026).** Ogni impresa si registra con un codice via email, mette i dati che vanno sul PDF (logo, P.IVA, IBAN, condizioni di pagamento) e il suo listino: import da Excel o CSV con le colonne riconosciute (regole, poi Claude se servono) e controllo riga per riga, oppure il listino d'esempio da correggere. I preventivi usano solo quel listino, hanno la numerazione dell'impresa (2026-001) e l'accettazione del cliente lascia nome, browser, IP e impronta SHA-256 del PDF accettato. Le righe prezzate a mano tornano come proposte da aggiungere al listino. Dati su Supabase (tabelle `pl_*`, RLS chiusa, accesso solo dal server con filtro per impresa): schema in [`supabase/migrations/`](supabase/migrations/).
- **Ingresso testuale.** I numeri sono misurati sulle trascrizioni dei copioni. Il canale è collegato su Slack con n8n (F6, 8/10/2026): si scrive il sopralluogo al bot e la bozza torna nel thread con il link di revisione. WhatsApp funziona dal vivo con la sandbox gratuita di Twilio (8/10/2026): risposta «ricevuto» subito, link della bozza quando si scrive «ok» (l'account di prova ammette solo risposte entro 15 secondi). Con il piano a consumo di Twilio il flusso manda tutto da solo; quello per WhatsApp Cloud API di Meta è pronto e aspetta il numero. Flussi, app Slack e banchi di prova (16 + 17 + 11 + 10 casi) in [`n8n/`](n8n/LEGGIMI.md). La trascrizione degli audio (F4) è predisposta nel flusso: il servizio si sceglie misurandolo sugli stessi 30 casi.
- **Banco piccolo e scritto da noi.** 30 casi, una sola impresa inventata, attesi scritti da un agente AI e rivisti: misurano il motore su questo listino, non su qualunque artigiano.
- **Prezzi da prezzario pubblico**, non i prezzi di un'impresa reale.
- **Non è consulenza fiscale.** Il regime IVA dipende dalle risposte dell'artigiano.
- **Dati**: la demo salva su file locali o su Vercel Blob (Francoforte) e un cron notturno (`/api/pulizia`) cancella tutto quello che non è stato toccato da 7 giorni; Claude API elabora il testo negli USA con clausole contrattuali UE. Per un servizio reale vanno decisi regione dei dati, conservazione degli audio (30 giorni) e informativa.

## Metodo

Costruito con Claude Code e una squadra di agenti (orchestratore, sviluppo, collaudo, legale, ricerca) con revisioni da remoto; architettura, regole e verifiche restano mie. Prima il banco di prova con gli attesi, poi il motore, poi la misura: nessun numero in questa pagina è scritto a mano. Le note di lavoro interne restano in un repository privato; qui ci sono il codice, il banco, le misure e la specifica della home (`documentazione/index/SPEC.md`).
