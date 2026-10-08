import { z } from "zod";
import { CODICE, UNITS } from "@/lib/listino/schema";
import type { Blocco, ToolCaller, ToolSpec } from "@/lib/motore/claude";
import { Rifiuto } from "@/lib/preventivi/rifiuto";
import { db, ok } from "./db";
import { DatiVoce } from "./schema";
import { inserisciVoci, MAX_VOCI } from "./voci";

// Import del listino da Excel o CSV: leggo la tabella, capisco le colonne (regole, poi Claude
// se le regole non bastano), normalizzo unità e prezzi, e ogni riga dubbia resta da controllare.
// Da PDF, foto o vecchi preventivi: Claude trascrive le voci in una tabella, che poi segue la
// stessa strada. Nulla entra nel listino finché l'artigiano non conferma.

export const MAX_BYTES = 5 * 1024 * 1024;
export const CAMPI = ["codice", "nome", "descrizione", "unita", "prezzo", "categoria"] as const;
export type Campo = (typeof CAMPI)[number];
export type Mappatura = Partial<Record<Campo, number>>;
export type Cella = string | number | boolean | null;

export type RigaImport = {
  n: number; // riga nel file (1 = prima riga)
  includi: boolean;
  codice: string;
  nome: string;
  descrizione: string | null;
  unita: string | null; // una delle UNITS, oppure null se non riconosciuta
  unitaLetta: string;
  prezzo_cents: number | null;
  categoria: string | null;
  problemi: string[];
};

// --- Lettura del file -------------------------------------------------------------------------

export function leggiCsv(testo: string): Cella[][] {
  const pulito = testo.replace(/^﻿/, "");
  const prima = pulito.split(/\r?\n/, 1)[0] ?? "";
  const conta = (c: string) => prima.split(c).length - 1;
  const sep = [";", "\t", ","].sort((a, b) => conta(b) - conta(a))[0];
  const righe: string[][] = [];
  let riga: string[] = [];
  let campo = "";
  let virgolette = false;
  for (let i = 0; i < pulito.length; i++) {
    const c = pulito[i];
    if (virgolette) {
      if (c === '"' && pulito[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') virgolette = false;
      else campo += c;
    } else if (c === '"' && campo === "") virgolette = true;
    else if (c === sep) {
      riga.push(campo);
      campo = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && pulito[i + 1] === "\n") i++;
      riga.push(campo);
      righe.push(riga);
      riga = [];
      campo = "";
    } else campo += c;
  }
  if (campo !== "" || riga.length) {
    riga.push(campo);
    righe.push(riga);
  }
  return righe.map((r) => r.map((x) => (x.trim() === "" ? null : x.trim())));
}

function decodifica(bytes: Uint8Array): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return new TextDecoder("windows-1252").decode(bytes); // CSV salvati da Excel italiano
  }
}

const isXlsx = (b: Uint8Array) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04;
const isXls = (b: Uint8Array) => b[0] === 0xd0 && b[1] === 0xcf && b[2] === 0x11 && b[3] === 0xe0;

export async function leggiTabella(bytes: Uint8Array): Promise<Cella[][]> {
  if (bytes.length > MAX_BYTES) throw new Rifiuto("Il file è troppo grande (massimo 5 MB).", 400);
  if (isXls(bytes)) throw new Rifiuto("È un file Excel vecchio (.xls): aprilo in Excel e salvalo come .xlsx o .csv.", 400);
  if (isXlsx(bytes)) {
    const { default: leggi, readSheetNames } = await import("read-excel-file/node");
    const buf = Buffer.from(bytes);
    const fogli = await readSheetNames(buf);
    let migliore: (Cella | Date)[][] = [];
    for (const foglio of fogli.slice(0, 10)) {
      const righe = (await leggi(buf, { sheet: foglio })) as unknown as (Cella | Date)[][];
      const piene = righe.filter((r) => r.filter((c) => c !== null && c !== "").length >= 2);
      if (piene.length > migliore.length) migliore = piene;
    }
    return migliore.map((r) => r.map((c) => (c instanceof Date ? c.toISOString().slice(0, 10) : typeof c === "string" ? c.trim() || null : c)));
  }
  if (bytes.includes(0)) throw new Rifiuto("Formato non riconosciuto: carica un file .xlsx o .csv.", 400);
  return leggiCsv(decodifica(bytes)).filter((r) => r.some((c) => c !== null));
}

