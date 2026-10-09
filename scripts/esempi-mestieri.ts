// Genera gli esempi delle pagine mestiere (lib/contenuti/esempi/esempi.json): fa girare l'estrazione
// del motore sul racconto inventato di ogni pagina e salva quello che ne esce, senza ritocchi.
// Le domande sono quelle che il motore farebbe sulle quantità e sulle unità mancanti.
// Uso: npx tsx scripts/esempi-mestieri.ts [mestiere…]   (serve ANTHROPIC_API_KEY)
import { readFileSync, writeFileSync } from "node:fs";
import { contenutiIt } from "@/lib/contenuti/it";
import type { EsempioMotore } from "@/lib/contenuti/esempi";
import { MESTIERI, type IdMestiere } from "@/lib/contenuti/registro";
import { anthropicCaller } from "@/lib/motore/claude";
import { extract } from "@/lib/motore/estrazione";

const FILE = "lib/contenuti/esempi/esempi.json";
const UNITA: Record<string, string> = { m2: "m²", m: "metri", m3: "m³", cad: "pezzi", h: "ore", "100kg": "quintali", kg: "kg", l: "litri", corpo: "a corpo" };

async function esempio(id: IdMestiere): Promise<EsempioMotore> {
  const dettatura = contenutiIt.mestieri[id].esempio.dettatura;
  const { extraction } = await extract(dettatura, anthropicCaller());
  const righe = extraction.lines.map((l) => ({ voce: l.work, quantita: l.quantity, unita: l.unit, nota: l.quantityNote, materialeCliente: l.clientSuppliesMaterial }));
  const domande = extraction.lines.flatMap((l) => {
    const out: string[] = [];
    if (l.quantity === null) out.push(l.unit ? `${l.unit === "h" ? "Quante" : "Quanti"} ${UNITA[l.unit]} di «${l.work}»?` : `Quanto «${l.work}»? Dimmi numero e unità.`);
    else if (l.unit === null) out.push(`«${l.work}»: ${l.quantity} in che unità?`);
    return out;
  });
  return { data: new Date().toISOString().slice(0, 10), dettatura, righe, domande, escluso: extraction.exclusions, note: extraction.notes };
}

async function main() {
  const chiesti = process.argv.slice(2) as IdMestiere[];
  const ids = chiesti.length ? chiesti : MESTIERI;
  const esistenti = JSON.parse(readFileSync(FILE, "utf8")) as Record<string, EsempioMotore>;
  const esiti = await Promise.allSettled(ids.map(async (id) => [id, await esempio(id)] as const));
  for (const [i, e] of esiti.entries()) {
    if (e.status === "fulfilled") esistenti[e.value[0]] = e.value[1];
    else console.error(`${ids[i]}: ${e.reason}`);
  }
  const ordinati = Object.fromEntries(MESTIERI.filter((m) => esistenti[m]).map((m) => [m, esistenti[m]]));
  writeFileSync(FILE, `${JSON.stringify(ordinati, null, 2)}\n`);
  console.log(`scritti ${Object.keys(ordinati).length} esempi`);
  if (esiti.some((e) => e.status === "rejected")) process.exit(1);
}

main();
