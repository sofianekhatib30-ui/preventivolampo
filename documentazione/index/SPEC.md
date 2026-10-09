# Index di PreventivoLampo — specifica di realizzazione

Scritta da Claude (cloud) il 2026-09-23, su autorizzazione di Sofiane (D2). Questa è la fonte di verità della home: testi, struttura, stile e comportamento. **I testi si copiano alla lettera** dai file di riferimento; se un testo va cambiato, si cambia prima qui.

## File in questa cartella

| File | Cosa è |
|---|---|
| `riferimento-desktop.html` | La home a 1440 px, HTML statico da aprire nel browser. È il riferimento visivo e dei testi |
| `riferimento-mobile.html` | La home a 390 px, stessi testi adattati |
| `desktop.png`, `mobile.png` | Screenshot a pagina intera dei due riferimenti |
| `Main.dc.html`, `Mobile.dc.html` | Sorgenti del canvas di design su claude.ai (non servono al codice) |

Il riferimento usa stili inline per fedeltà. **Non si copiano gli stili inline nel codice**: si traducono nei token sotto e in Tailwind.

## Dove va

- `app/page.tsx` sostituisce la pagina attuale. Il riquadro «Progetto dimostrativo» sparisce dalla home: la home vende il servizio reale di K Digital Solution (D2). La natura dimostrativa resta per i dati di prova del banco e per il README
- Componenti in `app/(home)/` o `components/home/`, uno per sezione
- `app/privacy/page.tsx`, `app/cookie/page.tsx`, `app/condizioni/page.tsx`: pagine vere, testi di notaio (sotto)
- `app/api/candidatura/route.ts`: ricezione del modulo (sotto)
- Pagina responsive **fluida** tra 360 e 1920 px. I due riferimenti sono i due estremi; il passaggio a una colonna avviene sotto 1024 px

## Token

| Token | Valore | Uso |
|---|---|---|
| `--fondo` | `#F3F0E8` | Sfondo pagina |
| `--fondo-2` | `#E9E4D8` | Sezione prezzi |
| `--superficie` | `#FFFFFF` | Card |
| `--inchiostro` | `#16150F` | Testo, sezione scura, bottoni scuri |
| `--testo-2` | `#3F3D36` | Paragrafi |
| `--testo-3` | `#5C5A52` | Note (contrasto ≥ 4,5:1 su tutti i fondi chiari: verificarlo) |
| `--linea` | `#D9D4C7` | Bordi card |
| `--linea-2` | `#B8B3A5` | Tratteggi, separatori FAQ |
| `--scuro-testo` | `#CFCABB` | Paragrafi su fondo scuro |
| `--scuro-nota` | `#A39E8F` | Note su fondo scuro |
| `--scuro-linea` | `#3A3830` | Bordi su fondo scuro |
| `--segnale` | `#FFC21F` | Giallo segnaletica: **solo come fondo con testo inchiostro**, mai come colore di testo su chiaro |
| `--bolla-mia` | `#D6E9C6` | Bolle dell'artigiano nella chat di esempio |

Font: **Archivo** variabile (assi `wght` 400–900 e `wdth` 62–125) e **IBM Plex Mono** 400/500/600, con `next/font/google` (self-hosting, niente richieste a Google dal browser). Titoli: Archivo 850–900, `font-stretch` 64–70%, interlinea 0,88–0,95, `letter-spacing` −0,015/−0,025em. Testo: Archivo 400–500. Cifre, etichette e scontrini: Plex Mono.

Scala desktop → mobile: H1 96 → 54 px, H2 64 → 42, H2 finale 112 → 58, testo hero 21 → 18, testo 18 → 16. Usare `clamp()`.

Raggi: bottoni 999px, card 24px (20 su mobile), campi 12px. Margini laterali 120px a 1440, 20px a 390.

## Sezioni, in ordine

