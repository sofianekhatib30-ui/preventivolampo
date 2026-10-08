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
- tramezzo = parete divisoria non portante (EN non-load-bearing partition wall · DE nichttragende Trennwand · FR cloison non porteuse · ES tabique no portante · NL niet-dragende scheidingswand)
- massetto = sottofondo del pavimento (EN floor screed · DE Estrich · FR chape · ES recrecido de mortero · NL dekvloer)
- battiscopa (EN skirting board · DE Sockelleiste · FR plinthe · ES rodapié · NL plint)
- a corpo = a prezzo fisso per l'intero lavoro (EN lump sum · DE pauschal · FR forfait · ES a tanto alzado · NL forfaitair)
- solo posa / posa del materiale del cliente = solo manodopera, materiale fornito dal cliente (EN labour only, client-supplied material · DE nur Verlegung, Material vom Kunden · FR pose seule, matériau fourni par le client · ES solo colocación, material del cliente · NL alleen plaatsing, materiaal van de klant)
- fornitura e posa (EN supply and installation · DE Lieferung und Montage · FR fourniture et pose · ES suministro y colocación · NL levering en plaatsing)
- beni significativi: non si traduce, resta «beni significativi»
- rasatura = rasatura con stucco della parete (EN skim coat · DE Spachtelung · FR ratissage · ES enlucido fino · NL egaliseren met plamuur)
- idropittura (EN emulsion paint · DE Dispersionsfarbe · FR peinture à l'eau · ES pintura plástica · NL muurverf)
- punto luce / punto presa = punto dell'impianto elettrico (EN light point / socket point · DE Lichtauslass / Steckdosenauslass · FR point lumineux / point prise · ES punto de luz / punto de enchufe · NL lichtpunt / stopcontactpunt)`;

export function istruzioni(lingua: LinguaStraniera): string {
  return `Traduci dall'italiano in ${NOME_LINGUA[lingua].italiano} (${NOME_LINGUA[lingua].proprio}) le voci di un preventivo edile italiano, per il cliente finale che non parla italiano.

Regole:
- Una traduzione per ogni voce, nello stesso ordine e nello stesso numero: mai unire, dividere, saltare o aggiungere voci.
- Traduci il significato tecnico, non le parole una per una: il cliente deve capire che lavoro è.
- Non aggiungere niente che non c'è (materiali, marche, garanzie, spiegazioni) e non togliere niente.
- Misure, numeri, formati (80x80, 30x30, Ø 16), sigle e marche restano identici.
- Registro cortese e neutro, testo breve come l'originale. Niente note tra parentesi tue.

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
