// Banco di prova del flusso: eventi Slack firmati (e non) contro n8n locale, poi controllo di cosa è stato chiamato.
const crypto = require('crypto');
const URL = 'http://127.0.0.1:5680/webhook/preventivolampo-slack';
const MOCK = 'http://127.0.0.1:5999';
const SEGRETO = 'firma-prova';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function invia(corpo, { firma = true, extra = {} } = {}) {
  const raw = JSON.stringify(corpo);
  const ts = Math.floor(Date.now() / 1000);
  const h = { 'content-type': 'application/json', ...extra };
  if (firma) {
    h['x-slack-request-timestamp'] = String(ts);
    h['x-slack-signature'] = 'v0=' + crypto.createHmac('sha256', SEGRETO).update(`v0:${ts}:${raw}`).digest('hex');
  } else {
    h['x-slack-request-timestamp'] = String(ts);
    h['x-slack-signature'] = 'v0=deadbeef';
  }
  const t0 = Date.now();
  const r = await fetch(URL, { method: 'POST', headers: h, body: raw });
  return { stato: r.status, corpo: await r.text(), ms: Date.now() - t0 };
}
const evento = (ev) => ({ type: 'event_callback', team_id: 'T1', api_app_id: 'A1', event: ev });
async function log() { return (await fetch(MOCK + '/_log')).json(); }
async function reset() { await fetch(MOCK + '/_reset'); }

const esiti = [];
function ok(nome, cond, dettaglio) { esiti.push([cond ? 'OK ' : 'NO ', nome, cond ? '' : JSON.stringify(dettaglio).slice(0, 700)]); }

