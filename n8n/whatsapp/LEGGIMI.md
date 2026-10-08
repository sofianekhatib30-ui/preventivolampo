# PreventivoLampo su WhatsApp (n8n + WhatsApp Cloud API)

L'artigiano manda un vocale o un messaggio al numero WhatsApp di PreventivoLampo; n8n lo trascrive, lo passa a PreventivoLampo e risponde citando il messaggio, con il link alla bozza (con anteprima).

Stesso schema del flusso Slack: verifica della firma di Meta (`X-Hub-Signature-256`, HMAC con l'App Secret), risposta a Meta subito, stati di consegna e messaggi più vecchi di 10 minuti ignorati, vocali OGG/Opus rinominati prima della trascrizione.

- `preventivolampo-whatsapp.json`: il flusso per n8n Cloud.
- Indirizzo per Meta: `https://kdigitalsolution.app.n8n.cloud/webhook/preventivolampo-whatsapp`
- Token di verifica: nel nodo **Controlla token** (lo stesso va scritto su Meta).
- Banco di prova: `node ../prova/mock.js` e `node ../prova/prova-wa.js` (17 su 17 l'8/10/2026, n8n 2.42.5).

## Credenziali in n8n
- **WhatsApp · token** (Header Auth): Name `Authorization`, Value `Bearer <token di Meta>`. Il token temporaneo della pagina "API Setup" dura 24 ore; per una demo stabile serve il token di un utente di sistema (Business Manager → Utenti di sistema, permessi `whatsapp_business_messaging` e `whatsapp_business_management`).
- **PreventivoLampo · segreto n8n**: la stessa del flusso Slack.
- **Trascrizione · chiave** (Header Auth): Name `Authorization`, Value `Bearer <chiave>`. OpenAI per impostazione; per Groq cambia nel nodo **Verifica e smista** `TRASCRIZIONE_URL` in `https://api.groq.com/openai/v1/audio/transcriptions` e `TRASCRIZIONE_MODELLO` in `whisper-large-v3-turbo`.
- **App Secret** di Meta: nel nodo **Verifica e smista**, riga `SEGRETO_APP`.

## Limiti del numero di test di Meta
Scrive solo a 5 numeri aggiunti e verificati nella pagina "API Setup". Per i clienti veri servono un numero dedicato e la verifica dell'azienda su Meta (con partita IVA). Le risposte entro 24 ore da un messaggio dell'artigiano non si pagano.