// --- Colonne -------------------------------------------------------------------------------------

const testoCella = (c: Cella | undefined) => (c === null || c === undefined ? "" : String(c).trim());
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9€.² ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const INTESTAZIONI: [Campo, RegExp][] = [
  ["prezzo", /prezz|importo|€|euro|costo|tariff|valore unit|p\.? ?u/],
  ["unita", /^u\.? ?m\.?$|unita|misura|^um$|^u\.?$/],
  ["codice", /codic|^cod\b|^art\b|articolo n|riferim|^rif|^id$|^n\.? ?voce|^voce n|^n\.?$|^nr\.?$|^num/],
  ["categoria", /categor|capitol|sezion|grupp|famigl|tipolog|reparto/],
  ["descrizione", /descriz|dettagl|specific|note/],
  ["nome", /lavoraz|denomin|voce|articolo|nome|prodott|servizio|intervent|opera/],
];

// La riga d'intestazione: fra le prime 15, quella con più celle di testo che sembrano titoli di colonna.
export function trovaIntestazione(t: Cella[][]): number {
  let migliore = 0;
  let punti = -1;
  t.slice(0, 15).forEach((r, i) => {
    const celle = r.map(testoCella).filter(Boolean);
    const titoli = celle.filter((c) => INTESTAZIONI.some(([, re]) => re.test(norm(c)))).length;
    const testi = r.filter((c) => typeof c === "string" && !/^[\d.,€\s]+$/.test(c)).length;
    const p = titoli * 3 + testi;
    if (titoli > 0 && p > punti) {
      punti = p;
      migliore = i;
    }
  });
  return migliore;
}

export function mappaConRegole(intestazione: Cella[]): Mappatura {
  const m: Mappatura = {};
  const usate = new Set<number>();
  for (const [campo, re] of INTESTAZIONI) {
    const i = intestazione.findIndex((c, j) => !usate.has(j) && re.test(norm(testoCella(c))));
    if (i >= 0) {
      m[campo] = i;
      usate.add(i);
    }
  }
  // Solo una colonna di testo lungo: è il nome della voce.
  if (m.nome === undefined && m.descrizione !== undefined) {
    m.nome = m.descrizione;
    delete m.descrizione;
  }
  return m;
}

const MAPPA_TOOL = {
  name: "mappa_colonne",
  description: "Dice quale colonna del file contiene ogni dato del listino.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["riga_intestazione", "codice", "nome", "descrizione", "unita", "prezzo", "categoria"],
    properties: {
      riga_intestazione: { type: "integer", description: "Indice (da 0) della riga con i titoli delle colonne, -1 se non c'è" },
      codice: { type: ["integer", "null"] },
      nome: { type: ["integer", "null"] },
      descrizione: { type: ["integer", "null"] },
      unita: { type: ["integer", "null"] },
      prezzo: { type: ["integer", "null"] },
      categoria: { type: ["integer", "null"] },
    },
  },
};

const MAPPA_SYSTEM = `Ricevi le prime righe di un listino prezzi di un'impresa edile italiana (da Excel o CSV), una riga per linea, celle separate da « | » e numerate da 0.
Indica per ogni dato l'indice della colonna che lo contiene, oppure null:
- codice: codice o numero della voce (es. A.01, 12, BAG-03)
- nome: la descrizione breve della lavorazione o del prodotto (obbligatoria)
- descrizione: una seconda colonna con testo più lungo, se c'è
- unita: unità di misura (mq, ml, cad, h, kg, a corpo…)
- prezzo: prezzo unitario in euro, IVA esclusa se ci sono più colonne di prezzo
- categoria: capitolo o gruppo della voce
Non inventare: se un dato non c'è, null.`;