1. **Header** — logo (fulmine su quadrato giallo + «PreventivoLampo»), menu con 4 ancore, bottone «Diventa artigiano pilota». Su mobile: bottone menu 44×44 che apre un pannello (disclosure con `aria-expanded`, chiusura con Esc e al click su una voce). Header sticky con fondo pieno.
2. **Hero** `#top` — pill, H1, paragrafo, due bottoni, tre punti in mono, figura «Conversazione di esempio» (chat statica, `figure` + `figcaption`). La chat è illustrativa: nessuna animazione obbligatoria. Se si anima, solo con `prefers-reduced-motion: no-preference`.
3. **Come funziona** `#come` — fondo scuro, H2 + frase, `ol` di 4 passi.
4. **Cosa cambia** `#perche` — 5 `article`: listino (con tabella di esempio), nessun prezzo inventato (lista con voce gialla «da prezzare»), IVA edile (a tutta larghezza, con scontrino), impostazione di persona, ultima parola tua.
5. **Confronto** — tabella vera (`table`, `th scope`), 3 colonne. Su mobile diventa una lista di coppie o una tabella scorrevole orizzontalmente con indicazione.
6. **Prezzi** `#prezzi` — pilota (0 € per 30 giorni, 10 posti; 30 giorni e non più 60 deciso da Sofiane il 9/10/2026), nessun costo di avvio, canone 19,90 €/mese oppure 199 €/anno (deciso da Sofiane l'8/10/2026). «Prezzi IVA esclusa».
7. **Domande** `#domande` — 6 domande. Accordion con `details`/`summary` (aperte tutte su desktop è accettabile; su mobile chiuse tranne la prima).
8. **Candidatura** `#candidatura` — fondo giallo, H2, testo, email, **modulo**, footer.

## Il modulo di candidatura

Campi: nome e cognome (obbligatorio), mestiere (select, obbligatorio), comune (obbligatorio), cellulare (obbligatorio, `type=tel`), preventivi a settimana (facoltativo), consenso privacy (obbligatorio, non preselezionato).

- `POST /api/candidatura`, validazione **zod** lato server identica a quella lato client
- Difese: campo esca nascosto, tempo minimo di compilazione (3 s), limite di frequenza per IP (5/ora), lunghezze massime, cellulare italiano normalizzato
- Stati visibili: invio in corso, errore per campo (`aria-describedby`, `aria-invalid`, focus sul primo campo errato), errore generico, **conferma** che sostituisce il modulo: «Grazie, {nome}. Ti richiamiamo entro due giorni lavorativi.»
- Funziona anche senza JavaScript (form HTML con `action`), con JavaScript senza ricaricare
- **Dove si salva:** interfaccia `ArchivioCandidature` con due implementazioni: file JSON locale in sviluppo, Supabase quando la decisione sul database è presa (vedi `per-sofiane.md`). Tabella `candidature_pilota` con RLS attiva e **nessuna** lettura pubblica; scrittura solo dalla route lato server
- Notifica a studio@kdigitalsolution.it: dopo la decisione sul servizio email. Finché manca, niente invio e un `TODO` esplicito nella consegna, non nel codice
- Conservazione: 12 mesi dalla raccolta, poi cancellazione (scriverlo nella privacy)
- Nessun dato inviato a terzi, nessun tracciamento

## Promesse della pagina = requisiti di prodotto

La home promette cose precise. **Non va online in produzione finché ognuna non è vera.** Fabbro scrive `test/promesse-home.test.ts`, sul modello del guard di naivy-os: per ogni riga, la frase è presente nella pagina e il requisito ha un test o una consegna che lo dimostra. Una promessa senza prova fa fallire il test in modalità `PRODUZIONE=1`.

| Promessa nella pagina | Requisito | Dove si prova |
|---|---|---|
| «Lo racconti a voce o lo scrivi» | Dettatura nel browser e testo libero nell'area; WhatsApp di prova solo scritto | `components/preventivo/Dettatura.tsx` |
| «Ti chiede cosa manca» | Domande di chiarimento su quantità/unità mancanti | Banco F2/F3: casi con misura mancante |
| «Nessun prezzo inventato» / «da prezzare» | Nessun prezzo fuori listino; voce non abbinata = «da prezzare» | Misura F3: prezzi inventati = 0 (`misure/2026-10-08.md`) |
| «l'IVA giusta» / ripartizione 10% e 22% | Motore IVA con beni significativi | Test sull'esempio AdE: 4.000 + 6.000 → 8.000 al 10%, 2.000 al 22%, totale 11.240,00 |
| «il cliente riceve il PDF da accettare con un clic» | Link di accettazione senza registrazione | F5 (`test/preventivo-e2e.test.ts`) |
| «Tu vedi quando lo apre e quando dice sì» | Stati inviato / visto / accettato / rifiutato / scaduto | F5 (`test/esempi-visto.test.ts`) |
| «Le voci nuove che prezzi entrano nel tuo listino» | Voce prezzata in revisione → proposta di aggiunta al listino | F5 |
| «server nell'Unione Europea» | Database, storage e funzioni in regione UE; elenco sub-responsabili | Bastione + notaio |
| «Ai nostri server arriva solo il testo, non l'audio» | La dettatura avviene nel browser; nessun audio salvato | `components/preventivo/Dettatura.tsx` |
| «firmiamo l'accordo per il trattamento dei dati» | Modello DPA pronto | Notaio |
| «Nessun rinnovo automatico» / «Disdici quando vuoi» | Condizioni coerenti | Notaio |
| «dei prezzi dal tuo listino» / «6 lingue» | Nessun prezzo fuori listino (per costruzione, misura F3: prezzi inventati = 0); lingue del cliente = `LINGUE` in `lib/preventivi/lingua.ts` (decisione di Sofiane del 9/10/2026: in grande solo garanzie, niente percentuali di voci giuste né dettagli del banco di prova) | `misure/2026-10-08.md`, `lib/preventivi/lingua.ts` |
| «la bozza esce in italiano» | Racconto in un'altra lingua: le voci della bozza sempre in italiano (regola nel prompt di estrazione) | `test/lingue.test.ts` |
| «gli mandi il preventivo nella sua lingua» | Traduzione delle voci controllata dall'artigiano; PDF e pagina bilingui con l'italiano che prevale; niente approvazione se la traduzione manca o non corrisponde alle voci | `test/lingue.test.ts` |

Aggiornata l'8/10/2026 con il rifacimento della home per tutti i mestieri: «Mandi un vocale su WhatsApp» è diventata «Lo racconti a voce o lo scrivi» (il canale WhatsApp con i vocali non è ancora attivo per gli artigiani), e «audio cancellati dopo 30 giorni» è diventata «Ai nostri server arriva solo il testo, non l'audio» (la dettatura avviene nel browser, nessun audio viene salvato).

## SEO, condivisione, dati strutturati

Aggiornata il 9/10/2026 con le pagine indicizzabili (ricerca SEO del 9/10/2026).

- **Pagine pubbliche** in `app/(sito)/[lang]/`, generate statiche per ognuna delle 10 lingue: home, `/mestieri` e le 12 pagine `/preventivo-<mestiere>`, `/funzioni` e 4 funzioni, `/prezzi`, `/guide` e 5 guide, `/glossario`, `/modelli`, `/chi-siamo`, pagine legali. L'elenco vive in `lib/contenuti/registro.ts` (`percorsiPubblici`), non si ricopia.
- **Testi** in `lib/contenuti/it/` (forma in `lib/contenuti/tipi.ts`); le altre lingue in `lib/contenuti/<lingua>.json`, generate con `npm run traduci:contenuti` e controllate da `test/contenuti.test.ts`. Le pagine mestiere mostrano la bozza che il sistema ha ricavato davvero dal racconto inventato della pagina (`npm run esempi:mestieri`, file `lib/contenuti/esempi/esempi.json`), senza prezzi. Modelli gratuiti in PDF ed Excel per mestiere: `npm run genera:modelli` → `public/modelli/`.
- **Indirizzi per lingua**: italiano senza prefisso, le altre in sottocartella (`/ro/preventivo-idraulico`), gli indirizzi restano in italiano. Lo decide `proxy.ts`: riscrive le pagine italiane su `/it/…`, rimanda `/it/…` alla versione senza prefisso (301), porta alla lingua scelta solo chi ha il cookie `pl_lingua` (302). Area, accettazione, prova e API restano fuori (`app/(app)/`, lingua dal cookie).
- **Indicizzazione**: solo con `INDEXABLE` acceso in `lib/sito.ts` (oggi spento: dominio definitivo da decidere) e solo per le lingue in `LINGUE_INDICIZZATE` (`it`, `en`, `ro`, `sq`): hreflang reciproci con `x-default` sull'italiano, canonical sulla propria lingua, sitemap con le alternative. Le altre lingue esistono in `noindex`. In anteprima Vercel `robots.txt` blocca sempre tutto.
- **Metadata** da `lib/seo.ts`; immagini Open Graph per pagina con `lib/brand/immagine-og.tsx` (carattere incluso in `next/og`, nessuna richiesta a domini terzi).
- **JSON-LD**: Organization, WebSite e SoftwareApplication con le tre offerte (home, solo a candidature aperte, e `/prezzi`); BreadcrumbList su tutte le pagine interne; Article sulle guide; DefinedTermSet sul glossario. Nessuna valutazione né recensione.
- Prima di accendere `INDEXABLE`: dominio definitivo in `SITO_URL`, revisione madrelingua di rumeno e albanese, verifica dei volumi delle parole chiave, Search Console e Bing.

## Accessibilità (WCAG 2.1 AA, verificata con axe e a mano)

- Link «Salta al contenuto» come primo elemento
- Un solo H1; gerarchia H2/H3 come nel riferimento
- Focus visibile ovunque: contorno 3px inchiostro con offset 3px; sul giallo lo stesso
- Target ≥ 44×44 px
- Il giallo non porta mai significato da solo: le voci «da prezzare» hanno anche il testo
- Le forme d'onda e i loghi SVG sono `aria-hidden`; la bolla vocale ha un'etichetta
- `scroll-behavior: smooth` solo con `prefers-reduced-motion: no-preference`; le ancore tengono conto dell'header sticky (`scroll-margin-top`)

## Prestazioni

- Pagina statica (Server Components), JavaScript client solo per menu mobile e modulo
- Lighthouse mobile ≥ 95 in tutte e quattro le categorie, LCP < 2,0 s, CLS < 0,05
- Nessuna immagine raster sopra la piega: tutto è testo e SVG
- Nessuno script di terze parti. Nessun cookie non tecnico, quindi **niente banner cookie**; la pagina cookie lo dichiara

## Pagine legali (notaio, bozza da far rivedere a un legale prima della produzione)

- **Privacy** del modulo: titolare K Digital Solution (dati societari da `per-sofiane.md`), finalità (ricontatto per il programma pilota), base giuridica (misure precontrattuali su richiesta dell'interessato), conservazione 12 mesi, diritti, contatto
- **Cookie**: solo tecnici, elenco
- **Condizioni** del servizio e del programma pilota: 30 giorni gratuiti senza rinnovo automatico, canone mensile disdicibile, l'artigiano resta responsabile del preventivo che approva, IVA indicativa da verificare col commercialista, recesso per contratti fuori dai locali commerciali (da verificare)

## Collaudo prima di dire «fatto»

Sentinella verifica, e allega le prove nella consegna:
1. Confronto visivo a 1440 e a 390 px con `desktop.png` e `mobile.png` (Playwright, screenshot a pagina intera)
2. Larghezze intermedie 768 e 1024: niente scorrimento orizzontale, niente testo tagliato
3. axe senza violazioni serie; navigazione completa da tastiera, menu e modulo compresi
4. Modulo: invio valido, ogni campo mancante, campo esca, invio troppo rapido, sesto invio in un'ora
5. Lighthouse mobile con i valori sopra
6. `npm run build`, `npm test`, `npm run lint` verdi

## Da non fare

- Niente testimonianze, loghi di clienti, numeri di risultato o «+N artigiani»: non esistono ancora
- Niente nomi di concorrenti
- Niente emoji, gradienti, effetti di sfondo
- Il giallo non diventa colore del testo su fondo chiaro
