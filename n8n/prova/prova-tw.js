// Banco di prova del flusso Twilio: richieste firmate come Twilio (e non) contro n8n locale.
const crypto = require('crypto');
const URL = 'http://127.0.0.1:5680/webhook/preventivolampo-twilio';
const MOCK = 'http://127.0.0.1:5999';
const TOKEN = 'token-twilio-prova';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const esiti = [];
const ok = (n, c, d) => esiti.push([c ? 'OK ' : 'NO ', n, c ? '' : JSON.stringify(d).slice(0, 700)]);
const log = async () => (await fetch(MOCK + '/_log')).json();
const reset = () => fetch(MOCK + '/_reset');
const firma = (p) => crypto.createHmac('sha1', TOKEN).update(URL + Object.keys(p).sort().map((k) => k + p[k]).join('')).digest('base64');

function msg(extra) {
  return { SmsMessageSid: 'SM1', NumMedia: '0', ProfileName: 'Mario Rossi', SmsSid: 'SM1', WaId: '393331112222', SmsStatus: 'received',
    Body: '', To: 'whatsapp:+4915888620339', NumSegments: '1', MessageSid: 'SM1', AccountSid: 'ACprova0000', From: 'whatsapp:+393331112222', ApiVersion: '2010-04-01', ...extra };
}
async function invia(p, buonaFirma = true) {
  const t0 = Date.now();
  const r = await fetch(URL, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-twilio-signature': buonaFirma ? firma(p) : 'falsa' }, body: new URLSearchParams(p).toString() });
  return { stato: r.status, corpo: await r.text(), tipo: r.headers.get('content-type'), ms: Date.now() - t0 };
}
const inviati = (L) => L.filter((x) => x.url.includes('/Messages.json')).map((x) => ({ ...Object.fromEntries(new URLSearchParams(x.body)), url: x.url, auth: x.auth }));

(async () => {
  await reset();
  let r = await invia(msg({ Body: 'Cucina: tolgo le piastrelle vecchie, 12 metri quadri di rivestimento nuovo.' }), false);
  await sleep(1500);
  ok('firma falsa respinta', r.stato === 403 && (await log()).length === 0, r);

  await reset();
  r = await invia(msg({ Body: 'Cucina: tolgo le piastrelle vecchie, 12 metri quadri di rivestimento nuovo e due punti luce.' }));
  ok('risposta TwiML sotto i 3 secondi', r.stato === 200 && r.corpo === '<Response></Response>' && /xml/.test(r.tipo) && r.ms < 3000, r);
  await sleep(6000);
  let L = await log(); let w = inviati(L);
  const el = L.find((x) => x.url.includes('/pl/api/elabora'));
  const basic = 'Basic ' + Buffer.from('ACprova0000:token-twilio-prova').toString('base64');
  ok('testo: «ricevuto» via API Twilio, dal numero giusto al mittente', w[0] && /Ricevuto/.test(w[0].Body) && w[0].To === 'whatsapp:+393331112222' && w[0].From === 'whatsapp:+4915888620339' && w[0].url === '/twilio/2010-04-01/Accounts/ACprova0000/Messages.json' && w[0].auth === basic, w);
  ok('testo: PreventivoLampo con segreto e testo', el && el.secret === 'segreto-prova' && JSON.parse(el.body).testo.startsWith('Cucina'), L);
  ok('testo: bozza pronta con link', w[1] && /Bozza pronta: 7 righe/.test(w[1].Body) && w[1].Body.includes('http://127.0.0.1:5999/pl/revisione/abc123'), w);

  await reset();
  await invia(msg({ NumMedia: '1', MediaUrl0: MOCK + '/files/tw-media', MediaContentType0: 'audio/ogg', Body: '' }));
  await sleep(7000);
  L = await log(); w = inviati(L);
  const dl = L.find((x) => x.url.startsWith('/files/tw-media'));
  const tr = L.find((x) => x.url.includes('/audio/transcriptions'));
  const el2 = L.find((x) => x.url.includes('/pl/api/elabora'));
  ok('vocale: scaricato con le credenziali Twilio', dl && dl.auth === basic, L);
  ok('vocale: trascrizione con vocale.ogg', tr && tr.body.includes('filename="vocale.ogg"') && tr.body.includes('OGGTWILIO') && tr.auth === 'Bearer sk-prova', tr || L);
  ok('vocale: bozza dal trascritto', el2 && JSON.parse(el2.body).testo.startsWith('Bagno di tre metri') && w.length === 2 && /vocale/.test(w[0].Body), { w, L });

  await reset();
  await invia(msg({ Body: 'ciao' }));
  await sleep(2500);
  L = await log(); w = inviati(L);
  ok('saluto: presentazione col nome, nessuna bozza', w.length === 1 && /Ciao Mario! Sono PreventivoLampo/.test(w[0].Body) && !L.some((x) => x.url.includes('elabora')), w);

  await reset();
  await invia(msg({ Body: 'Bagno ERRORE simulato con un testo lungo abbastanza' }));
  await sleep(5000);
  w = inviati(await log());
  ok('errore: avviso «non sono riuscito»', w.length === 2 && /Non sono riuscito/.test(w[1].Body), w);

  await reset();
  await invia(msg({ From: '+393331112222', Body: 'SMS normale non WhatsApp, lungo abbastanza' }));
  await sleep(2000);
  ok('SMS non WhatsApp ignorato', (await log()).length === 0, await log());

  for (const e of esiti) console.log(e.join(' '));
  console.log(esiti.filter((e) => e[0] === 'OK ').length + '/' + esiti.length);
})();