const UscitaMappa = z.strictObject({
  riga_intestazione: z.number().int().min(-1),
  codice: z.number().int().nonnegative().nullable(),
  nome: z.number().int().nonnegative().nullable(),
  descrizione: z.number().int().nonnegative().nullable(),
  unita: z.number().int().nonnegative().nullable(),
  prezzo: z.number().int().nonnegative().nullable(),
  categoria: z.number().int().nonnegative().nullable(),
});

export async function mappaConClaude(t: Cella[][], call: ToolCaller): Promise<{ intestazione: number; mappa: Mappatura } | null> {
  const campione = t
    .slice(0, 14)
    .map((r, i) => `${i}: ${r.map((c, j) => `[${j}] ${testoCella(c).slice(0, 80)}`).join(" | ")}`)
    .join("\n");
  const r = await call({ system: MAPPA_SYSTEM, user: campione, tool: MAPPA_TOOL, maxTokens: 400 });
  const u = UscitaMappa.safeParse(r.input);
  if (!u.success) return null;
  const larghezza = Math.max(...t.slice(0, 14).map((x) => x.length));
  const mappa: Mappatura = {};
  for (const campo of CAMPI) {
    const v = u.data[campo];
    if (v !== null && v < larghezza) mappa[campo] = v;
  }
  return { intestazione: Math.min(Math.max(u.data.riga_intestazione, -1), 14), mappa };
}

// --- Valori --------------------------------------------------------------------------------------

const UNITA_DETTE: [RegExp, (typeof UNITS)[number]][] = [
  [/^(m2|mq|m²|mtq|metr[oi] quadr[oi]|mq\.)$/, "m2"],
  [/^(m3|mc|m³|metr[oi] cub[oi])$/, "m3"],
  [/^(m|ml|mt|mtl|metr[oi]|metr[oi] linear[ei]|m\.l\.|m l)$/, "m"],
  [/^(cad|cad\.|cadaun[oa]|n|n\.|nr|nr\.|num|numero|pz|pz\.|pezz[oi]|un|unita|cd)$/, "cad"],
  [/^(h|ora|ore|hh|h\.)$/, "h"],
  [/^(q|ql|q\.li|qli|quintal[ei]|100 ?kg)$/, "100kg"],
  [/^(kg|chil[oi]|chilogramm[oi])$/, "kg"],
  [/^(l|lt|litr[oi])$/, "l"],
  [/^(a corpo|corpo|ac|a\.c\.|forfait|forfettario|a forfait)$/, "corpo"],
];

export function unitaDa(s: string): (typeof UNITS)[number] | null {
  const n = norm(s).replace(/\s*\.$/, "");
  if (!n) return null;
  // Come la scrive chi prezza a mano: «al metro», «€/ora», «euro al mq», «per pezzo».
  const senzaPrefisso = n.replace(/^(€|euro)\s*/, "").replace(/^(al|alla|allo|all|per|x)\s+/, "");
  for (const candidato of [n, senzaPrefisso]) for (const [re, u] of UNITA_DETTE) if (re.test(candidato)) return u;
  return null;
}

export function prezzoDa(c: Cella | undefined): number | null {
  if (typeof c === "number") return Number.isFinite(c) && c >= 0 ? Math.round(c * 100) : null;
  let s = testoCella(c).replace(/€|eur(o)?/gi, "").replace(/\s/g, "");
  if (!s) return null;
  if (s.includes(",") && s.includes(".")) s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  else if (s.includes(",")) s = s.replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  if (!/^\d+(\.\d+)?$/.test(s)) return null;
  const v = Math.round(Number(s) * 100);
  return v <= 100_000_000 ? v : null;
}

