// Finti Slack API, OpenAI e PreventivoLampo per provare il flusso senza toccare servizi veri.
const http = require('http');
const log = [];
http.createServer((req, res) => {
  let chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const entry = { method: req.method, url: req.url, auth: req.headers.authorization || '', secret: req.headers['x-elabora-secret'] || '', ct: req.headers['content-type'] || '', body: body.toString('utf8').slice(0, 600) };
    if (req.url === '/_log') { res.setHeader('content-type', 'application/json'); return res.end(JSON.stringify(log)); }
    if (req.url === '/_reset') { log.length = 0; return res.end('ok'); }
    log.push(entry);
    res.setHeader('content-type', 'application/json');
    if (/^\/graph\/\d+\/messages/.test(req.url)) return res.end(JSON.stringify({ messaging_product: 'whatsapp', messages: [{ id: 'wamid.RISPOSTA' }] }));
    if (req.url.startsWith('/graph/MEDIA1')) return res.end(JSON.stringify({ url: 'http://127.0.0.1:5999/files/wa-media', mime_type: 'audio/ogg; codecs=opus', id: 'MEDIA1' }));
    if (req.url.startsWith('/files/wa-media')) { res.setHeader('content-type', 'audio/ogg'); return res.end(Buffer.from('OGGFINTO')); }
    if (req.url.startsWith('/slack/chat.postMessage')) return res.end(JSON.stringify({ ok: true, channel: 'D1', ts: '1.2' }));
    if (req.url.startsWith('/files/clip.m4a')) { res.setHeader('content-type', 'audio/mp4'); return res.end(Buffer.from('FINTOAUDIO')); }
    if (req.url.startsWith('/openai/v1/audio/transcriptions')) return res.end(JSON.stringify({ text: 'Bagno di tre metri per due, rifare piastrelle a pavimento e rivestimento fino a due metri.' }));
    if (req.url.startsWith('/pl/api/elabora')) {
      if (req.headers['x-elabora-secret'] !== 'segreto-prova') { res.statusCode = 404; return res.end(JSON.stringify({ errore: 'Non disponibile.' })); }
      const j = JSON.parse(body.toString() || '{}');
      if (String(j.testo || '').includes('ERRORE')) { res.statusCode = 500; return res.end(JSON.stringify({ errore: 'boom' })); }
      res.statusCode = 201; return res.end(JSON.stringify({ id: 'abc123', revisione: '/revisione/abc123', righe: 7 }));
    }
    res.statusCode = 404; res.end('{}');
  });
}).listen(5999, () => console.log('mock su 5999'));
