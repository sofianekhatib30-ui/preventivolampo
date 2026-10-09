// Genera i dizionari delle altre lingue (lib/i18n/<lingua>.json) da quello italiano (lib/i18n/it.ts).
// Incrementale: traduce solo i testi nuovi o cambiati rispetto all'ultima volta (lib/i18n/sorgenti/<lingua>.json
// tiene il testo italiano da cui è nata ogni traduzione). Controlla che segnaposto, link e grassetti restino
// identici e che non compaia la lineetta lunga; i testi che non passano si ritraducono, poi lo script si ferma.
//
// Uso: npx tsx scripts/traduci-dizionario.ts [lingua…]   (serve ANTHROPIC_API_KEY)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { it } from "@/lib/i18n/it";
import { INFO_LINGUA, LINGUE_SITO, type LinguaSito } from "@/lib/i18n/lingue";
import { anthropicCaller } from "@/lib/motore/claude";

type Foglia = { chiave: string; testo: string };
type Albero = string | Albero[] | { [k: string]: Albero };

// Chiavi che non si traducono: tipi di blocco delle pagine legali.
const FISSE = new Set(["t"]);

function foglie(nodo: Albero, via: string[] = [], out: Foglia[] = []): Foglia[] {
  if (typeof nodo === "string") {
    if (!FISSE.has(via[via.length - 1])) out.push({ chiave: via.join("."), testo: nodo });
  } else if (Array.isArray(nodo)) nodo.forEach((n, i) => foglie(n, [...via, String(i)], out));
  else for (const [k, v] of Object.entries(nodo)) foglie(v, [...via, k], out);
  return out;
}

function ricostruisci(nodo: Albero, tradotte: Map<string, string>, via: string[] = []): Albero {
  if (typeof nodo === "string") return FISSE.has(via[via.length - 1]) ? nodo : (tradotte.get(via.join(".")) ?? nodo);
  if (Array.isArray(nodo)) return nodo.map((n, i) => ricostruisci(n, tradotte, [...via, String(i)]));
  return Object.fromEntries(Object.entries(nodo).map(([k, v]) => [k, ricostruisci(v, tradotte, [...via, k])]));
}

// Quello che deve restare identico: segnaposto, indirizzi dei link, numero di grassetti e di link.
export function impronta(s: string): string {
  const segnaposto = [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  const link = [...s.matchAll(/\]\(([^)\s]+)\)/g)].map((m) => m[1]).sort();
  const grassetti = (s.match(/\*\*/g) ?? []).length;
  return JSON.stringify({ segnaposto, link, grassetti });
}

const NOMI: Record<LinguaSito, string> = {
  it: "italiano",
  en: "inglese (britannico)",
  ro: "rumeno",
  sq: "albanese",
  ar: "arabo standard moderno, semplice e chiaro, comprensibile in Marocco, Egitto e Tunisia; cifre occidentali (0-9)",
  uk: "ucraino",
  es: "spagnolo (di Spagna)",
  fr: "francese",
  de: "tedesco",
  nl: "olandese",
};

function istruzioni(lingua: LinguaSito): string {
  return `Traduci in ${NOMI[lingua]} i testi dell'interfaccia di PreventivoLampo, un servizio italiano che aiuta gli artigiani della casa (elettricisti, idraulici, imbianchini, muratori…) a fare i preventivi: raccontano il sopralluogo e ricevono la bozza con i prezzi del loro listino. Chi legge è un artigiano che lavora in Italia, spesso di origine straniera, oppure il suo cliente.

Regole:
- Tono diretto, semplice, da persona a persona, dando del tu (nelle lingue dove il tu è normale con un artigiano; in tedesco, francese, olandese e spagnolo usa il registro informale «du / tu / jij / tú»). Frasi brevi, parole comuni.
- Restano identici: i segnaposto tra graffe come {n} o {email}; gli indirizzi dentro i link [testo](indirizzo), dove traduci solo il testo; i segni ** del grassetto; nomi propri e marchi (PreventivoLampo, K Digital Solution, WhatsApp, Excel, Word, PDF, IVA dove indica l'imposta italiana, Supabase, Vercel, Anthropic, Claude, Twilio, Meta, n8n, Resend); gli indirizzi email; le misure e i numeri.
- Le citazioni tra «…» sono frasi che un artigiano dice in cantiere: rendile come le direbbe un artigiano in quella lingua, con lo stesso contenuto (misure comprese).
- I termini fiscali e legali italiani senza equivalente («beni significativi», «Garante per la protezione dei dati personali», «foro di Monza», «DM 29/12/1999») restano in italiano, eventualmente con una breve spiegazione tra parentesi la prima volta.
- Mai la lineetta lunga (—): usa virgole, due punti o parentesi.
- Ogni testo ha una chiave: restituisci una traduzione per ogni chiave, senza saltarne e senza aggiungerne.`;
}