export function costruisciRighe(t: Cella[][], intestazione: number, m: Mappatura): RigaImport[] {
  const out: RigaImport[] = [];
  const usati = new Set<string>();
  let progressivo = 0;
  const nuovoCodice = () => {
    let c: string;
    do c = `V-${String(++progressivo).padStart(4, "0")}`;
    while (usati.has(c));
    return c;
  };
  for (let i = intestazione + 1; i < t.length && out.length < MAX_VOCI; i++) {
    const r = t[i];
    const get = (campo: Campo) => (m[campo] === undefined ? "" : testoCella(r[m[campo]!]));
    const nome = get("nome").replace(/\s+/g, " ");
    const prezzoCella = m.prezzo === undefined ? undefined : r[m.prezzo];
    // Righe di titolo o di capitolo (testo senza prezzo né unità) non sono voci.
    const senzaPrezzo = prezzoCella === null || prezzoCella === undefined || testoCella(prezzoCella) === "";
    if (!nome || (senzaPrezzo && !get("unita"))) continue;
    const problemi: string[] = [];
    const unitaLetta = get("unita");
    const unita = unitaDa(unitaLetta);
    if (!unita) problemi.push(unitaLetta ? `unità «${unitaLetta}» non riconosciuta` : "manca l'unità");
    const prezzo = prezzoDa(prezzoCella);
    if (prezzo === null) problemi.push("prezzo non leggibile");
    let codice = get("codice").replace(/\s+/g, "");
    if (codice && !CODICE.test(codice)) {
      problemi.push(`codice «${codice.slice(0, 30)}» sostituito`);
      codice = "";
    }
    if (codice && usati.has(codice)) {
      problemi.push(`codice ${codice} ripetuto: sostituito`);
      codice = "";
    }
    if (!codice) codice = nuovoCodice();
    usati.add(codice);
    out.push({
      n: i + 1,
      includi: true,
      codice,
      nome: nome.slice(0, 200),
      descrizione: get("descrizione").slice(0, 600) || null,
      unita,
      unitaLetta: unitaLetta.slice(0, 30),
      prezzo_cents: prezzo,
      categoria: get("categoria").slice(0, 60) || null,
      problemi,
    });
  }
  return out;
}

// --- PDF e foto: lettura con l'AI ------------------------------------------------------------------

// Vercel accetta richieste fino a 4,5 MB: le foto le rimpicciolisce il browser prima di mandarle.
export const MAX_BYTES_AI = 4_300_000;
export const MAX_FILE_AI = 10;

export type FileCaricato = { nome: string; bytes: Uint8Array };
type Tipo = "foglio" | "application/pdf" | "image/png" | "image/jpeg" | "image/webp";

export function tipoFile(b: Uint8Array): Tipo | null {
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return "application/pdf";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  if (isXlsx(b) || isXls(b) || !b.includes(0)) return "foglio";
  return null;
}

export const LETTURA_TOOL: ToolSpec = {
  name: "trascrivi_listino",
  description: "Trascrive le voci di prezzo che compaiono nelle pagine: listino, foglio scritto a mano o vecchi preventivi.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["voci"],
    properties: {
      voci: {
        type: "array",
        description: "Una voce per riga: [codice, voce, unità, prezzo, nota]",
        items: { type: "array", items: { type: "string" } },
      },
    },
  },
};

export const LETTURA_SYSTEM = `Leggi le pagine che ti manda un artigiano edile (listino, foglio scritto a mano, foto, PDF o vecchi preventivi) e trascrivi le sue voci di prezzo, per caricarle nel suo listino.

Per ogni voce scrivi un array di 5 stringhe: [codice, voce, unità, prezzo, nota].
- codice: il codice o numero della voce se c'è, altrimenti "".
- voce: la lavorazione o il materiale, come è scritto, in breve (massimo 120 caratteri).
- unità: come è scritta (mq, ml, cad, h, a corpo…); "" se non c'è.
- prezzo: il prezzo unitario come è scritto (es. "18,50"), senza simbolo di valuta; "" se non si legge.
- nota: "" se è tutto chiaro; altrimenti una frase breve su un dubbio vero (es. "prezzo poco leggibile", "prezzo calcolato: totale diviso quantità", "trovata due volte con prezzi diversi: 40 e 45"). Non scrivere note per spiegare come è scritta l'unità o per dire che manca: a quello pensa il programma.

Regole:
- Trascrivi solo quello che c'è scritto: non inventare voci né prezzi. Un prezzo che non leggi resta "".
- Dai vecchi preventivi prendi il prezzo unitario. Se c'è solo il totale della riga e la quantità, calcola il prezzo unitario; se la quantità è diversa da 1, dillo nella nota. La stessa voce in più preventivi va una volta sola, con l'ultimo prezzo e gli altri nella nota.
- Salta titoli, capitoli, totali, IVA, sconti, condizioni di pagamento e intestazioni.
- Non trascrivere mai nomi, indirizzi o dati dei clienti.`;

