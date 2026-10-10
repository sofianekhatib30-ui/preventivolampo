import type { ToolCaller, ToolSpec } from "@/lib/motore/claude";
import { NOME_LINGUA, type LinguaStraniera, type Traduzione } from "./lingua";
import type { Preventivo } from "./modello";
import { Rifiuto } from "./rifiuto";

// Traduzione delle voci per il cliente straniero. Il modello traduce solo i testi delle voci e
// delle esclusioni; numeri, prezzi, quantità e aliquote restano nei dati e non passano di qui.
// L'artigiano vede la traduzione accanto all'italiano e la corregge prima di approvare.

const TOOL: ToolSpec = {
  name: "registra_traduzione",
  description: "Registra la traduzione delle voci del preventivo, una per voce, nello stesso ordine.",
  input_schema: {
    type: "object",
    additionalProperties: false,
    required: ["righe", "esclusioni"],
    properties: {
      righe: { type: "array", items: { type: "string" }, description: "Una traduzione per ogni voce, nello stesso ordine" },
      esclusioni: { type: "array", items: { type: "string" }, description: "Una traduzione per ogni esclusione, nello stesso ordine" },
    },
  },
};

// Termini che sbagliati cambiano il senso: la resa è fissata, non lasciata al modello.
const GLOSSARIO = `Glossario (rese obbligate quando il termine compare):
- tramezzo = parete divisoria non portante (EN non-load-bearing partition wall)
- massetto = sottofondo del pavimento (EN floor screed)
- battiscopa (EN skirting board)
- a corpo = a prezzo fisso per l'intero lavoro (EN lump sum)
- solo posa / posa del materiale del cliente = solo manodopera, materiale fornito dal cliente (EN labour only, client-supplied material)
- fornitura e posa (EN supply and installation)
- beni significativi: non si traduce, resta «beni significativi»
- rasatura = rasatura con stucco della parete (EN skim coat)
- idropittura (EN emulsion paint)
- punto luce / punto presa = punto dell'impianto elettrico (EN light point / socket point)`;

export function istruzioni(lingua: LinguaStraniera): string {
  return `Traduci dall'italiano in ${NOME_LINGUA[lingua].italiano} (${NOME_LINGUA[lingua].proprio}) le voci di un preventivo edile italiano, per il cliente finale che non parla italiano.

Regole:
- Una traduzione per ogni voce, nello stesso ordine e nello stesso numero: mai unire, dividere, saltare o aggiungere voci.
- Traduci il significato tecnico, non le parole una per una: il cliente deve capire che lavoro è.
- Non aggiungere niente che non c'è (materiali, marche, garanzie, spiegazioni) e non togliere niente.
- Misure, numeri, formati (80x80, 30x30, Ø 16), sigle e marche restano identici.
- Registro cortese e neutro, testo breve come l'originale. Niente note tra parentesi tue. Mai la lineetta lunga (—): usa virgole, due punti o parentesi.

${GLOSSARIO}`;
}

export async function traduciVoci(p: Pick<Preventivo, "righe" | "esclusioni">, lingua: LinguaStraniera, call: ToolCaller): Promise<Traduzione> {
  const sorgente = { righe: p.righe.map((r) => r.work), esclusioni: [...p.esclusioni] };
  const user = [
    "Voci:",
    ...sorgente.righe.map((t, i) => `${i + 1}. ${t}`),
    "",
    sorgente.esclusioni.length ? "Esclusioni:" : "Esclusioni: nessuna",
    ...sorgente.esclusioni.map((t, i) => `${i + 1}. ${t}`),
  ].join("\n");
  const out = await call({ system: istruzioni(lingua), user, tool: TOOL, maxTokens: 4000 });
  const r = out.input as { righe?: unknown; esclusioni?: unknown };
  const testi = (x: unknown) => (Array.isArray(x) && x.every((s) => typeof s === "string") ? (x as string[]).map((s) => s.trim()) : null);
  const righe = testi(r.righe);
  const esclusioni = testi(r.esclusioni ?? []);
  if (!righe || !esclusioni || righe.length !== sorgente.righe.length || esclusioni.length !== sorgente.esclusioni.length || [...righe, ...esclusioni].some((s) => !s || s.length > 400)) {
    throw new Rifiuto("La traduzione non è venuta bene: riprova.", 502);
  }
  return { lingua, righe, esclusioni, sorgente };
}