const TOOL = {
  name: "registra_traduzioni",
  description: "Registra le traduzioni, una per chiave.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["traduzioni"],
    properties: {
      traduzioni: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["chiave", "testo"],
          properties: { chiave: { type: "string" }, testo: { type: "string" } },
        },
      },
    },
  },
};

async function traduciBlocco(lingua: LinguaSito, blocco: Foglia[]): Promise<Map<string, string>> {
  const call = anthropicCaller();
  const user = JSON.stringify(blocco.map((f) => ({ chiave: f.chiave, testo: f.testo })), null, 1);
  const r = await call({ system: istruzioni(lingua), user, tool: TOOL as never, maxTokens: 16000 });
  const out = new Map<string, string>();
  for (const t of (r.input as { traduzioni?: { chiave: string; testo: string }[] }).traduzioni ?? []) out.set(t.chiave, t.testo.trim());
  return out;
}

function valida(f: Foglia, t: string | undefined): boolean {
  return typeof t === "string" && t.length > 0 && !t.includes("—") && impronta(t) === impronta(f.testo);
}

async function traduciLingua(lingua: LinguaSito): Promise<void> {
  const file = `lib/i18n/${lingua}.json`;
  const fileSorgenti = `lib/i18n/sorgenti/${lingua}.json`;
  const precedente: Albero = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
  const sorgenti: Record<string, string> = existsSync(fileSorgenti) ? JSON.parse(readFileSync(fileSorgenti, "utf8")) : {};
  const giaFatte = new Map(foglie(precedente).map((f) => [f.chiave, f.testo]));
  const tutte = foglie(it as unknown as Albero);
  const tradotte = new Map<string, string>();
  const daFare: Foglia[] = [];
  for (const f of tutte) {
    const vecchia = giaFatte.get(f.chiave);
    if (vecchia && sorgenti[f.chiave] === f.testo && valida(f, vecchia)) tradotte.set(f.chiave, vecchia);
    else daFare.push(f);
  }
  console.log(`${lingua}: ${daFare.length} testi da tradurre su ${tutte.length}`);
  for (let giro = 0; giro < 3 && daFare.length; giro++) {
    const blocchi: Foglia[][] = [];
    for (let i = 0; i < daFare.length; i += 60) blocchi.push(daFare.slice(i, i + 60));
    const rimasti: Foglia[] = [];
    for (const b of blocchi) {
      const t = await traduciBlocco(lingua, b);
      for (const f of b) {
        const x = t.get(f.chiave);
        if (valida(f, x)) tradotte.set(f.chiave, x!);
        else rimasti.push(f);
      }
    }
    daFare.splice(0, daFare.length, ...rimasti);
    if (rimasti.length) console.log(`${lingua}: ${rimasti.length} da rifare (giro ${giro + 2})`);
  }
  if (daFare.length) throw new Error(`${lingua}: non tradotti ${daFare.map((f) => f.chiave).join(", ")}`);
  writeFileSync(file, `${JSON.stringify(ricostruisci(it as unknown as Albero, tradotte), null, 2)}\n`);
  mkdirSync("lib/i18n/sorgenti", { recursive: true });
  writeFileSync(fileSorgenti, `${JSON.stringify(Object.fromEntries(tutte.map((f) => [f.chiave, f.testo])), null, 1)}\n`);
  console.log(`${lingua}: scritto ${file} (${INFO_LINGUA[lingua].nome})`);
}

async function main() {
  const richieste = process.argv.slice(2) as LinguaSito[];
  const lingue = (richieste.length ? richieste : LINGUE_SITO.filter((l) => l !== "it")).filter((l) => l !== "it");
  const esiti = await Promise.allSettled(lingue.map((l) => traduciLingua(l)));
  esiti.forEach((e, i) => e.status === "rejected" && console.error(`${lingue[i]}: ${e.reason}`));
  if (esiti.some((e) => e.status === "rejected")) process.exit(1);
}

if (process.argv[1]?.endsWith("traduci-dizionario.ts")) main();