const Lettura = z.object({ voci: z.array(z.array(z.string()).min(2).max(6)).max(MAX_VOCI) });

export async function leggiConAI(file: FileCaricato[], call: ToolCaller): Promise<{ tabella: Cella[][]; note: Map<number, string> }> {
  const blocchi: Blocco[] = [];
  for (const f of file) {
    const tipo = tipoFile(f.bytes);
    const data = Buffer.from(f.bytes).toString("base64");
    if (tipo === "application/pdf") blocchi.push({ type: "document", source: { type: "base64", media_type: tipo, data } });
    else if (tipo === "image/png" || tipo === "image/jpeg" || tipo === "image/webp") blocchi.push({ type: "image", source: { type: "base64", media_type: tipo, data } });
    else throw new Rifiuto(`«${f.nome.slice(0, 60)}» non è un PDF né una foto.`, 400);
  }
  blocchi.push({ type: "text", text: `Trascrivi le voci di prezzo di ${file.length === 1 ? "questo file" : `questi ${file.length} file`}.` });
  let uscita: unknown;
  try {
    uscita = (await call({ system: LETTURA_SYSTEM, user: blocchi, tool: LETTURA_TOOL, maxTokens: 16000 })).input;
  } catch (e) {
    const troppo = e instanceof Error && /troncata/.test(e.message);
    throw new Rifiuto(
      troppo
        ? "Il listino è troppo lungo per leggerlo tutto in una volta: caricalo in più parti, o usa l'Excel se ce l'hai."
        : "Non sono riuscito a leggere il file. Riprova, o con una foto più nitida.",
      troppo ? 422 : 502,
    );
  }
  const p = Lettura.safeParse(uscita);
  if (!p.success) throw new Rifiuto("Non sono riuscito a leggere il file. Riprova, o con una foto più nitida.", 502);
  const tabella: Cella[][] = [["Codice", "Voce", "Unità", "Prezzo"]];
  const note = new Map<number, string>();
  for (const v of p.data.voci) {
    const [codice = "", voce = "", unita = "", prezzo = "", nota = ""] = v.map((x) => x.trim());
    if (!voce) continue;
    tabella.push([codice || null, voce, unita || null, prezzo || null]);
    if (nota) note.set(tabella.length, nota.slice(0, 160)); // n della riga = posizione nella tabella (1 = intestazione)
  }
  return { tabella, note };
}

// --- Flusso completo -----------------------------------------------------------------------------

