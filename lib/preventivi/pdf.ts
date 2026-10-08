import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatEuro } from "@/lib/importi";
import { VAT_NOTICE } from "@/lib/motore/iva";
import { conti, importoRiga } from "./calcolo";
import type { Azienda } from "./contesto";
import { LOCALE, linguaDi, prevalenzaItaliana, TESTI, traduzioneAllineata } from "./lingua";
import type { Preventivo } from "./modello";
import { recesso, type Recesso } from "./recesso";

// PDF del preventivo approvato: A4, Helvetica (codifica WinAnsi): unità scritte «mq» e «mc», come nei preventivi italiani.
// Con un cliente straniero il PDF è bilingue: il testo italiano sempre, sopra; la traduzione sotto, in grigio
// corsivo; in fondo la clausola «in caso di discordanza prevale il testo italiano» nelle due lingue.

// Colori del brand: testo inchiostro su bianco, intestazioni ardesia, il lime solo come filetto
// (su bianco non si legge come testo e in stampa in bianco e nero sparisce).
const hex = (h: string) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const INK = hex("#1F2029");
const GREY = hex("#5E6172");
const LINE = hex("#E4E6EC");
const ARDESIA = hex("#343645");
const LIME = hex("#B2F601");
const WHITE = rgb(1, 1, 1);
const UNIT_LABEL: Record<string, string> = { m2: "mq", m: "m", m3: "mc", cad: "cad", h: "ore", "100kg": "q.li", kg: "kg", l: "l", corpo: "a corpo" };
const REGIME_LABEL: Record<string, string> = {
  ordinaria_22: "IVA ordinaria 22%",
  agevolata_10: "IVA agevolata 10% (manutenzione su abitazione)",
  agevolata_10_beni_significativi: "IVA agevolata 10% con beni significativi (DM 29/12/1999)",
};

const euro = (c: number) => formatEuro(c).replace(/ /g, " ");
const qty = (q: number) => q.toLocaleString("it-IT", { maximumFractionDigits: 2 });

// Helvetica standard scrive solo i caratteri di Windows-1252: gli altri (testi incollati, emoji) si sostituiscono.
const CP1252_EXTRA = "€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ";
export function sicuro(s: string): string {
  return s
    .normalize("NFC")
    .replace(/[\u2010-\u2012]/g, "-")
    .replace(/[\u00A0\u2007\u202F]/g, " ")
    .replace(/\t|\r|\n/g, " ")
    .replace(/./gu, (c) => {
      const n = c.codePointAt(0)!;
      return (n >= 0x20 && n <= 0x7e) || (n >= 0xa0 && n <= 0xff) || CP1252_EXTRA.includes(c) ? c : "?";
    });
}

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const words = sicuro(text).replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) <= width) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

