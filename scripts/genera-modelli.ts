// Genera i modelli di preventivo gratuiti, uno per mestiere: public/modelli/<slug>.pdf e .xlsx.
// Le voci sono quelle della pagina del mestiere (lib/contenuti/it/mestieri), con l'unità già scritta;
// quantità e prezzi restano vuoti: sono dell'artigiano. I file si rigenerano quando cambiano le voci.
// Uso: npx tsx scripts/genera-modelli.ts
import { mkdirSync, writeFileSync } from "node:fs";
import ExcelJS from "exceljs";
import { PDFDocument, type PDFFont, type PDFPage, rgb, StandardFonts } from "pdf-lib";
import { contenutiIt } from "@/lib/contenuti/it";
import { type IdMestiere, MESTIERI, SLUG_MESTIERE } from "@/lib/contenuti/registro";
import { sicuro } from "@/lib/preventivi/pdf";

const hex = (h: string) => rgb(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255);
const INK = hex("#1F2029");
const GREY = hex("#5E6172");
const LINE = hex("#C9CCD5");
const SOFT = hex("#F5F6F2");
const ARDESIA = hex("#343645");
const LIME = hex("#B2F601");

// Unità come nei preventivi italiani (Helvetica standard non ha «²» in tutte le stampanti: «mq» è più sicuro).
const UNITA: Record<string, string> = { "m²": "mq", "m³": "mc", m: "m", cad: "cad", h: "ore", corpo: "a corpo", kg: "kg" };

const A4 = { w: 595.28, h: 841.89 };
const M = 48;

function righe(text: string, font: PDFFont, size: number, width: number): string[] {
  const parole = sicuro(text).replace(/\s+/g, " ").trim().split(" ");
  const out: string[] = [];
  let cur = "";
  for (const p of parole) {
    const prova = cur ? `${cur} ${p}` : p;
    if (font.widthOfTextAtSize(prova, size) <= width) cur = prova;
    else {
      if (cur) out.push(cur);
      cur = p;
    }
  }
  if (cur) out.push(cur);
  return out.length ? out : [""];
}

