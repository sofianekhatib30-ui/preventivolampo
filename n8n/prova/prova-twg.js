// Banco di prova della versione gratuita (solo TwiML): ricevuto subito, bozza consegnata con «ok».
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
const msg = (extra) => ({ NumMedia: '0', ProfileName: 'Mario Rossi', Body: '', To: 'whatsapp:+14155238886', MessageSid: 'SM1', AccountSid: 'ACprova0000', From: 'whatsapp:+393331112222', ...extra });
async function invia(p, buona = true) {
  const t0 = Date.now();
  const r = await fetch(URL, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-twilio-signature': buona ? firma(p) : 'x' }, body: new URLSearchParams(p).toString() });
  return { stato: r.status, corpo: await r.text(), tipo: r.headers.get('content-type'), ms: Date.now() - t0 };
}
(async () => {
  await reset();
  let r = await invia(msg({ Body: 'Cucina: tolgo le piastrelle vecchie, 12 metri quadri.' }), false);
  ok('firma falsa respinta', r.stato === 403, r);

  r = await invia(msg({ Body: 'ok' }));
  ok('«ok» senza bozze: attendi', /Ci sto ancora lavorando/.test(r.corpo), r);

  await reset();
  r = await invia(msg({ Body: 'Cucina: tolgo le piastrelle vecchie, 12 metri quadri di rivestimento nuovo.' }));
  ok('sopralluogo: «ricevuto» nel TwiML subito', r.stato === 200 && /xml/.test(r.tipo) && r.corpo.startsWith('<Response><Message>⏳ Ricevuto') && r.corpo.includes('scrivimi «ok»') && r.ms < 3000, r);
  await sleep(5000);
  const L = await log();
  ok('nessun invio via API Twilio', !L.some((x) => x.url.includes('Messages.json')), L);
  const el = L.find((x) => x.url.includes('/pl/api/elabora'));
  ok('PreventivoLampo chiamato col testo', el && JSON.parse(el.body).testo.startsWith('Cucina'), L);

  r = await invia(msg({ Body: 'Ok!' }));
  ok('«ok»: link della bozza nel TwiML', /✅ Bozza pronta: 7 righe/.test(r.corpo) && r.corpo.includes('http://127.0.0.1:5999/pl/revisione/abc123'), r);
  r = await invia(msg({ Body: 'ok' }));
  ok('secondo «ok»: già consegnata', /Ci sto ancora lavorando/.test(r.corpo), r);

  await reset();
  await invia(msg({ From: 'whatsapp:+393339998888', Body: 'Bagno ERRORE simulato con un testo lungo abbastanza' }));
  await sleep(4000);
  r = await invia(msg({ From: 'whatsapp:+393339998888', Body: 'ok' }));
  ok('errore: consegnato con «ok»', /Non sono riuscito/.test(r.corpo), r);

  r = await invia(msg({ Body: 'ciao' }));
  ok('saluto nel TwiML', /Ciao Mario! Sono PreventivoLampo/.test(r.corpo), r);

  r = await invia(msg({ Body: 'Prova <test> & "virgolette" con un testo abbastanza lungo' }));
  ok('XML valido anche con simboli', r.corpo.startsWith('<Response><Message>') && !/<test>/.test(r.corpo), r);

  for (const e of esiti) console.log(e.join(' '));
  console.log(esiti.filter((e) => e[0] === 'OK ').length + '/' + esiti.length);
})();
