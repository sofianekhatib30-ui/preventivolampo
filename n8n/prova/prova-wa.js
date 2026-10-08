// Banco di prova del flusso WhatsApp: eventi Meta firmati (e non) contro n8n locale.
const crypto = require('crypto');
const URL = 'http://127.0.0.1:5680/webhook/preventivolampo-whatsapp';
const MOCK = 'http://127.0.0.1:5999';
const SEGRETO = 'segreto-app-prova';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esiti = [];
const ok = (n, c, d) => esiti.push([c ? 'OK ' : 'NO ', n, c ? '' : JSON.stringify(d).slice(0, 800)]);
const log = async () => (await fetch(MOCK + '/_log')).json();
const reset = () => fetch(MOCK + '/_reset');

function evento(msg, extra = {}) {
  return { object: 'whatsapp_business_account', entry: [{ id: 'WABA1', changes: [{ field: 'messages', value: {
    messaging_product: 'whatsapp', metadata: { display_phone_number: '15550001111', phone_number_id: '1234567890' },
    contacts: [{ profile: { name: 'Mario Rossi' }, wa_id: '393331112222' }], ...(msg ? { messages: [msg] } : {}), ...extra } }] }] };
}
const testo = (t, id = 'wamid.A') => ({ from: '393331112222', id, timestamp: String(Math.floor(Date.now() / 1000)), type: 'text', text: { body: t } });

async function invia(corpo, firma = true) {
  const raw = JSON.stringify(corpo);
  const h = { 'content-type': 'application/json' };
  h['x-hub-signature-256'] = firma ? 'sha256=' + crypto.createHmac('sha256', SEGRETO).update(raw).digest('hex') : 'sha256=00';
  const t0 = Date.now();
  const r = await fetch(URL, { method: 'POST', headers: h, body: raw });
  return { stato: r.status, corpo: await r.text(), ms: Date.now() - t0 };
}
const inviati = (L) => L.filter(x => /\/graph\/\d+\/messages/.test(x.url)).map(x => JSON.parse(x.body));

(async () => {
  // verifica GET
  let r = await fetch(URL + '?hub.mode=subscribe&hub.verify_token=token-verifica-prova&hub.challenge=987654');
  ok('verifica Meta: sfida restituita', r.status === 200 && (await r.text()) === '987654', r.status);
  r = await fetch(URL + '?hub.mode=subscribe&hub.verify_token=sbagliato&hub.challenge=987654');
  ok('verifica Meta: token sbagliato respinto', r.status === 403, r.status);

  // firma falsa
  await reset();
  r = await invia(evento(testo('Bagno tre per due, piastrelle nuove ovunque')), false);
  await sleep(1500);
  ok('firma falsa respinta', r.stato === 401 && (await log()).length === 0, r);

  // testo
  await reset();
  r = await invia(evento(testo('Cucina: tolgo le piastrelle vecchie, 12 metri quadri di rivestimento nuovo e due punti luce.', 'wamid.T1')));
  ok('risposta a Meta sotto i 3 secondi', r.stato === 200 && r.ms < 3000, r);
  await sleep(6000);
  let L = await log(); let w = inviati(L);
  const el = L.find(x => x.url.includes('/pl/api/elabora'));
  ok('testo: «ricevuto» in risposta al messaggio', w[0] && /Ricevuto/.test(w[0].text.body) && w[0].to === '393331112222' && w[0].context.message_id === 'wamid.T1' && w[0].messaging_product === 'whatsapp', w);
  ok('testo: inviato al numero dell\'azienda giusto', L.filter(x => /\/graph\/\d+\/messages/.test(x.url)).every(x => x.url === '/graph/1234567890/messages' && x.auth === 'Bearer EAAprova'), L);
  ok('testo: PreventivoLampo con segreto e testo', el && el.secret === 'segreto-prova' && JSON.parse(el.body).testo.startsWith('Cucina'), L);
  ok('testo: bozza pronta con link e anteprima', w[1] && /Bozza pronta: 7 righe/.test(w[1].text.body) && w[1].text.body.includes('http://127.0.0.1:5999/pl/revisione/abc123') && w[1].text.preview_url === true, w);

  // stati e messaggi vecchi ignorati
  await reset();
  await invia(evento(null, { statuses: [{ id: 'wamid.RISPOSTA', status: 'delivered', timestamp: '1', recipient_id: '393331112222' }] }));
  const vecchio = testo('Bagno tre per due, piastrelle nuove ovunque', 'wamid.OLD'); vecchio.timestamp = String(Math.floor(Date.now() / 1000) - 3600);
  await invia(evento(vecchio));
  await invia({ object: 'page', entry: [] });
  await sleep(2500);
  ok('stati, messaggi vecchi e altri oggetti ignorati', (await log()).length === 0, await log());

  // vocale
  await reset();
  await invia(evento({ from: '393331112222', id: 'wamid.V1', timestamp: String(Math.floor(Date.now() / 1000)), type: 'audio', audio: { id: 'MEDIA1', mime_type: 'audio/ogg; codecs=opus', voice: true } }));
  await sleep(7000);
  L = await log(); w = inviati(L);
  const media = L.find(x => x.url.startsWith('/graph/MEDIA1'));
  const dl = L.find(x => x.url.startsWith('/files/wa-media'));
  const tr = L.find(x => x.url.includes('/audio/transcriptions'));
  const el2 = L.find(x => x.url.includes('/pl/api/elabora'));
  ok('vocale: indirizzo chiesto a Meta con il token', media && media.auth === 'Bearer EAAprova', L);
  ok('vocale: file scaricato con il token', dl && dl.auth === 'Bearer EAAprova', L);
  ok('vocale: trascrizione con nome vocale.ogg, modello e chiave', tr && tr.body.includes('filename="vocale.ogg"') && tr.body.includes('OGGFINTO') && tr.body.includes('whisper-1') && tr.auth === 'Bearer sk-prova', tr || L);
  ok('vocale: PreventivoLampo riceve il trascritto', el2 && JSON.parse(el2.body).testo.startsWith('Bagno di tre metri'), L);
  ok('vocale: avviso e bozza pronta', w.length === 2 && /vocale/.test(w[0].text.body) && /Bozza pronta/.test(w[1].text.body), w);

  // saluto
  await reset();
  await invia(evento(testo('ciao', 'wamid.S1')));
  await sleep(2500);
  L = await log(); w = inviati(L);
  ok('saluto: presentazione con il nome, nessuna bozza', w.length === 1 && /Ciao Mario! Sono PreventivoLampo/.test(w[0].text.body) && !L.some(x => x.url.includes('elabora')), w);

  // immagine (tipo non gestito)
  await reset();
  await invia(evento({ from: '393331112222', id: 'wamid.I1', timestamp: String(Math.floor(Date.now() / 1000)), type: 'image', image: { id: 'IMG1' } }));
  await sleep(2500);
  w = inviati(await log());
  ok('foto: istruzioni, nessuna bozza', w.length === 1 && /Sono PreventivoLampo/.test(w[0].text.body), w);

  // errore
  await reset();
  await invia(evento(testo('Bagno ERRORE simulato con un testo lungo abbastanza', 'wamid.E1')));
  await sleep(5000);
  w = inviati(await log());
  ok('errore: avviso «qualcosa non va»', w.length === 2 && /Non sono riuscito/.test(w[1].text.body), w);

  for (const e of esiti) console.log(e.join(' '));
  console.log(esiti.filter(e => e[0] === 'OK ').length + '/' + esiti.length);
})();
