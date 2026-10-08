import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { VoceMotore } from "@/lib/listino/schema";
import { elabora } from "@/lib/motore";
import type { ToolCaller } from "@/lib/motore/claude";
import type { Draft } from "@/lib/motore/tipi";
import { mancanze } from "./calcolo";
import type { Contesto } from "./contesto";
import { daBozza, nuovoId } from "./da-bozza";
import { demo, listino, perCodice } from "./demo";
import { Lingua, ModificheBozza, type Preventivo } from "./modello";
import { traduciVoci } from "./traduzione";
import { linguaDi, mancanzaTraduzione } from "./lingua";
import { generaPdf } from "./pdf";
import { Rifiuto } from "./rifiuto";
import { perToken } from "./risolvi";

// Le operazioni sul preventivo. Ogni passaggio di stato si controlla qui, non nella pagina.
// Ogni funzione «…In» lavora su un contesto (demo o impresa); le altre sono la demo, come prima.

export { Rifiuto };

export { listino, perCodice };

const mappa = (voci: VoceMotore[]) => new Map(voci.map((v) => [v.code, v]));

export async function creaDaTestoIn(ctx: Contesto, testo: string, call: ToolCaller): Promise<Preventivo> {
  const t = testo.trim();
  if (t.length < 30) throw new Rifiuto("Il testo del sopralluogo è troppo corto.", 400);
  if (t.length > 6000) throw new Rifiuto("Il testo del sopralluogo è troppo lungo (massimo 6000 caratteri).", 400);
  const voci = await ctx.voci();
  if (!voci.length) throw new Rifiuto("Il listino è vuoto: aggiungi o importa le tue voci prima di fare un preventivo.", 409);
  const draft = await elabora(t, { items: voci }, call, { impresa: ctx.descrizione });
  return ctx.crea({ ...daBozza(draft, mappa(voci)), origine: { tipo: "testo" } });
}

export async function creaDaTesto(testo: string, call: ToolCaller): Promise<Preventivo> {
  return creaDaTestoIn(demo, testo, call);
}

// Esempi del banco di prova: la bozza nasce dall'uscita registrata del motore su quel caso
// (misure/uscite/, l'ultima misura). Nessuna chiamata all'API: gli esempi sono gratis e immediati.
export function cartellaUscite(): string {
  const base = path.join(process.cwd(), "misure", "uscite");
  const ultima = readdirSync(base).filter((d) => /^\d{4}-\d{2}-\d{2}[a-z]?$/.test(d)).sort().at(-1);
  if (!ultima) throw new Rifiuto("Nessuna misura registrata.", 500);
  return path.join(base, ultima);
}

export async function creaDaEsempio(caso: string): Promise<Preventivo> {
  if (!/^\d{2}$/.test(caso)) throw new Rifiuto("Esempio inesistente.", 400);
  let draft: Draft;
  try {
    draft = JSON.parse(readFileSync(path.join(cartellaUscite(), `${caso}.json`), "utf8")) as Draft;
  } catch {
    throw new Rifiuto("Esempio inesistente.", 404);
  }
  return demo.crea({ ...daBozza(draft, perCodice()), origine: { tipo: "esempio", caso } });
}

// Il cliente ha aperto la pagina: lo segno una volta sola, per la timeline dell'artigiano.
export async function segnaVisto(token: string, adesso = new Date()): Promise<void> {
  const trovato = await perToken(token);
  if (!trovato) return;
  const { ctx, p } = trovato;
  if (p.stato !== "approvato" || p.vistoIl) return;
  await ctx.salva({ ...p, vistoIl: adesso.toISOString() }, { tipo: "visto" });
}

export async function aggiornaBozzaIn(ctx: Contesto, id: string, body: unknown): Promise<Preventivo> {
  const p = await ctx.leggi(id);
  if (!p) throw new Rifiuto("Preventivo non trovato.", 404);
  if (p.stato !== "bozza") throw new Rifiuto("Il preventivo è già approvato: non si modifica più.", 409);
  const parsed = ModificheBozza.safeParse(body);
  if (!parsed.success) throw new Rifiuto("Dati non validi.", 400);
  const byCode = mappa(await ctx.voci());
  // Un prezzo diverso da quello del listino è dell'artigiano: lo si registra come tale, mai in silenzio.
  const righe = parsed.data.righe.map((r) => {
    const item = r.code ? byCode.get(r.code) : undefined;
    if (r.code && !item) throw new Rifiuto("Codice di listino inesistente.", 400);
    const priceSource = r.unitPriceCents === null ? null : item && r.unitPriceCents === item.priceCents ? "listino" : "artigiano";
    return { ...r, priceSource, significantGood: item?.significantGood ?? false } as typeof r;
  });
  const next: Preventivo = { ...p, ...parsed.data, righe };
  await ctx.salva(next);
  return next;
}

