// I conti delle quantità li fa il codice, non il modello: il modello scrive l'espressione
// («5*4 + 3,5*3 + 3*3»), qui si calcola. Solo numeri, + - * / e parentesi; tutto il resto = null.

export function calcola(espressione: string | null | undefined): number | null {
  if (!espressione) return null;
  const testo = espressione.replace(/[×x]/g, "*").replace(/:/g, "/").replace(/(\d),(\d)/g, "$1.$2").replace(/\s+/g, "");
  if (!testo || testo.length > 200 || !/^[\d.+\-*/()]+$/.test(testo)) return null;
  let i = 0;
  const numero = (): number | null => {
    if (testo[i] === "(") {
      i++;
      const v = somma();
      if (v === null || testo[i] !== ")") return null;
      i++;
      return v;
    }
    if (testo[i] === "-") {
      i++;
      const v = numero();
      return v === null ? null : -v;
    }
    const m = /^\d+(\.\d+)?|^\.\d+/.exec(testo.slice(i));
    if (!m) return null;
    i += m[0].length;
    return Number(m[0]);
  };
  const prodotto = (): number | null => {
    let v = numero();
    while (v !== null && (testo[i] === "*" || testo[i] === "/")) {
      const op = testo[i++];
      const w = numero();
      if (w === null || (op === "/" && w === 0)) return null;
      v = op === "*" ? v * w : v / w;
    }
    return v;
  };
  const somma = (): number | null => {
    let v = prodotto();
    while (v !== null && (testo[i] === "+" || testo[i] === "-")) {
      const op = testo[i++];
      const w = prodotto();
      if (w === null) return null;
      v = op === "+" ? v + w : v - w;
    }
    return v;
  };
  const v = somma();
  if (v === null || i !== testo.length || !Number.isFinite(v) || v <= 0) return null;
  return Math.round(v * 100) / 100;
}