async function pdf(id: IdMestiere): Promise<Uint8Array> {
  const m = contenutiIt.mestieri[id];
  const doc = await PDFDocument.create();
  doc.setTitle(`Modello di preventivo da ${m.nome.toLowerCase()}`);
  doc.setAuthor("PreventivoLampo");
  doc.setSubject("Modello gratuito di preventivo");
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let page: PDFPage = doc.addPage([A4.w, A4.h]);
  let y = A4.h - M;
  const nuova = () => {
    page = doc.addPage([A4.w, A4.h]);
    y = A4.h - M;
  };
  const spazio = (h: number) => {
    if (y - h < M + 30) nuova();
  };
  const testo = (s: string, x: number, size = 10, font = reg, color = INK) => page.drawText(sicuro(s), { x, y, size, font, color });
  const linea = (x1: number, x2: number, yy = y, color = LINE, spessore = 0.7) => page.drawLine({ start: { x: x1, y: yy }, end: { x: x2, y: yy }, thickness: spessore, color });
  const campo = (etichetta: string, x: number, larghezza: number) => {
    testo(etichetta, x, 8.5, reg, GREY);
    linea(x, x + larghezza, y - 16);
  };

  // Intestazione
  page.drawRectangle({ x: 0, y: A4.h - 6, width: A4.w, height: 6, color: LIME });
  testo("Preventivo", M, 24, bold);
  page.drawText(sicuro(`Lavori da ${m.nome.toLowerCase()}`), { x: M, y: y - 18, size: 11, font: reg, color: GREY });
  page.drawText("n. ________   del ____/____/________", { x: A4.w - M - 190, y, size: 10, font: reg, color: INK });
  y -= 52;

  // Impresa e cliente
  const col = (A4.w - 2 * M - 24) / 2;
  testo("Impresa", M, 11, bold);
  testo("Cliente", M + col + 24, 11, bold);
  y -= 22;
  for (const [a, b] of [
    ["Ragione sociale", "Nome e cognome / ragione sociale"],
    ["Indirizzo", "Indirizzo"],
    ["Partita IVA", "Codice fiscale / partita IVA"],
    ["Telefono e email", "Telefono e email"],
  ]) {
    campo(a, M, col);
    campo(b, M + col + 24, col);
    y -= 30;
  }
  campo("Luogo dei lavori", M, A4.w - 2 * M);
  y -= 30;
  campo("Descrizione del lavoro", M, A4.w - 2 * M);
  y -= 22;
  linea(M, A4.w - M, y - 16);
  y -= 34;

  // Tabella delle voci
  const X = { voce: M, um: M + 270, q: M + 318, pu: M + 375, imp: M + 445, fine: A4.w - M };
  const intestazione = () => {
    page.drawRectangle({ x: M, y: y - 6, width: A4.w - 2 * M, height: 20, color: ARDESIA });
    const bianco = rgb(1, 1, 1);
    page.drawText("Voce", { x: X.voce + 6, y, size: 9, font: bold, color: bianco });
    page.drawText("U.m.", { x: X.um, y, size: 9, font: bold, color: bianco });
    page.drawText("Quantità", { x: X.q, y, size: 9, font: bold, color: bianco });
    page.drawText(sicuro("Prezzo unit. €"), { x: X.pu, y, size: 9, font: bold, color: bianco });
    page.drawText(sicuro("Importo €"), { x: X.imp, y, size: 9, font: bold, color: bianco });
    y -= 22;
  };
  intestazione();
  const voci = [...m.voci.righe.map((r) => ({ voce: r.voce, um: UNITA[r.unita] ?? r.unita })), ...Array.from({ length: 4 }, () => ({ voce: "", um: "" }))];
  voci.forEach((r, i) => {
    const linee = righe(r.voce, reg, 9.5, X.um - X.voce - 14);
    const h = Math.max(22, linee.length * 12 + 10);
    if (y - h < M + 30) {
      nuova();
      intestazione();
    }
    if (i % 2 === 1) page.drawRectangle({ x: M, y: y - h + 14, width: A4.w - 2 * M, height: h, color: SOFT });
    linee.forEach((l, j) => page.drawText(l, { x: X.voce + 6, y: y - j * 12, size: 9.5, font: reg, color: INK }));
    page.drawText(sicuro(r.um), { x: X.um, y, size: 9.5, font: reg, color: GREY });
    for (const x of [X.q, X.pu, X.imp]) linea(x, x + (x === X.imp ? X.fine - X.imp - 4 : 50), y - 3);
    y -= h;
  });

  // Totali
  spazio(110);
  y -= 8;
  for (const [etichetta, forte] of [
    ["Imponibile", false],
    ["IVA ______ %", false],
    ["Totale", true],
  ] as const) {
    page.drawText(sicuro(etichetta), { x: X.pu - 60, y, size: forte ? 11 : 10, font: forte ? bold : reg, color: INK });
    page.drawText(sicuro("€"), { x: X.imp - 12, y, size: 10, font: reg, color: GREY });
    linea(X.imp, X.fine, y - 3, forte ? INK : LINE, forte ? 1 : 0.7);
    y -= 22;
  }
  y -= 6;
  for (const l of righe(
    "IVA nei lavori su abitazioni: di solito 10% per manutenzione ordinaria e straordinaria (L. 488/1999); per i beni significativi del DM 29/12/1999 il 10% vale solo fino al valore del resto del lavoro, l'eccedenza va al 22%. Verifica il tuo caso con il commercialista.",
    reg,
    8,
    A4.w - 2 * M,
  )) {
    page.drawText(l, { x: M, y, size: 8, font: reg, color: GREY });
    y -= 11;
  }

  // Esclusioni e condizioni
  const blocco = (titolo: string, linee: string[], vuote = 0) => {
    spazio(30 + linee.length * 16 + vuote * 22);
    y -= 18;
    testo(titolo, M, 11, bold);
    y -= 18;
    for (const l of linee) {
      for (const r of righe(l, reg, 9.5, A4.w - 2 * M)) {
        page.drawText(r, { x: M, y, size: 9.5, font: reg, color: INK });
        y -= 14;
      }
      y -= 2;
    }
    for (let i = 0; i < vuote; i++) {
      linea(M, A4.w - M, y - 4);
      y -= 22;
    }
  };
  blocco("Escluso dal preventivo", [], 3);
  blocco("Condizioni", [
    "Validità dell'offerta: ______ giorni dalla data del preventivo.",
    "Inizio lavori: ____________   Durata prevista: ____________",
    "Pagamenti: acconto ______ % all'accettazione, saldo a fine lavori. Modalità: ____________",
    "Varianti e lavori in più si eseguono solo se autorizzati per iscritto, con il prezzo concordato prima.",
    "Se il cliente è un consumatore e il contratto si conclude fuori dai locali dell'impresa o a distanza, ha diritto di recesso entro 14 giorni (Codice del consumo, artt. 52 e seguenti): consegnagli l'informativa e il modulo di recesso.",
  ]);
  spazio(90);
  y -= 26;
  testo("Per accettazione", M, 11, bold);
  y -= 36;
  testo("Data", M, 9, reg, GREY);
  linea(M + 30, M + 180, y - 2);
  testo("Firma del cliente", M + 230, 9, reg, GREY);
  linea(M + 320, A4.w - M, y - 2);

  // Piè di pagina su ogni pagina
  const pagine = doc.getPages();
  pagine.forEach((p, i) => {
    p.drawText(sicuro(`Modello gratuito di PreventivoLampo · pagina ${i + 1} di ${pagine.length}`), { x: M, y: 26, size: 7.5, font: reg, color: GREY });
  });
  return doc.save({ useObjectStreams: false });
}

