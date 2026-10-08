# PreventivoLampo su WhatsApp con Twilio (n8n)

L'artigiano scrive il sopralluogo su WhatsApp al numero di Twilio. n8n lo passa a PreventivoLampo e risponde con il link alla bozza.

## Due versioni

| File | Account Twilio | Come risponde |
|---|---|---|
| `preventivolampo-twilio-gratis.json` | di prova (gratis, sandbox) | Solo nella risposta al messaggio (TwiML, entro 15 s). Subito «⏳ Ricevuto…»; il link della bozza arriva quando l'artigiano scrive **ok** (la bozza ci mette circa 20 s). |
| `preventivolampo-twilio.json` | a consumo (con carta) | Manda «Ricevuto» e poi la bozza da solo, via API di Twilio. |

L'account di prova di Twilio rifiuta i messaggi di testo libero mandati via API (errore 21654 «ContentSid Required»): per questo esiste la versione gratuita.

```
WhatsApp ─► Twilio ─► Webhook n8n ─► Verifica e smista ─► risposta TwiML
                          │ firma X-Twilio-Signature (Auth Token)
                          ▼
                 PreventivoLampo /api/elabora ─► bozza tenuta da parte (dati statici del flusso)
                                                         │
                             l'artigiano scrive «ok» ─────┘─► link della bozza nel TwiML
```

## Messa in funzione (versione gratuita)
1. **Twilio** → Messaging → Try it out → Send a WhatsApp message → **Sandbox settings**: «When a message comes in» = `https://<tua-istanza>.app.n8n.cloud/webhook/preventivolampo-twilio`, metodo POST, Save. Dal telefono manda `join <codice>` al numero della sandbox.
2. **n8n** → Create workflow → ⋯ → Import from File → `preventivolampo-twilio-gratis.json`.
3. Nodo **Verifica e smista**: incolla l'Auth Token di Twilio in `const AUTH_TOKEN = ''` e controlla che `INDIRIZZO` sia identico a quello del punto 1 (serve per la firma).
4. Nodo **PreventivoLampo: crea la bozza**: credenziale *Header Auth* `x-elabora-secret` (la stessa di Slack). Nodo **Scarica il vocale**: credenziale *Basic Auth* `Twilio · account` (User = Account SID, Password = Auth Token).
5. **Save** e **Publish**. Un solo flusso alla volta può usare l'indirizzo `preventivolampo-twilio`.

Vocali: metti `VOCALI_ATTIVI = true` dopo aver dato al nodo **Trascrivi il vocale** la credenziale del servizio di trascrizione (OpenAI o Groq).

## Prove
`node ../prova/mock.js` e poi `node ../prova/prova-tw.js` (versione a consumo, 11 casi) o `node ../prova/prova-twg.js` (versione gratuita, 10 casi). Esito all'8/10/2026: tutti superati su n8n 2.42.5. Prova dal vivo con la sandbox lo stesso giorno: sopralluogo → «Ricevuto» → «ok» → link della bozza.
