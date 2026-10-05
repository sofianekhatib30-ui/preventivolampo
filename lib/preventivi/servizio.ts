import { readFileSync } from "node:fs";
import path from "node:path";
import { PriceList, type PriceListItem } from "@/lib/listino/schema";
import { elabora } from "@/lib/motore";
import type { ToolCaller } from "@/lib/motore/claude";
import { leggi, leggiPerToken, salva, salvaProposte } from "./archivio";
import { mancanze } from "./calcolo";
import { daBozza, nuovoId } from "./da-bozza";
import { ModificheBozza, type Preventivo } from "./modello";

// Le operazioni sul preventivo. Ogni passaggio di stato si controlla qui, non nella pagina.

export class Rifiuto extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

let cache: PriceList | null = null;
export function listino(): PriceList {
  cache ??= PriceList.parse(JSON.parse(readFileSync(path.join(process.cwd(), "dati", "listino.json"), "utf8")));
  return cache;
}
export function perCodice(): Map<string, PriceListItem> {
  return new Map(listino().items.map((i) => [i.code, i]));
}

export async function creaDaTesto(testo: string, call: ToolCaller): Promise<Preventivo> {
  const t = testo.trim();
  if (t.length < 30) throw new Rifiuto("Il testo del sopralluogo è troppo corto.", 400);
  if (t.length > 6000) throw new Rifiuto("Il testo del sopralluogo è troppo lungo (massimo 6000 caratteri).", 400);
  const draft = await elabora(t, listino(), call);
  const p = daBozza(draft, perCodice());
  await salva(p);
  return p;
}

export async function aggiornaBozza(id: string, body: unknown): Promise<Preventivo> {
  const p = await leggi(id);
  if (!p) throw new Rifiuto("Preventivo non trovato.", 404);
  if (p.stato !== "bozza") throw new Rifiuto("Il preventivo è già approvato: non si modifica più.", 409);
  const parsed = ModificheBozza.safeParse(body);
  if (!parsed.success) throw new Rifiuto("Dati non validi.", 400);
  const byCode = perCodice();
  // Un prezzo diverso da quello del listino è dell'artigiano: lo si registra come tale, mai in silenzio.
  const righe = parsed.data.righe.map((r) => {
    const item = r.code ? byCode.get(r.code) : undefined;
    if (r.code && !item) throw new Rifiuto("Codice di listino inesistente.", 400);
    const priceSource = r.unitPriceCents === null ? null : item && r.unitPriceCents === item.priceCents ? "listino" : "artigiano";
    return { ...r, priceSource, significantGood: item?.significantGood ?? false } as typeof r;
  });
  const next: Preventivo = { ...p, ...parsed.data, righe };
  await salva(next);
  return next;
}

export async function approva(id: string, adesso = new Date()): Promise<Preventivo> {
  const p = await leggi(id);
  if (!p) throw new Rifiuto("Preventivo non trovato.", 404);
  if (p.stato !== "bozza") throw new Rifiuto("Il preventivo è già approvato.", 409);
  const m = mancanze(p);
  if (m.length) throw new Rifiuto(`Prima di approvare: ${m.map((x) => x.testo).join("; ")}.`, 422);
  const next: Preventivo = { ...p, stato: "approvato", approvatoIl: adesso.toISOString(), tokenAccettazione: nuovoId() };
  await salva(next);
  await imparaDalPreventivo(next);
  return next;
}

export async function rispondiCliente(token: string, nome: string, esito: "accettato" | "rifiutato", adesso = new Date()) {
  const p = await leggiPerToken(token);
  if (!p) throw new Rifiuto("Link non valido.", 404);
  if (p.stato !== "approvato") throw new Rifiuto("Questo preventivo ha già una risposta.", 409);
  const giorni = listino().company.quoteValidityDays;
  if (adesso.getTime() > new Date(p.approvatoIl!).getTime() + giorni * 86_400_000) throw new Rifiuto("Il preventivo è scaduto.", 410);
  const n = nome.trim();
  if (n.length < 3 || n.length > 80) throw new Rifiuto("Scrivi nome e cognome.", 400);
  const next: Preventivo = { ...p, stato: esito, accettazione: { nome: n, il: adesso.toISOString(), esito } };
  await salva(next);
  return next;
}

// Listino che impara: le righe prezzate dall'artigiano e spuntate «aggiungi al listino» diventano proposte.
// Non entrano nel listino da sole: restano da confermare.
export async function imparaDalPreventivo(p: Preventivo): Promise<void> {
  const nuove = p.righe.filter((r) => r.addToPriceList && r.priceSource === "artigiano" && r.unit && r.unitPriceCents !== null);
  if (!nuove.length) return;
  await salvaProposte(
    p.numero,
    nuove.map((r) => ({ nome: r.work, unita: r.unit, prezzoCents: r.unitPriceCents, daPreventivo: p.numero, il: p.approvatoIl })),
  );
}
