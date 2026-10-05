import type { ExpectedCase } from "@/lib/banco/schema";
import type { PriceListItem } from "@/lib/listino/schema";
import { jaccard, tokens } from "./testo";
import type { Draft } from "./tipi";

// Confronto fra la bozza del motore e l'atteso scritto prima del motore.
// Le righe si allineano per somiglianza delle parole dette (più un bonus se il codice coincide).

export type LineVerdict = {
  expectedIndex: number;
  draftIndex: number | null;
  matchOk: boolean;
  quantityOk: boolean;
  unitOk: boolean;
  falseMatch: boolean; // il motore ha messo un prezzo di listino dove l'atteso dice altro: l'errore pericoloso
};

export type CaseScore = {
  id: string;
  expectedLines: number;
  draftLines: number;
  aligned: number;
  listinoExpected: number;
  listinoOk: number;
  daPrezzareExpected: number;
  daPrezzareOk: number;
  linesPerfect: number;
  falseMatches: number;
  extraLines: number;
  inventedPrices: number;
  questionsExpected: number;
  questionsOk: number;
  questionsExtra: number;
  regimeExpected: string | null;
  regimeGot: string | null;
  regimeOk: boolean;
  verdicts: LineVerdict[];
};

function similarity(a: string, b: string, sameCode: boolean): number {
  return jaccard(tokens(a), tokens(b)) + (sameCode ? 0.5 : 0);
}

export function align(expected: ExpectedCase, draft: Draft): Array<number | null> {
  const pairs: Array<{ e: number; d: number; s: number }> = [];
  expected.lines.forEach((el, e) => {
    draft.lines.forEach((dl, d) => {
      const expCode = el.match.kind === "listino" ? el.match.code : null;
      const gotCode = dl.match.kind === "listino" ? dl.match.code : dl.match.suggestedCode;
      const s = similarity(el.spoken, `${dl.spoken} ${dl.work}`, expCode !== null && expCode === gotCode);
      if (s >= 0.12) pairs.push({ e, d, s });
    });
  });
  pairs.sort((a, b) => b.s - a.s);
  const out: Array<number | null> = expected.lines.map(() => null);
  const usedD = new Set<number>();
  for (const p of pairs) {
    if (out[p.e] !== null || usedD.has(p.d)) continue;
    out[p.e] = p.d;
    usedD.add(p.d);
  }
  return out;
}

const close = (a: number | null, b: number | null) =>
  a === null || b === null ? a === b : Math.abs(a - b) <= Math.max(0.011, Math.abs(b) * 0.01);

export function scoreCase(expected: ExpectedCase, draft: Draft, byCode: Map<string, PriceListItem>): CaseScore {
  const map = align(expected, draft);
  const verdicts: LineVerdict[] = expected.lines.map((el, e) => {
    const d = map[e];
    const dl = d === null ? null : draft.lines[d];
    const matchOk =
      dl !== null &&
      (el.match.kind === "listino"
        ? dl.match.kind === "listino" && dl.match.code === el.match.code
        : dl.match.kind === "da_prezzare");
    const falseMatch = dl !== null && dl.match.kind === "listino" && !(el.match.kind === "listino" && dl.match.code === el.match.code);
    return {
      expectedIndex: e,
      draftIndex: d,
      matchOk,
      quantityOk: dl !== null && close(dl.quantity, el.quantity),
      unitOk: dl !== null && dl.unit === el.unit,
      falseMatch,
    };
  });

  const inventedPrices = draft.lines.filter((l) => {
    if (l.match.kind === "da_prezzare") return l.unitPriceCents !== null;
    return l.unitPriceCents !== byCode.get(l.match.code)?.priceCents;
  }).length;

  // Domande: confronto per (riga attesa, tipo), traducendo l'indice della bozza in quello dell'atteso.
  const draftToExp = new Map<number, number>();
  map.forEach((d, e) => d !== null && draftToExp.set(d, e));
  const gotQ = new Set(
    draft.questions.filter((q) => draftToExp.has(q.lineIndex)).map((q) => `${draftToExp.get(q.lineIndex)}:${q.kind}`),
  );
  const expQ = new Set(expected.questions.map((q) => `${q.lineIndex}:${q.kind}`));
  const questionsOk = [...expQ].filter((k) => gotQ.has(k)).length;
  const alignedDraft = new Set(map.filter((d): d is number => d !== null));
  const questionsExtra =
    [...gotQ].filter((k) => !expQ.has(k)).length +
    draft.questions.filter((q) => !draftToExp.has(q.lineIndex)).length;

  const listinoIdx = expected.lines.map((l, i) => (l.match.kind === "listino" ? i : -1)).filter((i) => i >= 0);
  const prezzareIdx = expected.lines.map((l, i) => (l.match.kind === "da_prezzare" ? i : -1)).filter((i) => i >= 0);
  return {
    id: expected.id,
    expectedLines: expected.lines.length,
    draftLines: draft.lines.length,
    aligned: alignedDraft.size,
    listinoExpected: listinoIdx.length,
    listinoOk: listinoIdx.filter((i) => verdicts[i].matchOk).length,
    daPrezzareExpected: prezzareIdx.length,
    daPrezzareOk: prezzareIdx.filter((i) => verdicts[i].matchOk).length,
    linesPerfect: verdicts.filter((v) => v.matchOk && v.quantityOk && v.unitOk).length,
    falseMatches:
      verdicts.filter((v) => v.falseMatch).length +
      draft.lines.filter((l, d) => !alignedDraft.has(d) && l.match.kind === "listino").length,
    extraLines: draft.lines.length - alignedDraft.size,
    inventedPrices,
    questionsExpected: expQ.size,
    questionsOk,
    questionsExtra,
    regimeExpected: expected.vat.expectedRegime,
    regimeGot: draft.vat.regime,
    regimeOk: expected.vat.expectedRegime === draft.vat.regime,
    verdicts,
  };
}
