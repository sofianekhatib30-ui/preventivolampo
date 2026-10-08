# PreventivoLampo su Slack (n8n)

Il muratore scrive il sopralluogo al bot su Slack (in privato o menzionandolo in un canale), oppure manda una clip audio. n8n lo passa a PreventivoLampo e risponde nel thread con il link alla bozza da controllare dal telefono.

```
Slack ──► Webhook n8n ──► Verifica e smista ──► risposta a Slack entro 3 s
                              │ firma HMAC, doppioni, bot, saluti
                              ▼
                     «Ricevuto…» nel thread ──► vocale? ──► scarica ──► trascrivi
                              │                                              │
                              └────────► PreventivoLampo /api/elabora ◄──────┘
                                                │ x-elabora-secret
                                     ✅ bozza pronta + link  /  ⚠️ errore
```

## File
- `preventivolampo-slack.json`: il flusso per **n8n Cloud** (chiavi nelle credenziali di n8n).
- `slack-app-manifest.yaml`: crea l'app Slack con un clic.
- `server/`: la stessa cosa su un server proprio (Hetzner + Docker + Caddy), con le chiavi nel file `.env` del server.
- `prova/`: banco di prova. `node prova/mock.js` simula Slack, OpenAI e PreventivoLampo; `node prova/prova.js` manda 16 eventi firmati e controlla cosa succede. Esito al 08/10/2026: 16 su 16, su n8n 2.42.5, sia la versione cloud sia quella server.

## Messa in funzione su n8n Cloud (una volta)
1. **Vercel → preventivolampo → Settings → Environment Variables**: aggiungi `ELABORA_SHARED_SECRET` (Production) con il valore in `n8n/.segreto-elabora.txt`, poi **Redeploy**. Il file non entra nel repository.
2. **n8n → Create workflow → ⋯ → Import from file** → `preventivolampo-slack.json`.
3. Nodo **PreventivoLampo: crea la bozza** → credenziale *Header Auth*: Name `x-elabora-secret`, Value = lo stesso segreto del punto 1.
4. **Publish** del flusso (deve essere pubblicato prima del punto 5).
5. **api.slack.com/apps → Create New App → From a manifest** → scegli l'area di lavoro → incolla `slack-app-manifest.yaml` → Create → **Install to Workspace**. Slack verifica l'indirizzo: va a buon fine anche senza segreto.
6. **OAuth & Permissions → Bot User OAuth Token** (`xoxb-…`) → in n8n crea la credenziale *Slack API* (campo Access Token) e controlla che sia scelta nei 4 nodi Slack.
7. **Basic Information → Signing Secret** → incollalo nel nodo **Verifica e smista**, riga `SEGRETO_FIRMA`. Salva e ripubblica. Da qui in poi passano solo le richieste firmate da Slack.
8. Prova: in Slack apri l'app PreventivoLampo e scrivi un sopralluogo, per esempio «Bagno 3 per 2, tolgo le piastrelle vecchie e rifaccio pavimento e rivestimento fino a 2 metri».

**Vocali (facoltativo):** credenziale *OpenAI* nel nodo **Trascrivi il vocale** e `VOCALI_ATTIVI = true` nel nodo **Verifica e smista**. Senza, il bot chiede di scrivere.

## Sicurezza
- Ogni richiesta deve avere la firma di Slack valida e non più vecchia di 5 minuti; le altre ricevono 401.
- Le ripetizioni di Slack (`x-slack-retry-num`) e i messaggi dei bot sono ignorati: niente doppie bozze, niente cicli.
- Le chiavi stanno nelle credenziali di n8n (cifrate) o nel `.env` del server, mai nel flusso esportato.
- La prova gratuita di n8n Cloud dura 14 giorni: alla scadenza lo spazio di lavoro si cancella, il flusso resta qui.
