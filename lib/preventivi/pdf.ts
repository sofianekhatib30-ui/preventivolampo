import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatEuro } from "@/lib/importi";
import { VAT_NOTICE } from "@/lib/motore/iva";
import { conti, importoRiga } from "./calcolo";
import type { Azienda } from "./contesto";
import type { Preventivo } from "./modello";

// PDF del preventivo approvato: A4, Helvetica (codifica WinAnsi): unità scritte «mq» e «mc», come nei preventivi italiani.

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
  const data = new Date(p.approvatoIl);
  const scade = new Date(data.getTime() + company.quoteValidityDays * 86_400_000);
  const fmt = (d: Date) => d.toLocaleDateString("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric" });
  y -= 16;
  text(`Data ${fmt(data)} · valido fino al ${fmt(scade)} (${company.quoteValidityDays} giorni)`, M, 9, reg, GREY);
  y -= 22;
  text("Cliente", M, 8, bold, GREY);
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
    page.drawRectangle({ x: M, y: y - 6, width: W, height: 20, color: ARDESIA });
    text("Lavorazione", col.desc + 6, 8, bold, WHITE);
    text("Q.tà", col.q, 8, bold, WHITE);
    text("U.m.", col.u, 8, bold, WHITE);
    text("Prezzo", col.pu, 8, bold, WHITE);
    page.drawText("Importo", { x: col.imp - 6 - bold.widthOfTextAtSize("Importo", 8), y, size: 8, font: bold, color: WHITE });
    y -= 24;
  };
  header();
  for (const r of p.righe) {
    const desc = wrap(r.work, reg, 9, col.q - col.desc - 16);
    ensure(desc.length * 12 + 8);
    const amount = euro(importoRiga(r)!);
    text(desc[0], col.desc + 6, 9);
    text(qty(r.quantity!), col.q, 9);
    text(UNIT_LABEL[r.unit!] ?? r.unit!, col.u, 9);
    text(euro(r.unitPriceCents!), col.pu, 9);
    page.drawText(amount, { x: col.imp - 6 - reg.widthOfTextAtSize(amount, 9), y, size: 9, font: reg, color: INK });
    for (const extra of desc.slice(1)) {
      y -= 11;
      text(extra, col.desc + 6, 9);
    }
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.5, color: LINE });
    y -= 12;
  }

  // Totali
  ensure(90);
  const right = (label: string, value: string, font = reg, size = 9) => {
    text(label, col.pu - 150, size, font);
    page.drawText(value, { x: col.imp - 6 - font.widthOfTextAtSize(value, size), y, size, font, color: INK });
    y -= size + 6;
  };
  right("Imponibile", euro(c.taxableCents));
  if (c.at10Cents > 0) right(`IVA 10% su ${euro(c.at10Cents)}`, euro(Math.round(c.at10Cents * 0.1)));
  if (c.at22Cents > 0) right(`IVA 22% su ${euro(c.at22Cents)}`, euro(Math.round(c.at22Cents * 0.22)));
  y -= 2;
  page.drawRectangle({ x: col.pu - 156, y: y - 6, width: col.imp - (col.pu - 156), height: 22, color: ARDESIA });
  text("Totale", col.pu - 150, 12, bold, WHITE);
  page.drawText(euro(c.totalCents), { x: col.imp - 6 - bold.widthOfTextAtSize(euro(c.totalCents), 12), y, size: 12, font: bold, color: WHITE });
  y -= 30;

  para(`${REGIME_LABEL[c.regime!]}.${c.beniSignificativiCents > 0 ? ` Valore dei beni significativi: ${euro(c.beniSignificativiCents)}.` : ""} ${VAT_NOTICE}`);
  if (p.esclusioni.length) {
    y -= 6;
    para("Esclusi dal preventivo", 8.5, bold, INK);
    for (const e of p.esclusioni) para(`– ${e}`);
  }
  y -= 6;
  para("Condizioni", 8.5, bold, INK);
  para(
    `Prezzi IVA esclusa salvo dove indicato. Lavori non elencati e varianti richieste in corso d'opera si preventivano a parte. ` +
      `Se il cliente è un consumatore e accetta a distanza (link), ha diritto di recesso entro 14 giorni dall'accettazione, salvo esecuzione dei lavori richiesta prima della scadenza.`,
  );
  if (company.condizioniPagamento || company.iban) {
    y -= 2;
    para("Pagamento", 8.5, bold, INK);
    if (company.condizioniPagamento) para(company.condizioniPagamento);
    if (company.iban) para(`IBAN ${company.iban.replace(/(.{4})/g, "$1 ").trim()} intestato a ${company.name}`);
  }
  if (p.accettazione) {
    y -= 8;
    ensure(40);
    const quando = new Date(p.accettazione.il).toLocaleString("it-IT", { timeZone: "Europe/Rome", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const riga = `${p.accettazione.esito === "accettato" ? "Accettato" : "Rifiutato"} online da ${p.accettazione.nome} il ${quando}.`;
    page.drawRectangle({ x: M, y: y - 10, width: W, height: 26, borderColor: ARDESIA, borderWidth: 1 });
    page.drawRectangle({ x: M, y: y - 10, width: 4, height: 26, color: p.accettazione.esito === "accettato" ? LIME : GREY });
    text(riga, M + 12, 9.5, bold, INK);
    y -= 30;
  }
  y -= 6;
  if (company.avviso) para(company.avviso, 7.5);

  return doc.save();
}
