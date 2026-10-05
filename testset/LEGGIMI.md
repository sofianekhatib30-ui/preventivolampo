# Banco di prova — PreventivoLampo (F2)

**Tutti i dati di questa cartella sono inventati.** Clienti, indirizzi e sopralluoghi non corrispondono a persone o lavori reali; l'impresa del listino (`dati/listino.json`) è fittizia.

## Cosa c'è

- `copioni/01.md … 30.md`: 30 monologhi di artigiani edili della zona Monza e Brianza/Milano, scritti come un vocale mandato dopo un sopralluogo: frasi spezzate, ripensamenti, misure approssimate, qualche termine dialettale lombardo o di cantiere. Mestieri: muratore, piastrellista, imbianchino, idraulico, elettricista. Due casi non riguardano un'abitazione (un negozio e un ufficio).
- `atteso/01.json … 30.json`: il risultato atteso per ogni copione, conforme a `ExpectedCase` in `lib/banco/schema.ts`: righe con quantità, unità e voce del listino (oppure «da prezzare»), domande per le misure mancanti, contesto e regime IVA, esclusioni e note.
- `per-registrare.md`: la lista dei vocali da registrare, con durata stimata e una nota di intonazione per caso.
- `audio/`: i vocali, quando ci saranno.

La verifica è `npx vitest run test/banco.test.ts`.

## Come sono stati scritti gli attesi

Gli attesi sono stati scritti da Claude (agente di Maestro) il 23 settembre 2026, **prima che esistesse il motore di estrazione**, leggendo solo il copione e la `description` delle voci del listino. Descrivono che cosa ricaverebbe un artigiano esperto, non che cosa produce il motore. Regole seguite:

- una voce si abbina al listino solo se la sua `description` copre davvero la lavorazione; altrimenti è `da_prezzare` con il motivo;
- se il cliente fornisce il materiale di una voce che il listino ha come fornitura e posa, la riga è `da_prezzare` («solo posa») con `clientSuppliesMaterial: true`;
- una quantità o un'unità non detta è `null` e ha la sua domanda: mai una stima;
- il contesto IVA si valorizza solo se il copione lo dice; altrimenti `null`, e il regime atteso è `null`.

**Un atteso non si corregge guardando l'uscita del motore.** Se un atteso è sbagliato, lo si corregge rileggendo il copione e il listino, e lo si scrive nella consegna.

## Come registrare i vocali

- Un file per caso: `testset/audio/NN.ogg` oppure `testset/audio/NN.m4a` (es. `07.m4a`). Va bene il vocale di WhatsApp o di Telegram salvato così com'è.
- Leggere il copione con naturalezza, come se lo mandassi a un collega: non recitarlo, non scandirlo.
- Si possono aggiungere esitazioni, «ehm», pause, rumori di fondo, un accento più marcato.
- **Non si cambiano numeri, misure, quantità né lavorazioni**, e non si tolgono le autocorrezioni: l'atteso è scritto su quelle parole.
- Il commento in testa al file (`<!-- Caso NN — dati inventati -->`) non si legge.
