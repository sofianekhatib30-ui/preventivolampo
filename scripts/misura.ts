// npm run misura — fa girare il motore sui 30 casi del banco e scrive misure/AAAA-MM-GG.md.
// Il report è generato da questo comando: nessun numero si ricopia a mano.
// Opzioni: --casi 01,02,03     (sottoinsieme)
//          --da-uscite AAAA-MM-GG (ricalcola il report dalle uscite salvate, senza chiamare l'API)
//          --seconda             (seconda misura nello stesso giorno: AAAA-MM-GGb, la prima resta)
//          --banco verifica      (i casi nuovi di testset/verifica: report misure/AAAA-MM-GG-verifica.md)

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { ExpectedCase } from "@/lib/banco/schema";
import { PriceList, type PriceListItem } from "@/lib/listino/schema";
import { computeTotals, formatEuro } from "@/lib/importi";
import { elabora } from "@/lib/motore";
import { anthropicCaller, modelName } from "@/lib/motore/claude";
import { scoreCase, type CaseScore } from "@/lib/motore/confronto";
import { splitVat } from "@/lib/motore/iva";
import type { Draft } from "@/lib/motore/tipi";

function loadEnvLocal() {
  if (!existsSync(".env.local")) return;
  for (const raw of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = raw.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const pct = (a: number, b: number) => (b === 0 ? "—" : `${((a / b) * 100).toFixed(1).replace(".", ",")}%`);
const n2 = (x: number) => x.toFixed(2).replace(".", ",");

// IVA al centesimo: si confronta l'IVA della bozza con quella calcolata sull'atteso, con gli stessi prezzi di listino.
// Solo dove è calcolabile senza l'artigiano: regime noto, nessun bene significativo da valorizzare, tutte le quantità dette.
function vatOf(lines: Array<{ quantity: number | null; price: number | null }>, regime: string | null) {
  if (regime === null || regime === "agevolata_10_beni_significativi") return null;
  if (lines.some((l) => l.price !== null && l.quantity === null)) return null;
  const priced = lines.filter((l) => l.price !== null).map((l) => ({ quantity: l.quantity!, unitPriceCents: l.price! }));
  const t = computeTotals(priced, 0).taxableCents;
  return splitVat(regime as "ordinaria_22" | "agevolata_10", t).vatCents;
}

async function main() {
  loadEnvLocal();
  const banco = process.argv.includes("--banco") ? process.argv[process.argv.indexOf("--banco") + 1] : null;
  const base = banco === "verifica" ? "testset/verifica" : "testset";
  const only = process.argv.includes("--casi") ? process.argv[process.argv.indexOf("--casi") + 1].split(",") : null;
  const list = PriceList.parse(JSON.parse(readFileSync("dati/listino.json", "utf8")));
  const byCode = new Map<string, PriceListItem>(list.items.map((i) => [i.code, i]));
  const ids = readdirSync(`${base}/atteso`)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, 2))
    .filter((id) => !only || only.includes(id))
    .sort();
  const fromSaved = process.argv.includes("--da-uscite") ? process.argv[process.argv.indexOf("--da-uscite") + 1] : null;
  const call = fromSaved ? null : anthropicCaller();
  const day =
    fromSaved ?? new Date().toISOString().slice(0, 10) + (process.argv.includes("--seconda") ? "b" : "") + (banco === "verifica" ? "-verifica" : "");
  const outDir = `misure/uscite/${day}`;
  mkdirSync(outDir, { recursive: true });

  const rows: Array<{ score: CaseScore; draft: Draft | null; error?: string; vatOk: boolean | null }> = [];
  for (const id of ids) {
    const expected = ExpectedCase.parse(JSON.parse(readFileSync(`${base}/atteso/${id}.json`, "utf8")));
    const transcript = readFileSync(`${base}/copioni/${id}.md`, "utf8").replace(/<!--[\s\S]*?-->/g, "").trim();
    process.stdout.write(`caso ${id}… `);
    try {
      const draft: Draft = call
        ? await elabora(transcript, list, call)
        : JSON.parse(readFileSync(`${outDir}/${id}.json`, "utf8"));
      if (call) writeFileSync(`${outDir}/${id}.json`, JSON.stringify(draft, null, 2));
      const score = scoreCase(expected, draft, byCode);
      const expVat = vatOf(
        expected.lines.map((l) => ({ quantity: l.quantity, price: l.match.kind === "listino" ? byCode.get(l.match.code)!.priceCents : null })),
        expected.vat.expectedRegime,
      );
      const gotVat = vatOf(draft.lines.map((l) => ({ quantity: l.quantity, price: l.unitPriceCents })), draft.vat.regime);
      rows.push({ score, draft, vatOk: expVat === null ? null : expVat === gotVat });
      console.log(`${score.linesPerfect}/${score.expectedLines} righe giuste, ${(draft.elapsedMs / 1000).toFixed(1)} s`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`ERRORE: ${msg}`);
      rows.push({ score: { id, expectedLines: expected.lines.length } as CaseScore, draft: null, error: msg, vatOk: null });
    }
  }

  const ok = rows.filter((r) => r.draft);
  const sum = (f: (s: CaseScore) => number) => ok.reduce((a, r) => a + f(r.score), 0);
  const inUsd = Number(process.env.PREZZO_INPUT_USD_MTOK ?? 2);
  const outUsd = Number(process.env.PREZZO_OUTPUT_USD_MTOK ?? 10);
  const eurPerUsd = Number(process.env.EUR_PER_USD ?? 0.86);
  const costs = ok.map((r) => (r.draft!.usage.inputTokens * inUsd + r.draft!.usage.outputTokens * outUsd) / 1e6);
  const avgCostUsd = costs.reduce((a, b) => a + b, 0) / Math.max(1, costs.length);
  const avgTime = ok.reduce((a, r) => a + r.draft!.elapsedMs, 0) / Math.max(1, ok.length) / 1000;
  const regimeCases = ok.filter((r) => r.score.regimeExpected !== null);
  const regimeGuessed = ok.filter((r) => r.score.regimeExpected === null && r.score.regimeGot !== null);
  const vatCases = ok.filter((r) => r.vatOk !== null);

  const md = `# Misura del motore — ${day}

Generato da \`npm run misura\` (non scritto a mano). Modello: \`${modelName()}\`. Casi: ${ok.length} eseguiti su ${rows.length}${rows.length - ok.length ? `, ${rows.length - ok.length} in errore` : ""}.
Ingresso: le trascrizioni testuali dei copioni (\`${base}/copioni/\`), non ancora gli audio. Dati inventati.
Uscite grezze del motore: \`${outDir}/\`.

## Risultati

| Misura | Valore |
|---|---|
| Righe giuste senza correzioni (voce, quantità e unità) | ${sum((s) => s.linesPerfect)} su ${sum((s) => s.expectedLines)} (${pct(sum((s) => s.linesPerfect), sum((s) => s.expectedLines))}) |
| Voci di listino abbinate correttamente | ${sum((s) => s.listinoOk)} su ${sum((s) => s.listinoExpected)} (${pct(sum((s) => s.listinoOk), sum((s) => s.listinoExpected))}) |
| Voci «da prezzare» riconosciute come tali | ${sum((s) => s.daPrezzareOk)} su ${sum((s) => s.daPrezzareExpected)} (${pct(sum((s) => s.daPrezzareOk), sum((s) => s.daPrezzareExpected))}) |
| Abbinamenti sbagliati con prezzo di listino (l'errore pericoloso) | ${sum((s) => s.falseMatches)} |
| **Prezzi inventati** | **${sum((s) => s.inventedPrices)}** |
| Domande di chiarimento corrette | ${sum((s) => s.questionsOk)} su ${sum((s) => s.questionsExpected)} (${pct(sum((s) => s.questionsOk), sum((s) => s.questionsExpected))}); domande in più: ${sum((s) => s.questionsExtra)} |
| Regime IVA corretto (casi con contesto completo) | ${regimeCases.filter((r) => r.score.regimeOk).length} su ${regimeCases.length} |
| Regime IVA dato senza che il vocale bastasse a stabilirlo | ${regimeGuessed.length} su ${ok.length - regimeCases.length}${regimeGuessed.length ? ` (casi ${regimeGuessed.map((r) => r.score.id).join(", ")})` : ""} |
| IVA corretta al centesimo (casi calcolabili senza l'artigiano) | ${vatCases.filter((r) => r.vatOk).length} su ${vatCases.length} |
| Righe in più rispetto all'atteso | ${sum((s) => s.extraLines)} |
| Tempo medio per preventivo | ${n2(avgTime)} s |
| Costo medio per preventivo | $${avgCostUsd.toFixed(4)} ≈ ${formatEuro(Math.round(avgCostUsd * eurPerUsd * 100 * 100) / 100)} (token reali; $${inUsd}/$${outUsd} per milione di token, cambio ${eurPerUsd} €/$) |

Note sul metodo:
- Gli attesi sono stati scritti prima che il motore esistesse (vedi \`${base}/LEGGIMI.md\`) e non si correggono guardando queste uscite.
- Le righe della bozza si allineano a quelle attese per somiglianza delle parole dette; una quantità è giusta entro l'1%.
- «IVA al centesimo» esclude i casi con beni significativi (il valore del bene lo dà l'artigiano in revisione) e quelli con domande aperte.

## Caso per caso

| Caso | Righe giuste | Listino | Da prezzare | Sbagliati | Domande | Regime IVA | Tempo |
|---|---|---|---|---|---|---|---|
${rows
  .map((r) =>
    r.draft
      ? `| ${r.score.id} | ${r.score.linesPerfect}/${r.score.expectedLines} | ${r.score.listinoOk}/${r.score.listinoExpected} | ${r.score.daPrezzareOk}/${r.score.daPrezzareExpected} | ${r.score.falseMatches} | ${r.score.questionsOk}/${r.score.questionsExpected}${r.score.questionsExtra ? ` (+${r.score.questionsExtra})` : ""} | ${r.score.regimeOk ? "ok" : `atteso ${r.score.regimeExpected ?? "—"}, uscito ${r.score.regimeGot ?? "—"}`} | ${n2(r.draft.elapsedMs / 1000)} s |`
      : `| ${r.score.id} | errore: ${r.error} | | | | | | |`,
  )
  .join("\n")}
`;
  mkdirSync("misure", { recursive: true });
  writeFileSync(`misure/${day}.md`, md);
  console.log(`\nScritto misure/${day}.md`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