export async function preparaImport(impresaId: string, file: FileCaricato | FileCaricato[], call: ToolCaller | null) {
  const elenco = Array.isArray(file) ? file : [file];
  if (!elenco.length) throw new Rifiuto("Scegli il file del listino.", 400);
  const fogli = elenco.filter((f) => tipoFile(f.bytes) === "foglio");
  let t: Cella[][];
  let intestazione: number;
  let mappa: Mappatura;
  let metodo: "regole" | "claude" | "lettura AI" = "regole";
  let note = new Map<number, string>();
  if (fogli.length) {
    if (elenco.length > 1) throw new Rifiuto("Un file Excel o CSV va caricato da solo.", 400);
    t = await leggiTabella(elenco[0].bytes);
    if (t.length < 2) throw new Rifiuto("Il file non ha righe da importare.", 400);
    intestazione = trovaIntestazione(t);
    mappa = mappaConRegole(t[intestazione] ?? []);
    if ((mappa.nome === undefined || mappa.prezzo === undefined || mappa.unita === undefined) && call) {
      const c = await mappaConClaude(t, call).catch(() => null);
      if (c && c.mappa.nome !== undefined && c.mappa.prezzo !== undefined) {
        intestazione = c.intestazione;
        mappa = c.mappa;
        metodo = "claude";
      }
    }
    if (mappa.nome === undefined || mappa.prezzo === undefined) {
      throw new Rifiuto("Non trovo le colonne della descrizione e del prezzo. Controlla che il file abbia i titoli delle colonne.", 422);
    }
  } else {
    if (!call) throw new Rifiuto("La lettura di PDF e foto non è disponibile in questo momento: carica un Excel o un CSV.", 503);
    if (elenco.length > MAX_FILE_AI) throw new Rifiuto(`Al massimo ${MAX_FILE_AI} file per volta.`, 400);
    if (elenco.reduce((a, f) => a + f.bytes.length, 0) > MAX_BYTES_AI) throw new Rifiuto("I file sono troppo pesanti insieme (massimo 4 MB): caricali in più volte.", 400);
    const letto = await leggiConAI(elenco, call);
    t = letto.tabella;
    note = letto.note;
    intestazione = 0;
    mappa = { codice: 0, nome: 1, unita: 2, prezzo: 3 };
    metodo = "lettura AI";
    if (t.length < 2) throw new Rifiuto("Non ho trovato voci con un prezzo nel file. Prova con una foto più nitida o più vicina.", 422);
  }
  const righe = costruisciRighe(t, intestazione, mappa).map((r) => (note.has(r.n) ? { ...r, problemi: [...r.problemi, note.get(r.n)!] } : r));
  if (!righe.length) throw new Rifiuto("Non trovo voci con descrizione e prezzo nel file.", 422);
  // La tabella letta resta con l'import: se l'artigiano cambia le colonne, le righe si rifanno da qui.
  const tabella = t.slice(0, MAX_VOCI + 20).map((r) => r.slice(0, 20).map((c) => (typeof c === "string" ? c.slice(0, 600) : c)));
  const nomeFile = elenco.length === 1 ? elenco[0].nome : `${elenco.length} file (${elenco[0].nome}…)`;
  const r = ok(
    await db()
      .from("pl_import")
      .insert({ impresa_id: impresaId, nome_file: nomeFile.slice(0, 120), mappatura: { mappa, intestazione, metodo, tabella }, righe })
      .select("id")
      .single(),
    "salva import",
  ) as { id: string };
  return { id: r.id, righe: righe.length, daControllare: righe.filter((x) => x.problemi.length).length };
}

export type Import = {
  id: string;
  nome_file: string | null;
  mappatura: { mappa: Mappatura; intestazione: number; metodo: string; tabella: Cella[][] };
  righe: RigaImport[];
  stato: "da_rivedere" | "importato" | "annullato";
  creato_il: string;
};

export async function leggiImport(impresaId: string, id: string): Promise<Import | null> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return null;
  return ok(
    await db().from("pl_import").select("id, nome_file, mappatura, righe, stato, creato_il").eq("impresa_id", impresaId).eq("id", id).maybeSingle(),
    "import",
  ) as Import | null;
}

// Le intestazioni e le prime righe del file, per far scegliere le colonne a mano.
export function anteprima(imp: Import): { colonne: string[]; esempi: string[][] } {
  const t = imp.mappatura.tabella;
  const larghezza = Math.min(20, Math.max(0, ...t.slice(0, 30).map((r) => r.length)));
  const testa = imp.mappatura.intestazione >= 0 ? (t[imp.mappatura.intestazione] ?? []) : [];
  const colonne = Array.from({ length: larghezza }, (_, i) => testoCella(testa[i]) || `Colonna ${i + 1}`);
  const esempi = t.slice(imp.mappatura.intestazione + 1, imp.mappatura.intestazione + 4).map((r) => colonne.map((_, i) => testoCella(r[i]).slice(0, 60)));
  return { colonne, esempi };
}