async function excel(id: IdMestiere): Promise<Buffer> {
  const m = contenutiIt.mestieri[id];
  const wb = new ExcelJS.Workbook();
  wb.creator = "PreventivoLampo";
  wb.created = new Date("2026-10-09T12:00:00Z");
  const ws = wb.addWorksheet("Preventivo", { pageSetup: { paperSize: 9, orientation: "portrait", fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
  ws.columns = [{ width: 52 }, { width: 9 }, { width: 11 }, { width: 15 }, { width: 15 }];
  const grassetto = { bold: true };
  ws.addRow([`Preventivo: lavori da ${m.nome.toLowerCase()}`]).font = { bold: true, size: 16 };
  ws.addRow(["Numero", "", "Data"]);
  ws.addRow([]);
  for (const [a, b] of [
    ["Impresa", "Cliente"],
    ["Ragione sociale:", "Nome e cognome / ragione sociale:"],
    ["Indirizzo:", "Indirizzo:"],
    ["Partita IVA:", "Codice fiscale / partita IVA:"],
    ["Telefono e email:", "Telefono e email:"],
  ]) {
    const r = ws.addRow([a, "", b]);
    if (a === "Impresa") r.font = grassetto;
  }
  ws.addRow(["Luogo dei lavori:"]);
  ws.addRow(["Descrizione del lavoro:"]);
  ws.addRow([]);
  const testa = ws.addRow(["Voce", "U.m.", "Quantità", "Prezzo unitario €", "Importo €"]);
  testa.eachCell((c) => {
    c.font = { bold: true, color: { argb: "FFFFFFFF" } };
    c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF343645" } };
  });
  const prima = testa.number + 1;
  const voci = [...m.voci.righe.map((r) => [r.voce, UNITA[r.unita] ?? r.unita]), ...Array.from({ length: 6 }, () => ["", ""])];
  for (const [voce, um] of voci) {
    const r = ws.addRow([voce, um, null, null, null]);
    r.getCell(5).value = { formula: `IF(OR(C${r.number}="",D${r.number}=""),"",C${r.number}*D${r.number})` };
    r.getCell(3).numFmt = "#,##0.00";
    r.getCell(4).numFmt = '#,##0.00 "€"';
    r.getCell(5).numFmt = '#,##0.00 "€"';
    r.getCell(1).alignment = { wrapText: true, vertical: "top" };
  }
  const ultima = ws.lastRow!.number;
  ws.addRow([]);
  const imp = ws.addRow(["", "", "", "Imponibile", { formula: `SUM(E${prima}:E${ultima})` }]);
  const aliq = ws.addRow(["", "", "", "Aliquota IVA", 0.1]);
  aliq.getCell(5).numFmt = "0%";
  const iva = ws.addRow(["", "", "", "IVA", { formula: `E${imp.number}*E${aliq.number}` }]);
  const tot = ws.addRow(["", "", "", "Totale", { formula: `E${imp.number}+E${iva.number}` }]);
  for (const r of [imp, iva, tot]) r.getCell(5).numFmt = '#,##0.00 "€"';
  tot.font = grassetto;
  ws.addRow([]);
  ws.addRow([
    "IVA nei lavori su abitazioni: di solito 10% per manutenzione ordinaria e straordinaria; per i beni significativi del DM 29/12/1999 il 10% vale solo fino al valore del resto del lavoro. Cambia l'aliquota se il tuo caso è diverso, e verifica con il commercialista.",
  ]).getCell(1).alignment = { wrapText: true };
  ws.addRow([]);
  ws.addRow(["Escluso dal preventivo"]).font = grassetto;
  ws.addRow(["-"]);
  ws.addRow(["-"]);
  ws.addRow([]);
  ws.addRow(["Condizioni"]).font = grassetto;
  for (const l of [
    "Validità dell'offerta: ___ giorni dalla data del preventivo.",
    "Inizio lavori: ___   Durata prevista: ___",
    "Pagamenti: acconto ___ % all'accettazione, saldo a fine lavori.",
    "Varianti e lavori in più solo se autorizzati per iscritto, con il prezzo concordato prima.",
    "Cliente consumatore e contratto concluso fuori dai locali dell'impresa o a distanza: diritto di recesso entro 14 giorni (Codice del consumo, artt. 52 e seguenti).",
  ])
    ws.addRow([l]).getCell(1).alignment = { wrapText: true };
  ws.addRow([]);
  ws.addRow(["Per accettazione. Data:", "", "Firma del cliente:"]).font = grassetto;
  ws.addRow([]);
  ws.addRow(["Modello gratuito di PreventivoLampo"]).font = { italic: true, color: { argb: "FF5E6172" }, size: 9 };
  return Buffer.from(await wb.xlsx.writeBuffer());
}

async function main() {
  mkdirSync("public/modelli", { recursive: true });
  for (const id of MESTIERI) {
    writeFileSync(`public/modelli/${SLUG_MESTIERE[id]}.pdf`, await pdf(id));
    writeFileSync(`public/modelli/${SLUG_MESTIERE[id]}.xlsx`, await excel(id));
  }
  console.log(`scritti ${MESTIERI.length * 2} modelli in public/modelli`);
}

main();
