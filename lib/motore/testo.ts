// Normalizzazione del parlato per il filtro deterministico: minuscole, senza accenti,
// parole vuote tolte, radice grezza (le ultime vocali via) per far combaciare «piastrelle» e «piastrella».

const STOP = new Set(
  "a ad al alla alle allo ai agli anche c che chi ci col con coi cosi da dal dalla dalle dai dagli de dei degli del della delle dello di e ed el gli ha ho i il in la le li lo l ma me mi ne nel nella nelle nei negli no non o per piu poi quel quella quello questo questa se si so su sul sulla sui sono tra tutto tutti un una uno va vi ecc tipo poi allora praticamente quindi".split(
    " ",
  ),
);

export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function stem(word: string): string {
  if (word.length <= 4) return word;
  return word.replace(/(ioni|ione|ature|atura|mente|i|e|a|o)$/, "");
}

export function tokens(text: string): string[] {
  return normalize(text)
    .split(" ")
    .filter((w) => w.length > 1 && !STOP.has(w))
    .map(stem);
}

export function jaccard(a: string[], b: string[]): number {
  const A = new Set(a);
  const B = new Set(b);
  if (A.size === 0 && B.size === 0) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}
