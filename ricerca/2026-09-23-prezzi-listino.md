# Prezzi per il listino di prova (F1) — fonti pubbliche

Vedetta, 2026-09-23. Fonti consultate e scaricate il **2026-09-23**.
Questo documento **non costruisce il listino**: raccoglie 94 voci di prezzo con fonte, da cui sceglierne circa 80. Nessun prezzo è stimato: ogni cifra è copiata dalla fonte e riscontrata due volte (file XLS ufficiale e PDF ufficiale, vedi «Come ho verificato»).

Il file macchina è `ricerca/2026-09-23-prezzi-listino.csv` (stesse 94 voci, URL completo per ogni riga).

## Fonte

**Unica fonte usata, primaria [P]:** *Prezzario Regionale dei Lavori Pubblici* di Regione Lombardia, **edizione 2026**, approvato con D.G.R. n. XII/6071 del 27 aprile 2026 (pubblicato sul BURL il 4 maggio 2026). Validità: fino al 31/12/2026, uso transitorio fino al 30/06/2027 (dalla «Guida alla lettura del Prezzario 2026», sezione «Validità e ambito di applicazione»).

Pagina ufficiale da cui partono tutti i file: https://www.regione.lombardia.it/infrastrutture-trasporti-e-mobilita/opere-pubbliche/prezzario-regionale-dei-lavori-pubblici/ser-prezzario-infr