export async function generaPdf(p: Preventivo, company: Azienda): Promise<Uint8Array> {
  const c = conti(p);
  if (!c || !p.approvatoIl) throw new Error("Il preventivo non è approvato o è incompleto");
  const doc = await PDFDocument.create();
  doc.setTitle(`Preventivo ${p.numero}`);
  doc.setAuthor(sicuro(company.name));
  doc.setCreator("PreventivoLampo");
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ital = await doc.embedFont(StandardFonts.HelveticaOblique);
  // Traduzione per il cliente: solo se allineata alle voci (approvaIn non lascia passare il contrario).
  const tr = linguaDi(p) !== "it" && traduzioneAllineata(p) ? p.traduzione! : null;
  const T = tr ? TESTI[tr.lingua] : null;
  const M = 48;
  const W = 595.28 - 2 * M;
  let page: PDFPage = doc.addPage([595.28, 841.89]);
  let y = 841.89 - M;

  const text = (s: string, x: number, size = 9, font = reg, color = INK) => page.drawText(sicuro(s), { x, y, size, font, color });
  const ensure = (h: number) => {
    if (y - h < M + 40) {
      page = doc.addPage([595.28, 841.89]);
      y = 841.89 - M;
    }
  };
  const para = (s: string, size = 8.5, font = reg, color = GREY, width = W) => {
    for (const line of wrap(s, font, size, width)) {
      ensure(size + 4);
      text(line, M, size, font, color);
      y -= size + 3.5;
    }
  };

  // Intestazione: logo dell'impresa a destra, se c'è (alto al massimo 44 punti, largo al massimo 140).
  const logo = await company.logo();
  if (logo) {
    const img = logo.tipo === "image/png" ? await doc.embedPng(logo.bytes) : await doc.embedJpg(logo.bytes);
    const scala = Math.min(44 / img.height, 140 / img.width, 1);
    page.drawImage(img, { x: M + W - img.width * scala, y: 841.89 - M + 10 - img.height * scala, width: img.width * scala, height: img.height * scala });
  }
  const larghezzaTesto = logo ? W - 160 : W;
  const nome = wrap(company.name, bold, 13, larghezzaTesto);
  text(nome[0], M, 13, bold, ARDESIA);
  y -= 16;
  for (const riga of wrap(`${company.address} · P.IVA ${company.vatNumber}`, reg, 8, larghezzaTesto)) {
    text(riga, M, 8, reg, GREY);
    y -= 11;
  }
  text(`${company.phone} · ${company.email}`, M, 8, reg, GREY);
  y -= 10;
  if (logo) y = Math.min(y, 841.89 - M - 50);
  page.drawRectangle({ x: M, y, width: W, height: 3, color: LIME });
  y -= 24;
  text(`Preventivo n. ${p.numero}`, M, 16, bold, ARDESIA);
  if (T) {
    y -= 15;
    text(`${T.preventivoN} ${p.numero}`, M, 11, ital, GREY);
  }
  const data = new Date(p.approvatoIl);
  const scade = new Date(data.getTime() + company.quoteValidityDays * 86_400_000);
  const fmt = (d: Date, locale = "it-IT") => d.toLocaleDateString(locale, { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric" });
  y -= 16;
  text(`Data ${fmt(data)} · valido fino al ${fmt(scade)} (${company.quoteValidityDays} giorni)`, M, 9, reg, GREY);
  if (T && tr) {
    y -= 12;
    text(T.data(fmt(data, LOCALE[tr.lingua]), fmt(scade, LOCALE[tr.lingua]), company.quoteValidityDays), M, 8.5, ital, GREY);
  }
  y -= 22;
  text(T ? `Cliente / ${T.cliente}` : "Cliente", M, 8, bold, GREY);
  y -= 12;
  text(p.cliente.name ?? "—", M, 10, bold);
  y -= 12;
  if (p.cliente.address) {
    text(p.cliente.address, M, 9);
    y -= 12;
  }
  y -= 12;

  // Tabella
  const col = { desc: M, q: M + W - 210, u: M + W - 165, pu: M + W - 125, imp: M + W };
  const header = () => {
    page.drawRectangle({ x: M, y: y - (T ? 16 : 6), width: W, height: T ? 30 : 20, color: ARDESIA });
    const etichette: [string, number][] = [["Lavorazione", col.desc + 6], ["Q.tà", col.q], ["U.m.", col.u], ["Prezzo", col.pu]];
    for (const [e, x] of etichette) text(e, x, 8, bold, WHITE);
    page.drawText("Importo", { x: col.imp - 6 - bold.widthOfTextAtSize("Importo", 8), y, size: 8, font: bold, color: WHITE });
    if (T) {
      const sotto: [string, number][] = [[T.colonne.lavorazione, col.desc + 6], [T.colonne.qta, col.q], [T.colonne.um, col.u], [T.colonne.prezzo, col.pu]];
      for (const [e, x] of sotto) page.drawText(sicuro(e), { x, y: y - 10, size: 7, font: ital, color: WHITE });
      page.drawText(sicuro(T.colonne.importo), { x: col.imp - 6 - ital.widthOfTextAtSize(sicuro(T.colonne.importo), 7), y: y - 10, size: 7, font: ital, color: WHITE });
    }
    y -= T ? 34 : 24;
  };
  header();
  p.righe.forEach((r, i) => {
    const desc = wrap(r.work, reg, 9, col.q - col.desc - 16);
    const tradotta = tr ? wrap(tr.righe[i], ital, 8.5, col.q - col.desc - 16) : [];
    ensure((desc.length + tradotta.length) * 12 + 8);
    const amount = euro(importoRiga(r)!);
    text(desc[0], col.desc + 6, 9);
    text(qty(r.quantity!), col.q, 9);
    text(UNIT_LABEL[r.unit!] ?? r.unit!, col.u, 9);
    text(euro(r.unitPriceCents!), col.pu, 9);
    page.drawText(amount, { x: col.imp - 6 - reg.widthOfTextAtSize(amount, 9), y, size: 9, font: reg, color: INK });
    const unitaTradotta = T ? (T.unita[r.unit!] ?? ({ m2: "m²", m3: "m³" } as Record<string, string>)[r.unit!]) : undefined;
    if (unitaTradotta) page.drawText(sicuro(unitaTradotta), { x: col.u, y: y - 11, size: 7.5, font: ital, color: GREY });
    for (const extra of desc.slice(1)) {
      y -= 11;
      text(extra, col.desc + 6, 9);
    }
    for (const t of tradotta) {
      y -= 11;
      text(t, col.desc + 6, 8.5, ital, GREY);
    }
    if (unitaTradotta && !tradotta.length && desc.length === 1) y -= 11;
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.5, color: LINE });
    y -= 12;
  });

  // Totali
  ensure(90);
  const right = (label: string, value: string, tradotta?: string) => {
    text(label, col.pu - 150, 9, reg);
    page.drawText(value, { x: col.imp - 6 - reg.widthOfTextAtSize(value, 9), y, size: 9, font: reg, color: INK });
    if (tradotta) {
      y -= 10;
      text(tradotta, col.pu - 150, 7.5, ital, GREY);
    }
    y -= 15;
  };
  right("Imponibile", euro(c.taxableCents), T?.imponibile);
  if (c.at10Cents > 0) right(`IVA 10% su ${euro(c.at10Cents)}`, euro(Math.round(c.at10Cents * 0.1)), T?.ivaSu(10, euro(c.at10Cents)));
  if (c.at22Cents > 0) right(`IVA 22% su ${euro(c.at22Cents)}`, euro(Math.round(c.at22Cents * 0.22)), T?.ivaSu(22, euro(c.at22Cents)));
  y -= 2;
  page.drawRectangle({ x: col.pu - 156, y: y - 6, width: col.imp - (col.pu - 156), height: 22, color: ARDESIA });
  text(T ? `Totale / ${T.totale}` : "Totale", col.pu - 150, 12, bold, WHITE);
  page.drawText(euro(c.totalCents), { x: col.imp - 6 - bold.widthOfTextAtSize(euro(c.totalCents), 12), y, size: 12, font: bold, color: WHITE });
  y -= 30;

  para(`${REGIME_LABEL[c.regime!]}.${c.beniSignificativiCents > 0 ? ` Valore dei beni significativi: ${euro(c.beniSignificativiCents)}.` : ""} ${VAT_NOTICE}`);
  if (T) para(`${T.regime[c.regime!]}${c.beniSignificativiCents > 0 ? ` ${T.valoreBeni(euro(c.beniSignificativiCents))}` : ""}`, 8, ital);
  if (p.esclusioni.length) {
    y -= 6;
    para(T ? `Esclusi dal preventivo / ${T.esclusi}` : "Esclusi dal preventivo", 8.5, bold, INK);
    p.esclusioni.forEach((e, i) => {
      para(`– ${e}`);
      if (tr) para(`  ${tr.esclusioni[i]}`, 8, ital);
    });
  }
  y -= 6;
  para(T ? `Condizioni / ${T.condizioniTitolo}` : "Condizioni", 8.5, bold, INK);
  para(
    `Prezzi IVA esclusa salvo dove indicato. Lavori non elencati e varianti richieste in corso d'opera si preventivano a parte. ` +
      `Se il cliente è un consumatore e accetta a distanza (link), ha diritto di recesso entro 14 giorni dall'accettazione, salvo esecuzione dei lavori richiesta prima della scadenza.`,
  );
  if (T) para(T.condizioni, 8, ital);
  if (company.condizioniPagamento || company.iban) {
    y -= 2;
    para(T ? `Pagamento / ${T.pagamento}` : "Pagamento", 8.5, bold, INK);
    if (company.condizioniPagamento) para(company.condizioniPagamento);
    if (company.iban) {
      const iban = company.iban.replace(/(.{4})/g, "$1 ").trim();
      para(`IBAN ${iban} intestato a ${company.name}`);
      if (T) para(T.iban(iban, company.name), 8, ital);
    }
  }
  if (p.accettazione) {
    y -= 8;
    ensure(40);
    const quando = new Date(p.accettazione.il).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const riga = `${p.accettazione.esito === "accettato" ? "Accettato" : "Rifiutato"} online da ${p.accettazione.nome} il ${quando}.`;
    const alto = T ? 38 : 26;
    page.drawRectangle({ x: M, y: y - (T ? 22 : 10), width: W, height: alto, borderColor: ARDESIA, borderWidth: 1 });
    page.drawRectangle({ x: M, y: y - (T ? 22 : 10), width: 4, height: alto, color: p.accettazione.esito === "accettato" ? LIME : GREY });
    text(riga, M + 12, 9.5, bold, INK);
    if (T && tr) {
      const q = new Date(p.accettazione.il).toLocaleString(LOCALE[tr.lingua], { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
      page.drawText(sicuro(T.esito(p.accettazione.esito, p.accettazione.nome, q)), { x: M + 12, y: y - 13, size: 8.5, font: ital, color: GREY });
    }
    y -= T ? 42 : 30;
  }
  if (T && tr) {
    y -= 4;
    para(prevalenzaItaliana(tr.lingua), 8, bold, INK);
    para(T.prevalenza, 8, ital, INK);
  }
  y -= 6;
  if (company.avviso) para(company.avviso, 7.5);

  // Ultima pagina: informazioni sul recesso e modulo tipo, in italiano e, se c'è, nella lingua del cliente.
  page = doc.addPage([595.28, 841.89]);
  y = 841.89 - M;
  const contatti = { nome: company.name, indirizzo: company.address, telefono: company.phone, email: company.email };
  const bloccoRecesso = (r: Recesso, font: PDFFont, colore = INK) => {
    para(r.titolo, 11, bold, ARDESIA);
    y -= 2;
    for (const t of r.paragrafi) para(t, 8.5, font, colore);
    y -= 4;
    para(r.effettiTitolo, 9, bold, INK);
    for (const t of r.effetti) para(t, 8.5, font, colore);
    y -= 6;
    para(r.modulo.titolo, 9, bold, INK);
    para(r.modulo.istruzione, 8, font, GREY);
    for (const t of r.modulo.righe) {
      y -= 2;
      para(t, 8.5, font, colore);
    }
  };
  bloccoRecesso(recesso("it", contatti, p.numero), reg);
  if (tr) {
    page = doc.addPage([595.28, 841.89]);
    y = 841.89 - M;
    bloccoRecesso(recesso(tr.lingua, contatti, p.numero), ital, GREY);
  }

  return doc.save();
}
