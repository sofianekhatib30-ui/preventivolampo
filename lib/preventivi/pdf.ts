import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { formatEuro } from "@/lib/importi";
import type { Company } from "@/lib/listino/schema";
import { VAT_NOTICE } from "@/lib/motore/iva";
import type { z } from "zod";
import { conti, importoRiga } from "./calcolo";
import type { Preventivo } from "./modello";

// PDF del preventivo approvato: A4, Helvetica (codifica WinAnsi): unità scritte «mq» e «mc», come nei preventivi italiani.

const INK = rgb(0.086, 0.082, 0.059);
const GREY = rgb(0.36, 0.35, 0.32);
const LINE = rgb(0.85, 0.83, 0.78);
const SIGNAL = rgb(1, 0.76, 0.12);
const UNIT_LABEL: Record<string, string> = { m2: "mq", m: "m", m3: "mc", cad: "cad", h: "ore", "100kg": "q.li" };
const REGIME_LABEL: Record<string, string> = {
  ordinaria_22: "IVA ordinaria 22%",
  agevolata_10: "IVA agevolata 10% (manutenzione su abitazione)",
  agevolata_10_beni_significativi: "IVA agevolata 10% con beni significativi (DM 29/12/1999)",
};

const euro = (c: number) => formatEuro(c).replace(/ /g, " ");
const qty = (q: number) => q.toLocaleString("it-IT", { maximumFractionDigits: 2 });

function wrap(text: string, font: PDFFont, size: number, width: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
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

export async function generaPdf(p: Preventivo, company: z.infer<typeof Company>): Promise<Uint8Array> {
  const c = conti(p);
  if (!c || !p.approvatoIl) throw new Error("Il preventivo non è approvato o è incompleto");
  const doc = await PDFDocument.create();
  doc.setTitle(`Preventivo ${p.numero}`);
  doc.setAuthor(company.name);
  doc.setCreator("PreventivoLampo");
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const M = 48;
  const W = 595.28 - 2 * M;
  let page: PDFPage = doc.addPage([595.28, 841.89]);
  let y = 841.89 - M;

  const text = (s: string, x: number, size = 9, font = reg, color = INK) => page.drawText(s, { x, y, size, font, color });
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

  // Intestazione
  page.drawRectangle({ x: M, y: y - 4, width: 10, height: 10, color: SIGNAL });
  text(company.name, M + 16, 12, bold);
  y -= 16;
  text(`${company.address} · P.IVA ${company.vatNumber}`, M, 8, reg, GREY);
  y -= 11;
  text(`${company.phone} · ${company.email}`, M, 8, reg, GREY);
  y -= 26;
  text(`Preventivo n. ${p.numero}`, M, 16, bold);
  const data = new Date(p.approvatoIl);
  const scade = new Date(data.getTime() + company.quoteValidityDays * 86_400_000);
  const fmt = (d: Date) => d.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
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
    page.drawLine({ start: { x: M, y: y + 12 }, end: { x: M + W, y: y + 12 }, thickness: 1, color: INK });
    text("Lavorazione", col.desc, 8, bold);
    text("Q.tà", col.q, 8, bold);
    text("U.m.", col.u, 8, bold);
    text("Prezzo", col.pu, 8, bold);
    page.drawText("Importo", { x: col.imp - bold.widthOfTextAtSize("Importo", 8), y, size: 8, font: bold, color: INK });
    y -= 8;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.5, color: LINE });
    y -= 12;
  };
  header();
  for (const r of p.righe) {
    const desc = wrap(r.work, reg, 9, col.q - col.desc - 10);
    ensure(desc.length * 12 + 8);
    const amount = euro(importoRiga(r)!);
    text(desc[0], col.desc, 9);
    text(qty(r.quantity!), col.q, 9);
    text(UNIT_LABEL[r.unit!] ?? r.unit!, col.u, 9);
    text(euro(r.unitPriceCents!), col.pu, 9);
    page.drawText(amount, { x: col.imp - reg.widthOfTextAtSize(amount, 9), y, size: 9, font: reg, color: INK });
    for (const extra of desc.slice(1)) {
      y -= 11;
      text(extra, col.desc, 9);
    }
    y -= 6;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.5, color: LINE });
    y -= 12;
  }

  // Totali
  ensure(90);
  const right = (label: string, value: string, font = reg, size = 9) => {
    text(label, col.pu - 150, size, font);
    page.drawText(value, { x: col.imp - font.widthOfTextAtSize(value, size), y, size, font, color: INK });
    y -= size + 6;
  };
  right("Imponibile", euro(c.taxableCents));
  if (c.at10Cents > 0) right(`IVA 10% su ${euro(c.at10Cents)}`, euro(Math.round(c.at10Cents * 0.1)));
  if (c.at22Cents > 0) right(`IVA 22% su ${euro(c.at22Cents)}`, euro(Math.round(c.at22Cents * 0.22)));
  y -= 2;
  right("Totale", euro(c.totalCents), bold, 12);
  y -= 8;

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
  y -= 6;
  para(company.fictitiousNotice + " Documento generato da PreventivoLampo a scopo dimostrativo.", 7.5);

  return doc.save();
}