| Sigla | Documento (PDF, cartella «allegati-corretti») | URL |
|---|---|---|
| P1 | Parte 1 — Elenco prezzi Civile, Urbanizzazione, Difesa Suolo, Agroforestale | https://www.regione.lombardia.it/content/dam/rl/canali-tematici-servizi/09-infrastrutture-trasporti-e-mobilit%C3%A0/01-acquisti-e-contratti-pubblici/02-prezzario-regionale-dei-lavori-pubblici/02-prezzario-regionale-dei-lavori-pubblici-infr/allegati/allegato-2026-unico/allegati-corretti/all-parte-1-elenco-prezzi-civile-urbanizzazione-difesa-suolo-agroforestale.pdf |
| P2 | Parte 2 — Elenco prezzi Impianti meccanici, elettrici, elettrotecnici, idraulici e antincendio | https://www.regione.lombardia.it/content/dam/rl/canali-tematici-servizi/09-infrastrutture-trasporti-e-mobilit%C3%A0/01-acquisti-e-contratti-pubblici/02-prezzario-regionale-dei-lavori-pubblici/02-prezzario-regionale-dei-lavori-pubblici-infr/allegati/allegato-2026-unico/allegati-corretti/all-parte-2-elenco-prezzi-impianti-meccanici-elettrici-elettrotecnici-idraulici-e-antincendi.pdf |
| P3 | Parte 3 — Elenco prezzi Risorse elementari (manodopera) | https://www.regione.lombardia.it/content/dam/rl/canali-tematici-servizi/09-infrastrutture-trasporti-e-mobilit%C3%A0/01-acquisti-e-contratti-pubblici/02-prezzario-regionale-dei-lavori-pubblici/02-prezzario-regionale-dei-lavori-pubblici-infr/allegati/allegato-2026-unico/allegati-corretti/all-parte-3-elenco-prezzi-risorse-elementari-umane-materiali-strumentali-e-produttive-tecnologiche.pdf |
| P4 | Parte 4 — Elenco prezzi Precedente struttura | https://www.regione.lombardia.it/content/dam/rl/canali-tematici-servizi/09-infrastrutture-trasporti-e-mobilit%C3%A0/01-acquisti-e-contratti-pubblici/02-prezzario-regionale-dei-lavori-pubblici/02-prezzario-regionale-dei-lavori-pubblici-infr/allegati/allegato-2026-unico/allegati-corretti/all-parte-4-elenco-prezzi-precedente-struttura.pdf |
| XLS | Archivio ufficiale in formato tabellare (usato per l'estrazione) | https://www.regione.lombardia.it/content/dam/rl/canali-tematici-servizi/09-infrastrutture-trasporti-e-mobilit%C3%A0/01-acquisti-e-contratti-pubblici/02-prezzario-regionale-dei-lavori-pubblici/02-prezzario-regionale-dei-lavori-pubblici-infr/allegati/allegato-2026-unico/allegati-27-05/Prezzario_2026_LOM261_XLS.zip |

## Come si leggono i prezzi

- **Prezzo = costo + spese generali (15%) + utile d'impresa (10%)**, cioè il 26,5% complessivo sul costo, **IVA esclusa**. Lo dice la Guida alla lettura, paragrafi «Termini Generali» («Prezzo: … si ottiene a partire dal costo, aggiungendo le spese generali (S.G.) e gli utili d'impresa (U.I.)»; «Costo: … al netto delle spese generali (S.G.), dell'utile d'impresa (U.I.) e dell'IVA») e «Analisi del Prezzo». La colonna «senza SG e UI» riporta l'«Importo senza S.G. e U.I.» stampato accanto al prezzo nella fonte.
- Le voci con codice `LOM261.OC.…` sono **opere compiute**: la Guida le definisce «Sommatoria di un'opera e di un lavoro», cioè fornitura del materiale più posa. Le voci `LOM261.1C…`, `1E…`, `1M…`, `NC…` vengono dalla Parte 4 («precedente struttura»): la Guida della Parte 4 avverte che queste voci «non dispongono di analisi prezzi in chiaro» e non compaiono sulla Piattaforma digitale.
- **Unità di misura** come nella fonte (la fonte scrive «1 m²», «1 cad»: ho tolto l'«1»). Gli oneri di discarica sono in **100 kg**. Le due assistenze murarie (`LOM261.1C.28.100.0010.b` e `LOM261.1C.28.200.0010.b`) sono in **%**: il numero è una percentuale da applicare all'importo degli impianti, non euro.
- **Il riferimento stabile è il codice**, che è l'identità della voce nella fonte. La pagina è il numero di pagina *del file PDF* (quello che mostra il lettore), non il numero stampato a piè di pagina, che è diverso (esempio: P4 pagina del file 136 = pagina stampata «114»). «ex …» è il codice della stessa voce nella codifica precedente, come riportato dal file XLS nella colonna «Codice RL 2023».
- Descrizioni abbreviate da me, senza aggiungere contenuto: la declaratoria completa si legge nella fonte cercando il codice.

## Voci (94)

### demolizioni e rimozioni

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 1 | `LOM261.OC.EEA.Mc01.C0100.H0002.0000.-` | Demolizione di tramezzo interno in lastre di gesso rivestito (cartongesso), per ogni lastra di spessore fino a 2,5 cm. Escluso carico, trasporto e oneri di smaltimento | m² | 4,13 | 3,26 | P1 p. 711 — ex 1C.01.070.0010.i |
| 2 | `LOM261.OC.EEA.Mc01.C0100.Za001.0010.a` | Demolizione di tramezzo interno in blocchi forati intonacato o rivestito, spessore fino a 7 cm. Escluso carico, trasporto e oneri di smaltimento | m² | 10,73 | 8,48 | P1 p. 713 — ex 1C.01.070.0010.a |
| 3 | `LOM261.OC.EEA.Mc01.C0100.Za001.0010.b` | Demolizione di tramezzo interno in blocchi forati intonacato o rivestito, spessore fino a 11 cm. Escluso carico, trasporto e oneri di smaltimento | m² | 15,54 | 12,29 | P1 p. 713 — ex 1C.01.070.0010.b |
| 4 | `LOM261.OC.EEA.Mc01.C1206.Za000.0250.-` | Demolizione di pavimento interno in piastrelle (cemento, ceramica, cotto) con malta di allettamento. Incluso carico e trasporto macerie a impianto. Esclusi oneri di smaltimento | m² | 11,29 | 8,92 | P1 p. 719 — ex 1C.01.100.0010.a |
| 5 | `LOM261.OC.EEA.Mc04.C1220.L0002.0250.-` | Rimozione di rivestimento in piastrelle di ceramica/gres con malta o collante, con conservazione del supporto. Incluso carico e trasporto a impianto. Esclusi oneri di smaltimento | m² | 20,50 | 16,21 | P1 p. 729 — ex 1C.01.120.0010.a |
| 6 | `LOM261.OC.EEA.Mc01.C0915.Za001.0000.b` | Demolizione manuale di massetto interno per pavimenti, spessore 5 cm (esclusi massetti a secco). Escluso carico, trasporto e oneri di smaltimento | m² | 10,35 | 8,18 | P1 p. 717 — ex 1C.01.100.0020.b |
| 7 | `LOM261.OC.EEA.Mc04.C1240.Za000.0000.-` | Rimozione di battiscopa in piastrelle (ceramica, gres, marmo). Incluso carico e trasporto a impianto. Esclusi oneri di smaltimento | m | 2,13 | 1,69 | P1 p. 731 — ex 1C.01.120.0020.a |
| 8 | `LOM261.1C.01.170.0010` | Rimozione di apparecchi igienico-sanitari con smontaggio di rubinetterie e accessori, abbassamento, carico e trasporto a impianto. Esclusi oneri di smaltimento | cad | 28,99 | 22,92 | P4 p. 48 |
| 9 | `LOM261.1C.01.170.0020.a` | Rimozione delle linee di alimentazione acqua calda e fredda degli apparecchi sanitari fino alle valvole e degli scarichi fino alla colonna, da murature che non vengono demolite, comprese demolizioni a parete e pavimento. Esclusi oneri di smaltimento | cad | 115,22 | 91,08 | P4 p. 48 |
| 10 | `LOM261.1C.01.090.0020.a` | Scrostamento di intonaco interno o esterno fino al vivo della muratura, in buono stato di conservazione, compresi piani di lavoro, pulizia, carico e trasporto a impianto. Esclusi oneri di smaltimento | m² | 14,67 | 11,60 | P4 p. 48 |
| 11 | `LOM261.OC.EEA.Mc04.C3310.Qa000.0000.b` | Rimozione di porta in legno interna o esterna con controtelaio, telaio, imbotte e mostre, con cernita vetro e legno. Escluso carico e trasporto a deposito o discarica | m² | 16,10 | 12,73 | P1 p. 733 — ex 1C.01.140.0010.b |
| 12 | `LOM261.1E.02.070.0010` | Rimozione di punto di utilizzo elettrico su impianto in opera, con sfilaggio dei cavi sotto traccia e delle apparecchiature di comando, trasporto e conferimento a smaltimento | cad | 10,65 | 8,42 | P4 p. 139 |

### trasporto e smaltimento

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 13 | `LOM261.1C.27.050.0100.d` | Oneri di conferimento di rifiuti misti da costruzione e demolizione (CER 170904) a impianto di smaltimento autorizzato per rifiuti inerti | 100 kg | 3,54 | 2,80 | P4 p. 136 |
| 14 | `LOM261.1C.27.050.0100.e` | Oneri di conferimento di rifiuti misti da costruzione e demolizione (CER 170904) a impianto di smaltimento autorizzato per rifiuti non pericolosi | 100 kg | 8,49 | 6,71 | P4 p. 136 |
| 15 | `LOM261.1C.27.050.0100.f` | Oneri di conferimento di rifiuti misti da costruzione e demolizione (CER 170904) a impianto di recupero autorizzato | 100 kg | 1,99 | 1,57 | P4 p. 136 |
| 16 | `LOM261.1C.27.050.0100.g` | Oneri di conferimento di rifiuti da costruzione e demolizione in legno (CER 170201) a impianto di recupero autorizzato | 100 kg | 18,52 | 14,64 | P4 p. 136 |
| 17 | `LOM261.NC.90.050.0050` | Carico esclusivamente manuale di materiali sfusi (macerie, terre), trasporto a discarica autorizzata a qualsiasi distanza e scarico | m³ | 30,04 | 23,75 | P4 p. 243 |
| 18 | `LOM261.NC.80.050.0010` | Solo trasporto di materiali sciolti già caricati sul mezzo, a discarica o impianto di riciclaggio a qualsiasi distanza, e scarico | m³ | 15,56 | 12,30 | P4 p. 238 |

### bagni

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 19 | `LOM261.OC.EEA.Pa01.N8220.L0008.0000.-` | Vaso igienico a pavimento in vitreous-china bianco con viteria, raccordo di scarico e guarnizioni, installato (cassetta esclusa) | cad | 226,33 | 178,91 | P1 p. 82 — ex 1M.11.010.0010.a |
| 20 | `LOM261.OC.EEA.Pa01.N8220.L0008.0015.-` | Vaso igienico sospeso in vitreous-china bianco con telaio metallico da incasso, mensole, raccordo di scarico e guarnizioni, installato | cad | 241,02 | 190,53 | P1 p. 82 — ex 1M.11.010.0010.d |
| 21 | `LOM261.OC.EEA.Pa01.N9705.Za001.0000.-` | Cassetta di lavaggio da incasso per vaso, capacità minima 10 l, con comando a pulsante, placca, tubo di allacciamento e guarnizioni, installata | cad | 190,10 | 150,28 | P1 p. 91 — ex 1M.11.010.0030.f |
| 22 | `LOM261.OC.EEA.Pa01.N8230.L0012.0000.-` | Bidet a pavimento in vetrochina bianco con viti di fissaggio, installato (rubinetteria esclusa) | cad | 136,88 | 108,21 | P1 p. 84 — ex 1M.11.030.0010.a |
| 23 | `LOM261.OC.EEA.Pa01.N8225.L0012.0005.-` | Lavabo a parete in vetrochina bianco da 65 cm con mensole, installato (rubinetteria esclusa) | cad | 123,02 | 97,25 | P1 p. 83 — ex 1M.11.020.0010.b |
| 24 | `LOM261.OC.EEA.Pa01.N8240.L0013.0005.-` | Piatto doccia quadrato in fireclay bianco 80x80 cm, installato | cad | 181,82 | 143,73 | P1 p. 86 — ex 1M.11.050.0010.b |
| 25 | `LOM261.OC.EEA.Pa01.N8235.Sb001.0005.-` | Vasca da bagno in acciaio smaltato bianco 170x70 cm da rivestire, installata | cad | 157,20 | 124,27 | P1 p. 85 — ex 1M.11.040.0010.b |
| 26 | `LOM261.OC.EEA.Pa29.I8234.Za001.0000.-` | Miscelatore monocomando per lavabo da 1/2 pollice con bocca fissa, scarico a saltarello e tubi di allacciamento, montato | cad | 107,44 | 84,93 | P2 p. 1776 — ex 1M.11.020.0040.a |
| 27 | `LOM261.OC.EEA.Pa29.I8234.Za001.0025.-` | Miscelatore monocomando per bidet da 1/2 pollice con bocca fissa, scarico a saltarello e raccordi flessibili, montato | cad | 123,10 | 97,31 | P2 p. 1777 — ex 1M.11.030.0020 |
| 28 | `LOM261.OC.EEA.Pa29.I8234.Za001.0040.-` | Miscelatore monocomando da incasso per doccia da 1/2 pollice con braccio e soffione anticalcare orientabile, montato | cad | 139,93 | 110,62 | P2 p. 1777 — ex 1M.11.050.0020.b |
| 29 | `LOM261.OC.EEA.Pa29.I7800.Za001.0750.-` | Gruppo di scarico per doccia con pozzetto sifonato e piletta grigliata, montato | cad | 52,69 | 41,65 | P2 p. 1770 — ex 1M.11.050.0030 |
| 30 | `LOM261.OC.EEA.Pa02.C1220.L0005.0010.-` | Rivestimento in piastrelle di gres porcellanato 20x20 cm liscio colore chiaro, prima scelta, con pezzi speciali e collante, posato su idoneo intonaco con stuccatura giunti. Esclusa assistenza muraria | m² | 50,62 | 40,02 | P1 p. 237 — ex 1C.19.050.0040.c |
| 31 | `LOM261.OC.EEA.Pa02.C1220.L0001.0000.-` | Rivestimento in piastrelle di monocottura smaltata 20x20 cm, con pezzi speciali e collante, posato su idoneo intonaco con stuccatura giunti. Esclusa assistenza muraria | m² | 48,92 | 38,67 | P1 p. 234 — ex 1C.19.050.0020.a |

### cucine

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 32 | `LOM261.OC.EEA.Pa01.N8210.Sb008.0000.-` | Lavello da semi-incasso in acciaio inox 1 bacino con scolapiatti 90x50 cm, con mensole, installato | cad | 148,28 | 117,22 | P1 p. 80 — ex 1M.11.060.0020.a |
| 33 | `LOM261.OC.EEA.Pa29.I8234.Za001.0050.-` | Miscelatore monocomando per lavello da 1/2 pollice con bocca girevole e tubi di allacciamento, montato | cad | 142,08 | 112,31 | P2 p. 1777 — ex 1M.11.060.0040.a |
| 34 | `LOM261.OC.EEA.Pa29.I7800.Za001.0260.-` | Gruppo di scarico per lavello a 1 bacino con piletta, tappo e sifone ispezionabile, montato | cad | 58,70 | 46,40 | P2 p. 1770 — ex 1M.11.060.0050.a |
| 35 | `LOM261.OC.EEA.Pa02.C1220.L0001.0020.-` | Rivestimento in piastrelle di monocottura smaltata in tinta unita 30x30 cm, con pezzi speciali e collante, posato su idoneo intonaco. Esclusa assistenza muraria | m² | 54,89 | 43,39 | P1 p. 235 — ex 1C.19.050.0020.e |
| 36 | `LOM261.OC.EEA.Pa02.C1220.L0010.0010.-` | Rivestimento in piastrelle di maiolica smaltata in tinta unita 20x20 cm, con pezzi speciali e collante, posato su idoneo intonaco. Esclusa assistenza muraria | m² | 51,02 | 40,33 | P1 p. 239 — ex 1C.19.050.0010.c |
| 37 | `LOM261.OC.EEA.Pa01.G8235.Za001.1015.-` | Punto presa da incasso 2P+T 16 A con interruttore bipolare, completo di tubo, conduttori, scatola, frutto e placca e linea fino al punto di alimentazione | cad | 53,32 | 42,15 | P2 p. 813 — ex 1E.02.060.0015.k |

### tinteggiature e rasature

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 38 | `LOM261.OC.EEA.Pa06.C1234.Ca000.0000.-` | Idropittura traspirante semilavabile per interni su intonaco civile o gesso già preparato, 2 mani. Esclusi assistenza muraria e piani di lavoro | m² | 5,37 | 4,24 | P1 p. 596 — ex 1C.24.120.0020.b |
| 39 | `LOM261.OC.EEA.Pa06.C1234.Ca015.0000.-` | Idropittura vinilica traspirante lavabile per interni su intonaco già preparato, 2 mani. Esclusi assistenza muraria e piani di lavoro | m² | 5,08 | 4,02 | P1 p. 599 — ex 1C.24.120.0020.a |
| 40 | `LOM261.OC.EEA.Pa06.C1234.Ca012.0000.-` | Idropittura acrilica traspirante superlavabile per interni (oltre 5000 colpi spazzola) su intonaco già preparato, 2 mani. Esclusi assistenza muraria e piani di lavoro | m² | 5,47 | 4,32 | P1 p. 597 — ex 1C.24.120.0020.c |
| 41 | `LOM261.OC.EEA.Pa06.C1234.Ca012.0005.-` | Idropittura acrilica traspirante lavabile per interni (oltre 10000 colpi spazzola) su intonaco già preparato, 2 mani. Esclusi assistenza muraria e piani di lavoro | m² | 6,11 | 4,83 | P1 p. 597 — ex 1C.24.120.0020.d |
| 42 | `LOM261.OC.EEA.Pa06.C1234.Ca028.0000.-` | Pittura alchidica (smalto) lucida o satinata per interni su intonaco già preparato, 2 mani. Esclusi assistenza muraria e piani di lavoro | m² | 7,39 | 5,84 | P1 p. 600 — ex 1C.24.120.0030.b |
| 43 | `LOM261.1C.24.100.0020.a` | Trattamento delle superfici prima di rasature o pitturazioni con primer in dispersione acquosa a rullo o pennello, compresi piani di lavoro interni | m² | 2,50 | 1,98 | P4 p. 111 |
| 44 | `LOM261.1C.24.100.0020.e` | Trattamento delle superfici con liquido antimuffa, antibatterico, antialghe a pennello o rullo con successiva spazzolatura, compresi piani di lavoro interni | m² | 2,53 | 2,00 | P4 p. 111 |
| 45 | `LOM261.1C.24.100.0010` | Stuccatura saltuaria di superfici interne con stucco emulsionato su scalfitture, fori e cavillature, con carteggiatura delle zone stuccate | m² | 2,38 | 1,88 | P4 p. 111 |
| 46 | `LOM261.1C.24.710.0010.a` | Raschiatura saltuaria di vecchie pitture con limitati distacchi su supporti murari conservati, con rimozione di chiodi e ganci e spolveratura | m² | 1,95 | 1,54 | P4 p. 112 |
| 47 | `LOM261.1C.24.710.0020.a` | Rasatura dell'intera superficie interna con stucco emulsionato ad una mano e carteggiatura, su vecchie pitturazioni raschiate | m² | 7,89 | 6,24 | P4 p. 112 |
| 48 | `LOM261.1C.24.710.0020.b` | Rasatura dell'intera superficie interna con stucco emulsionato a due mani con doppia carteggiatura, su vecchie pitturazioni raschiate | m² | 13,16 | 10,40 | P4 p. 112 |

### pavimenti

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 49 | `LOM261.OC.EEA.Pa02.C1206.L0005.0220.-` | Pavimento interno in piastrelle di gres porcellanato smaltato colore chiaro 30x30 cm, posato su letto di malta con boiacca. Esclusi sottofondo e assistenza muraria | m² | 55,98 | 44,25 | P1 p. 172 — ex 1C.18.150.0030.e |
| 50 | `LOM261.OC.EEA.Pa02.C1206.L0005.0260.-` | Pavimento interno in piastrelle di gres porcellanato liscio colore chiaro 30x30 cm, posato su letto di malta con boiacca. Esclusi sottofondo e assistenza muraria | m² | 42,17 | 33,34 | P1 p. 173 — ex 1C.18.200.0030.g |
| 51 | `LOM261.OC.EEA.Pa02.C1206.L0001.0020.-` | Pavimento interno in piastrelle di monocottura smaltata in tinta unita 30x30 cm, posato su letto di malta con boiacca. Esclusi sottofondo e assistenza muraria | m² | 54,88 | 43,38 | P1 p. 161 — ex 1C.18.150.0010.e |
| 52 | `LOM261.OC.EEA.Pa02.C1206.Qa005.0000.-` | Pavimento in listoni di rovere 60-120 x 6-7 cm spessore 2,2 cm su magatelli, con levigatura e ceratura. Esclusa assistenza muraria | m² | 120,41 | 95,18 | P1 p. 196 — ex 1C.18.400.0010.a |
| 53 | `LOM261.OC.EEA.Pa02.C1206.Qb003.0000.-` | Pavimento in laminato HDF effetto legno spessore 8 mm classe AC5, con materassino antirumore. Esclusa assistenza muraria | m² | 58,10 | 45,93 | P1 p. 200 — ex 1C.18.400.0040 |
| 54 | `LOM261.OC.EEA.Pa02.C1206.D0017.0000.-` | Pavimento vinilico multistrato in listoni PVC effetto legno spessore 2 mm incollati, compresa rasatura del sottofondo esistente. Esclusa assistenza muraria | m² | 39,63 | 31,33 | P1 p. 136 — ex 1C.18.450.0065.a |
| 55 | `LOM261.OC.EEA.Pa30.C1206.Qa000.0255.-` | Levigatura meccanica di pavimento in legno esistente con verniciatura a 3 mani di vernice trasparente e pulizia finale. Esclusa assistenza muraria | m² | 25,98 | 20,54 | P1 p. 692 — ex 1C.18.400.0060.b |
| 56 | `LOM261.OC.EEA.Pa04.C0915.J0001.0005.a` | Massetto sabbia-cemento (dosaggio 300 kg/m³) spessore 5 cm tirato in perfetto piano a mano, per pavimenti incollati | m² | 25,08 | 19,83 | P1 p. 511 — ex 1C.08.050.0030 |
| 57 | `LOM261.OC.EEA.Pa04.C0915.J0004.0005.a` | Massetto alleggerito con argilla espansa spessore 5 cm steso con mezzo meccanico, per pavimenti posati a malta. Esclusa installazione pompa autocarrata | m² | 22,14 | 17,50 | P1 p. 514 — ex 1C.08.100.0020 |
| 58 | `LOM261.OC.EEA.Pa04.C0915.J0018.0000.a` | Massetto autolivellante a base di anidrite spessore 4 cm su supporto isolato con polietilene | m² | 30,62 | 24,21 | P1 p. 519 — ex 1C.08.250.0030.a |
| 59 | `LOM261.OC.EEA.Pa02.C1240.Qa001.0000.-` | Battiscopa in legno duro 60x9 mm fissato con viti o incollato, compresi tagli e sfridi. Esclusa assistenza muraria | m | 6,64 | 5,25 | P1 p. 255 — ex 1C.18.600.0010.a |
| 60 | `LOM261.OC.EEA.Pa02.C1240.L0005.0005.-` | Battiscopa in gres porcellanato piano altezza 10 cm posato con malta o collante. Esclusa assistenza muraria | m | 14,87 | 11,76 | P1 p. 249 — ex 1C.18.600.0030.b |

### impianto idraulico

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 61 | `LOM261.1M.11.200.0010.a` | Allacciamento completo di apparecchio sanitario acqua fredda e calda con scarico: valvola generale DN15, tubazione DN15 con guaina isolante, scarico DE40 in PEAD fino alla colonna. Esclusi assistenza muraria, apparecchio e rubinetteria | cad | 196,61 | 155,42 | P4 p. 167 |
| 62 | `LOM261.1M.11.200.0010.b` | Allacciamento completo di apparecchio sanitario acqua fredda o calda con scarico DE110 in PEAD fino alla colonna, tubazione DN15 con guaina isolante. Esclusi assistenza muraria, apparecchio e rubinetteria | cad | 202,44 | 160,03 | P4 p. 167 |
| 63 | `LOM261.1M.11.200.0010.c` | Allacciamento di apparecchio sanitario acqua fredda e calda senza scarico, tubazioni DN15 con guaina isolante. Esclusi assistenza muraria, apparecchio e rubinetteria | cad | 169,69 | 134,14 | P4 p. 167 |
| 64 | `LOM261.1M.11.200.0010.d` | Allacciamento di apparecchio sanitario acqua fredda o calda senza scarico, tubazione DN15 con guaina isolante. Esclusi assistenza muraria, apparecchio e rubinetteria | cad | 55,93 | 44,21 | P4 p. 167 |
| 65 | `LOM261.1M.11.200.0010.e` | Allacciamento del solo scarico di apparecchio sanitario con tubazione DE40 in PEAD fino alla colonna. Esclusi assistenza muraria, apparecchio e rubinetteria | cad | 82,28 | 65,04 | P4 p. 167 |
| 66 | `LOM261.OC.EEA.Pa02.I7407.D0033.0000.-` | Tubazione in polietilene reticolato PE-X per distribuzione acqua diametro 16 mm, in opera | m | 3,86 | 3,05 | P2 p. 1402 — ex 1M.14.060.0010.a |
| 67 | `LOM261.OC.EEA.Pa02.I7407.D0033.0010.-` | Tubazione in polietilene reticolato PE-X per distribuzione acqua diametro 20 mm, in opera | m | 4,64 | 3,67 | P2 p. 1402 — ex 1M.14.060.0010.c |
| 68 | `LOM261.OC.EEA.Pa02.I7822.D0014.0005.-` | Tubazione di scarico in polipropilene autoestinguente a bicchiere diametro 40 mm, compreso fissaggio | m | 7,88 | 6,23 | P2 p. 1452 — ex 1C.12.030.0010.b |
| 69 | `LOM261.OC.EEA.Pa02.I7822.D0014.0010.-` | Tubazione di scarico in polipropilene autoestinguente a bicchiere diametro 50 mm, compreso fissaggio | m | 8,75 | 6,91 | P2 p. 1452 — ex 1C.12.030.0010.c |
| 70 | `LOM261.OC.EEA.Pa02.I7822.D0014.0025.-` | Tubazione di scarico in polipropilene autoestinguente a bicchiere diametro 110 mm, compreso fissaggio | m | 15,54 | 12,29 | P2 p. 1452 — ex 1C.12.030.0010.f |

### impianto elettrico

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 71 | `LOM261.OC.EEA.Pa01.G8237.Za001.1000.-` | Punto luce interrotto da incasso con interruttore bipolare e spia, completo di tubo, conduttori, scatola, frutto e placca e linea fino al punto di alimentazione | cad | 48,93 | 38,68 | P2 p. 822 — ex 1E.02.060.0015.a |
| 72 | `LOM261.OC.EEA.Pa01.G8237.Za001.0500.-` | Punto luce deviato da incasso, completo di tubo, conduttori, scatole, frutti e placche e linea fino al punto di alimentazione | cad | 64,54 | 51,02 | P2 p. 821 — ex 1E.02.060.0015.b |
| 73 | `LOM261.OC.EEA.Pa01.G8237.Za001.1250.-` | Punto luce invertito da incasso, completo di tubo, conduttori, scatole, frutti e placche e linea fino al punto di alimentazione | cad | 96,58 | 76,35 | P2 p. 823 — ex 1E.02.060.0015.c |
| 74 | `LOM261.OC.EEA.Pa01.G8237.Za001.1255.-` | Punto luce invertito da incasso, per ogni invertitore oltre il primo | cad | 32,78 | 25,91 | P2 p. 823 — ex 1E.02.060.0015.p |
| 75 | `LOM261.OC.EEA.Pa01.G8237.Za001.0750.-` | Punto luce in parallelo ad una qualsiasi derivazione, da incasso | cad | 19,65 | 15,53 | P2 p. 821 — ex 1E.02.060.0015.g |
| 76 | `LOM261.OC.EEA.Pa01.G8235.Za001.1000.-` | Punto presa da incasso 2P+T 10 A, completo di tubo, conduttori, scatola, frutto e placca e linea fino al punto di alimentazione | cad | 44,62 | 35,27 | P2 p. 812 — ex 1E.02.060.0015.h |
| 77 | `LOM261.OC.EEA.Pa01.G8235.Za001.1005.-` | Punto presa da incasso 2P+T 16 A, completo di tubo, conduttori, scatola, frutto e placca e linea fino al punto di alimentazione | cad | 46,33 | 36,63 | P2 p. 812 — ex 1E.02.060.0015.i |
| 78 | `LOM261.OC.EEA.Pa01.G8235.Za001.1105.-` | Punto presa telefono o dati da incasso, completo di tubo, conduttori, scatola, frutto e placca | cad | 33,12 | 26,18 | P2 p. 815 — ex 1E.02.060.0075.f |
| 79 | `LOM261.OC.EEA.Pa01.G8205.Za001.0005.-` | Interruttore automatico magnetotermico modulare civile 2 poli curva C 6-32 A potere di interruzione 4,5 kA, installato | cad | 25,06 | 19,81 | P2 p. 732 — ex 1E.03.030.0010.b |
| 80 | `LOM261.OC.EEA.Pa01.G8205.Za001.0750.b` | Interruttore magnetotermico differenziale modulare civile 1P+N 6-32 A sensibilità 0,03 A classe AC potere di interruzione 6 kA, installato | cad | 89,05 | 70,39 | P2 p. 759 — ex 1E.03.030.0300.a |
| 81 | `LOM261.OC.EEA.Pa01.G7436.Ca000.0000.-` | Quadro elettrico (centralino) da incasso in resina fino a 12 moduli IP40 con porta trasparente e morsettiere, installato | cad | 46,57 | 36,82 | P2 p. 636 — ex 1E.03.070.0180 |
| 82 | `LOM261.OC.EEA.Pa01.G7436.Ca000.0005.-` | Quadro elettrico (centralino) da incasso in resina fino a 24 moduli IP40 con porta trasparente, installato | cad | 57,33 | 45,32 | P2 p. 636 — ex 1E.03.070.0200.a |
| 83 | `LOM261.OC.EEA.Pa02.G7424.Sc009.2260.-` | Cavo unipolare FS17 450/750 V sezione 2,5 mm², posato | m | 1,30 | 1,03 | P2 p. 1218 — ex 1E.02.040.0015.c |

### varie

| # | Codice | Descrizione (abbreviata) | U.M. | Prezzo € | senza SG e UI € | Fonte, pag. PDF |
|---|---|---|---|---:|---:|---|
| 84 | `LOM261.OC.EEA.Pa02.C0100.H0002.0005.-` | Tramezzo in cartongesso con una lastra da 1,3 cm per faccia su orditura in acciaio zincato (montanti interasse 60 cm), compresa rasatura dei giunti. Esclusa assistenza muraria | m² | 43,14 | 34,10 | P1 p. 99 — ex 1C.06.560.0050.a |
| 85 | `LOM261.OC.EEA.Pa02.C0102.H0002.0005.-` | Controparete in lastra di cartongesso idrorepellente da 1,3 cm incollata a parete per bagni e cucine, compresa rasatura dei giunti. Esclusi assistenza muraria e piani di lavoro | m² | 26,42 | 20,89 | P1 p. 103 — ex 1C.06.550.0100 |
| 86 | `LOM261.OC.EEA.Pa02.C1210.H0002.0010.-` | Controsoffitto in lastre di cartongesso da 1,3 cm con orditura nascosta di sostegno. Esclusa assistenza muraria | m² | 46,16 | 36,49 | P1 p. 204 — ex 1C.20.050.0050 |
| 87 | `LOM261.OC.EEA.Pa02.C0102.L0011.0290.-` | Tramezzo in blocchi forati di laterizio spessore 8 cm (formato 24x8x24) con malta di cemento, comprese spalle e voltini. Esclusi piani di lavoro | m² | 27,83 | 22,00 | P1 p. 122 — ex 1C.06.070.0110 |
| 88 | `LOM261.OC.EEA.Pa16.C0900.Za001.0510.-` | Intonaco completo interno a civile fine su pareti verticali (rinzaffo, rustico premiscelato e arricciatura) steso con mezzo meccanico. Esclusi piani di lavoro | m² | 31,46 | 24,87 | P1 p. 669 — ex 1C.07.220.0020 |
| 89 | `LOM261.OC.EEA.Pa16.C0900.Za001.1000.-` | Rasatura interna a civile fine con rasante a base di cemento e calce, 2 mani, su pareti o soffitti. Esclusi piani di lavoro | m² | 11,56 | 9,14 | P1 p. 672 — ex 1C.07.230.0010 |
| 90 | `LOM261.1C.28.100.0010.b` | Assistenza muraria agli impianti meccanici (idraulici) in ristrutturazione, in percentuale sull'importo di tubazioni, canali e allacciamenti | % | 20,99 **(%)** | 16,59 | P4 p. 137 |
| 91 | `LOM261.1C.28.200.0010.b` | Assistenza muraria all'impianto elettrico e affini in ristrutturazione, in percentuale sull'importo dell'impianto al netto di corpi illuminanti e apparecchiature | % | 20,99 **(%)** | 16,59 | P4 p. 137 |
| 92 | `LOM261.RU.00.00.00.0005.a` | Manodopera: operaio edile di livello 3° specializzato (muratore, pavimenti e rivestimenti, verniciatore e assimilati), ora ordinaria | h | 43,90 | 34,70 | P3 p. 1470 |
| 93 | `LOM261.RU.00.00.00.0015.a` | Manodopera: operaio edile di livello 1° comune, ora ordinaria | h | 36,63 | 28,96 | P3 p. 1471 |
| 94 | `LOM261.RU.00.01.00.0025.-` | Manodopera: operaio metalmeccanico di livello B1 (idraulici, elettricisti, termoidraulici), ora ordinaria | h | 36,56 | 28,90 | P3 p. 1471 |

## Come ho verificato

1. Ho scaricato l'archivio XLS ufficiale e i quattro PDF della cartella «allegati-corretti» in una cartella temporanea fuori dal repository.
2. Ho estratto le voci dall'XLS con uno script (codice, declaratoria, unità, prezzo, importo senza SG e UI, codice della codifica precedente).
3. Ho estratto il testo dei PDF corretti (`pdftotext -raw`) e ho abbinato ogni codice al prezzo stampato sotto di esso. **Confronto complessivo XLS contro PDF corretti: 21.575 voci con lo stesso prezzo, 0 con prezzo diverso**, 580 voci non abbinate automaticamente (codici spezzati su due righe nel PDF).
4. Per le 94 voci scelte: 91 abbinate automaticamente con prezzo e unità identici; le altre 3 (`LOM261.OC.EEA.Mc04.C3310.Qa000.0000.b`, `LOM261.NC.90.050.0050`, `LOM261.NC.80.050.0010`) le ho controllate a mano nel testo del PDF: prezzo e unità coincidono.

## Limiti — cosa non ho verificato o non ho fatto

- **Una sola fonte.** Tutte le categorie richieste erano coperte dal prezzario lombardo 2026, quindi non ho aperto i prezzari di Piemonte, Emilia-Romagna, Veneto né i prezzi informativi della Camera di Commercio di Milano. **Non c'è un confronto fra fonti**: non posso dire se i prezzi lombardi siano alti o bassi rispetto ad altre fonti pubbliche, e nessuna divergenza è stata cercata.
- **Prezzi da lavori pubblici.** Sono prezzi di riferimento per appalti pubblici (D.Lgs. 36/2023, art. 41 c. 13), con spese generali e utile già dentro. Non dicono quanto chiede davvero un artigiano a un privato a Milano: per il listino di prova vanno bene, per un listino reale no.
- **Versione dei file.** Sulla pagina ufficiale convivono due cartelle: «allegati-27-05» (dove sta l'XLS, file interni datati 11/05/2026 e 25/05/2026) e «allegati-corretti» (PDF). Il PDF della Parte 4 nella cartella «allegati-27-05» **non è identico** byte per byte a quello corretto, ma sui 2.702 codici con prezzo che ho abbinato in entrambi i prezzi coincidono tutti: la differenza è altrove nel testo e non ho indagato quale sia. Per le 94 voci l'XLS coincide con i PDF corretti. Non conosco la data di pubblicazione degli «allegati corretti» né se usciranno altre correzioni.
- **Pagine.** Sono le pagine del file PDF, non quelle stampate. Se Regione ripubblica il file le pagine possono spostarsi: il riferimento affidabile è il codice.
- **Voci particolari da conoscere prima di usarle:**
  - `LOM261.1M.11.200.0010.b` (acqua fredda **o** calda con scarico, 202,44 €) costa più di `.a` (fredda **e** calda con scarico, 196,61 €): la differenza si spiega con lo scarico DE110 della `.b` contro il DE40 della `.a` (adatto al vaso), ma è una mia lettura della declaratoria, non una nota della fonte.
  - `LOM261.OC.EEA.Pa01.G8237.Za001.1255.-` (32,78 €) è il punto luce invertito **«oltre il primo»**, da sommare a `…1250.-` (96,58 €).
  - Gli apparecchi sanitari sono senza rubinetteria; le rubinetterie sono voci separate. Il vaso a pavimento non comprende la cassetta.
  - Le due assistenze murarie sono percentuali (20,99%) per «ristrutturazione edilizia», da applicare solo agli importi indicati nella declaratoria.
  - La manodopera metalmeccanica B1 (idraulici, elettricisti) risulta 36,56 €/h, meno dell'operaio edile specializzato (43,90 €/h): è così nella fonte, non l'ho spiegato.
- **Voci scartate** perché la declaratoria era ambigua: listoni di rovere incollati `LOM261.OC.EEA.Pa02.C1206.Qa005.0005.-` (la fonte dà «larghezza [cm] = 35 ÷ 65» per un listone lungo 30÷40 cm, probabilmente un refuso che non posso verificare).
- **Non trovato come voce unica nel prezzario:** un «punto acqua» chiavi in mano, come lo intende un idraulico. L'equivalente più vicino sono gli «Allacciamenti» `LOM261.1M.11.200.0010.*`, che escludono assistenza muraria, apparecchio e rubinetteria.
- Non ho letto l'edizione 2025 né le analisi prezzi (allegati B e D): i prezzi riportati sono quelli dell'elenco prezzi, non ricostruiti dalle analisi.
- Non mi sono registrato a nulla e non ho usato la Piattaforma digitale (www.prezzario.regione.lombardia.it).