export async function aggiornaBozza(id: string, body: unknown): Promise<Preventivo> {
  return aggiornaBozzaIn(demo, id, body);
}

export async function approvaIn(ctx: Contesto, id: string, adesso = new Date()): Promise<Preventivo> {
  const p = await ctx.leggi(id);
  if (!p) throw new Rifiuto("Preventivo non trovato.", 404);
  if (p.stato !== "bozza") throw new Rifiuto("Il preventivo è già approvato.", 409);
  const m = mancanze(p).map((x) => x.testo);
  const t = mancanzaTraduzione(p);
  if (t) m.push(t);
  if (m.length) throw new Rifiuto(`Prima di approvare: ${m.join("; ")}.`, 422);
  const next: Preventivo = { ...p, stato: "approvato", approvatoIl: adesso.toISOString(), tokenAccettazione: nuovoId() };
  await ctx.salva(next, { tipo: "approvato" });
  await imparaDalPreventivo(ctx, next);
  return next;
}

// Traduce le voci nella lingua del cliente. Solo in bozza: approvato, il documento non cambia più.
export async function traduciIn(ctx: Contesto, id: string, lingua: unknown, call: ToolCaller): Promise<Preventivo> {
  const p = await ctx.leggi(id);
  if (!p) throw new Rifiuto("Preventivo non trovato.", 404);
  if (p.stato !== "bozza") throw new Rifiuto("Il preventivo è già approvato: non si traduce più.", 409);
  const l = Lingua.safeParse(lingua);
  if (!l.success) throw new Rifiuto("Lingua non disponibile.", 400);
  if (l.data === "it") {
    const next: Preventivo = { ...p, lingua: "it", traduzione: null };
    await ctx.salva(next);
    return next;
  }
  const traduzione = await traduciVoci(p, l.data, call);
  const next: Preventivo = { ...p, lingua: l.data, traduzione };
  await ctx.salva(next);
  return next;
}

export async function approva(id: string, adesso = new Date()): Promise<Preventivo> {
  return approvaIn(demo, id, adesso);
}

export async function rispondiCliente(token: string, nome: string, esito: "accettato" | "rifiutato", adesso = new Date(), traccia: Record<string, unknown> = {}) {
  const trovato = await perToken(token);
  if (!trovato) throw new Rifiuto("Link non valido.", 404);
  const { ctx, p } = trovato;
  if (p.stato !== "approvato") throw new Rifiuto("Questo preventivo ha già una risposta.", 409);
  const azienda = await ctx.azienda();
  if (adesso.getTime() > new Date(p.approvatoIl!).getTime() + azienda.quoteValidityDays * 86_400_000) throw new Rifiuto("Il preventivo è scaduto.", 410);
  const n = nome.trim();
  if (n.length < 3 || n.length > 80) throw new Rifiuto("Scrivi nome e cognome.", 400);
  // Prova di cosa ha visto il cliente: l'impronta del PDF approvato, com'era prima della sua risposta.
  const impronta = ctx.tipo === "impresa" ? createHash("sha256").update(await generaPdf(p, azienda)).digest("hex") : undefined;
  const next: Preventivo = { ...p, stato: esito, accettazione: { nome: n, il: adesso.toISOString(), esito } };
  await ctx.salva(next, { tipo: esito, dati: { nome: n, lingua: linguaDi(p), ...traccia, ...(impronta ? { pdfSha256: impronta } : {}) } });
  return next;
}

// Listino che impara: le righe prezzate dall'artigiano e spuntate «aggiungi al listino» diventano proposte.
// Non entrano nel listino da sole: restano da confermare.
export async function imparaDalPreventivo(ctx: Contesto, p: Preventivo): Promise<void> {
  const nuove = p.righe.filter((r) => r.addToPriceList && r.priceSource === "artigiano" && r.unit && r.unitPriceCents !== null);
  if (!nuove.length) return;
  await ctx.impara(p, nuove);
}