(async () => {
  // 1. verifica dell'indirizzo
  let r = await invia({ type: 'url_verification', challenge: 'sfida-123' });
  ok('sfida Slack', r.stato === 200 && JSON.parse(r.corpo).challenge === 'sfida-123', r);

  // 2. firma sbagliata
  await reset();
  r = await invia(evento({ type: 'message', channel_type: 'im', channel: 'D1', user: 'U1', ts: '111.1', text: 'Bagno tre per due, piastrelle nuove ovunque' }), { firma: false });
  await sleep(1500);
  ok('firma falsa respinta', r.stato === 401 && (await log()).length === 0, { r, log: await log() });

  // 3. messaggio privato di testo
  await reset();
  r = await invia(evento({ type: 'message', channel_type: 'im', channel: 'D1', user: 'U1', ts: '111.2', text: 'Cucina: tolgo le piastrelle vecchie, 12 metri quadri di rivestimento nuovo e due punti luce.' }));
  ok('risposta a Slack sotto i 3 secondi', r.stato === 200 && r.ms < 3000, r);
  await sleep(6000);
  let L = await log();
  const p = L.filter(x => x.url.includes('chat.postMessage')).map(x => JSON.parse(x.body));
  const el = L.find(x => x.url.includes('/pl/api/elabora'));
  ok('testo: avviso "ricevuto" nel thread', p[0] && /Ricevuto/.test(p[0].text) && p[0].thread_ts === '111.2' && p[0].channel === 'D1', L);
  ok('testo: PreventivoLampo chiamato con il segreto e il testo', el && el.secret === 'segreto-prova' && JSON.parse(el.body).testo.startsWith('Cucina'), L);
  ok('testo: bozza pronta con link', p[1] && /Bozza pronta: 7 righe/.test(p[1].text) && p[1].text.includes('http://127.0.0.1:5999/pl/revisione/abc123'), L);
  ok('token Slack in intestazione', L.filter(x => x.url.includes('chat.postMessage')).every(x => x.auth === 'Bearer xoxb-prova'), L);

  // 4. messaggi del bot e ripetizioni ignorati
  await reset();
  await invia(evento({ type: 'message', channel_type: 'im', channel: 'D1', bot_id: 'B1', ts: '111.3', text: 'Bozza pronta: 7 righe' }));
  await invia(evento({ type: 'message', channel_type: 'im', channel: 'D1', user: 'U1', ts: '111.2', text: 'Cucina: tolgo le piastrelle vecchie, 12 metri quadri.' }), { extra: { 'x-slack-retry-num': '1', 'x-slack-retry-reason': 'http_timeout' } });
  await invia(evento({ type: 'message', channel_type: 'channel', channel: 'C1', user: 'U1', ts: '111.4', text: 'messaggio normale nel canale senza menzione, non per il bot' }));
  await sleep(2500);
  ok('bot, ripetizioni e canale senza menzione ignorati', (await log()).length === 0, await log());

  // 5. vocale
  await reset();
  r = await invia(evento({ type: 'message', subtype: 'file_share', channel_type: 'im', channel: 'D1', user: 'U1', ts: '111.5', text: '',
    files: [{ id: 'F1', name: 'clip.m4a', mimetype: 'audio/mp4', subtype: 'slack_audio', url_private_download: MOCK + '/files/clip.m4a' }] }));
  await sleep(7000);
  L = await log();
  const dl = L.find(x => x.url.startsWith('/files/clip.m4a'));
  const tr = L.find(x => x.url.includes('/audio/transcriptions'));
  const el2 = L.find(x => x.url.includes('/pl/api/elabora'));
  const p2 = L.filter(x => x.url.includes('chat.postMessage')).map(x => JSON.parse(x.body));
  ok('vocale: scaricato con il token del bot', dl && dl.auth === 'Bearer xoxb-prova', L);
  ok('vocale: trascrizione multipart con file e modello', tr && tr.ct.startsWith('multipart/form-data') && tr.body.includes('FINTOAUDIO') && tr.body.includes('whisper-1') && tr.auth === 'Bearer sk-prova', tr || L);
  ok('vocale: PreventivoLampo riceve il trascritto', el2 && JSON.parse(el2.body).testo.startsWith('Bagno di tre metri'), L);
  ok('vocale: avviso e bozza pronta', p2.length === 2 && /vocale/.test(p2[0].text) && /Bozza pronta/.test(p2[1].text), p2);

  // 6. messaggio troppo corto → istruzioni
  await reset();
  await invia(evento({ type: 'message', channel_type: 'im', channel: 'D1', user: 'U1', ts: '111.6', text: 'ciao' }));
  await sleep(2500);
  L = await log();
  ok('saluto: solo istruzioni, nessuna bozza', L.length === 1 && /Raccontami il sopralluogo/.test(JSON.parse(L[0].body).text) && !L.some(x => x.url.includes('elabora')), L);

  // 7. errore di PreventivoLampo → avviso di errore
  await reset();
  await invia(evento({ type: 'message', channel_type: 'im', channel: 'D1', user: 'U1', ts: '111.7', text: 'Bagno ERRORE simulato con un testo lungo abbastanza' }));
  await sleep(5000);
  L = await log();
  const p3 = L.filter(x => x.url.includes('chat.postMessage')).map(x => JSON.parse(x.body));
  ok('errore: avviso "qualcosa non va"', p3.length === 2 && /Non sono riuscito/.test(p3[1].text), L);

  // 8. menzione in un canale
  await reset();
  await invia(evento({ type: 'app_mention', channel: 'C9', user: 'U1', ts: '222.1', text: '<@U0BOT> Tinteggiatura di un bilocale, 60 metri quadri di pareti, due mani.' }));
  await sleep(5000);
  L = await log();
  const el4 = L.find(x => x.url.includes('/pl/api/elabora'));
  ok('menzione: tolta dal testo, risposta nel thread del canale', el4 && JSON.parse(el4.body).testo.startsWith('Tinteggiatura') && JSON.parse(L.find(x => x.url.includes('chat.postMessage')).body).channel === 'C9', L);

  // 9. firma scaduta (più di 5 minuti)
  await reset();
  const raw = JSON.stringify(evento({ type: 'message', channel_type: 'im', channel: 'D1', user: 'U1', ts: '111.8', text: 'Bagno tre per due, piastrelle nuove ovunque' }));
  const vecchio = Math.floor(Date.now() / 1000) - 600;
  const sig = 'v0=' + crypto.createHmac('sha256', SEGRETO).update(`v0:${vecchio}:${raw}`).digest('hex');
  const rr = await fetch(URL, { method: 'POST', headers: { 'content-type': 'application/json', 'x-slack-request-timestamp': String(vecchio), 'x-slack-signature': sig }, body: raw });
  await sleep(1500);
  ok('firma vecchia respinta (replay)', rr.status === 401 && (await log()).length === 0, rr.status);

  for (const e of esiti) console.log(e.join(' '));
  console.log(esiti.filter(e => e[0] === 'OK ').length + '/' + esiti.length);
})();