const NuovaMappa = z.strictObject(Object.fromEntries(CAMPI.map((c) => [c, z.number().int().min(0).max(19).nullable()])) as Record<Campo, z.ZodNullable<z.ZodNumber>>);

export async function rimappa(impresaId: string, id: string, dato: unknown): Promise<void> {
  const imp = await leggiImport(impresaId, id);
  if (!imp || imp.stato !== "da_rivedere") throw new Rifiuto("Import non trovato o già fatto.", 404);
  const parsed = NuovaMappa.safeParse(dato);
  if (!parsed.success) throw new Rifiuto("Colonne non valide.", 400);
  const mappa: Mappatura = {};
  for (const c of CAMPI) if (parsed.data[c] !== null) mappa[c] = parsed.data[c]!;
  if (mappa.nome === undefined || mappa.prezzo === undefined) throw new Rifiuto("Scegli almeno la colonna della descrizione e quella del prezzo.", 400);
  const righe = costruisciRighe(imp.mappatura.tabella, imp.mappatura.intestazione, mappa);
  ok(
    await db()
      .from("pl_import")
      .update({ mappatura: { ...imp.mappatura, mappa, metodo: "a mano" }, righe })
      .eq("impresa_id", impresaId)
      .eq("id", id),
    "rimappa",
  );
}

const Modifica = z.strictObject({
  n: z.number().int().positive(),
  includi: z.boolean(),
  codice: z.string().max(40),
  nome: z.string().max(200),
  unita: z.enum(UNITS).nullable(),
  prezzo_cents: z.number().int().min(0).max(100_000_000).nullable(),
});

// Conferma: si importano le righe spuntate; ognuna deve avere unità e prezzo validi.
export async function confermaImport(impresaId: string, id: string, modifiche: unknown) {
  const imp = await leggiImport(impresaId, id);
  if (!imp || imp.stato !== "da_rivedere") throw new Rifiuto("Import non trovato o già fatto.", 404);
  const parsed = z.array(Modifica).max(MAX_VOCI).safeParse(modifiche);
  if (!parsed.success) throw new Rifiuto("Dati non validi.", 400);
  const perRiga = new Map(parsed.data.map((m) => [m.n, m]));
  const voci: DatiVoce[] = [];
  const codici = new Set<string>();
  for (const r of imp.righe) {
    const m = perRiga.get(r.n);
    const riga = m ? { ...r, ...m } : r;
    if (!riga.includi) continue;
    const v = DatiVoce.safeParse({
      codice: riga.codice.trim(),
      nome: riga.nome.trim(),
      descrizione: r.descrizione,
      unita: riga.unita,
      prezzo_cents: riga.prezzo_cents,
      categoria: r.categoria,
      sinonimi: [],
      bene_significativo: false,
      fornibile_dal_cliente: false,
    });
    if (!v.success) throw new Rifiuto(`Riga ${r.n} del file («${riga.nome.slice(0, 40)}»): controlla codice, unità e prezzo, oppure togli la spunta.`, 422);
    if (codici.has(v.data.codice)) throw new Rifiuto(`Il codice ${v.data.codice} compare due volte.`, 422);
    codici.add(v.data.codice);
    voci.push(v.data);
  }
  if (!voci.length) throw new Rifiuto("Nessuna riga spuntata da importare.", 400);
  const esito = await inserisciVoci(impresaId, voci, "import");
  ok(await db().from("pl_import").update({ stato: "importato" }).eq("impresa_id", impresaId).eq("id", id), "chiudi import");
  return esito;
}

export async function annullaImport(impresaId: string, id: string): Promise<void> {
  ok(await db().from("pl_import").update({ stato: "annullato" }).eq("impresa_id", impresaId).eq("id", id).eq("stato", "da_rivedere"), "annulla import");
}
