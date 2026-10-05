import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// SPEC, «Token»: --testo-3 deve avere contrasto ≥ 4,5:1 su tutti i fondi chiari.
// I valori si leggono da app/globals.css per nome del token, non per posizione.

const css = readFileSync(path.resolve(__dirname, "../app/globals.css"), "utf8");

function token(nome: string): string {
  const m = css.match(new RegExp(`--color-${nome}:\\s*(#[0-9a-fA-F]{6})\\s*;`));
  if (!m) throw new Error(`token --color-${nome} non trovato in globals.css`);
  return m[1];
}

function luminanza(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrasto(a: string, b: string): number {
  const [x, y] = [luminanza(a), luminanza(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

describe("contrasto dei token", () => {
  it.each(["fondo", "fondo-2", "superficie", "scontrino"])("testo-3 su %s ≥ 4,5:1", (fondo) => {
    expect(contrasto(token("testo-3"), token(fondo))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(["scuro-testo", "scuro-nota", "segnale"])("%s su inchiostro ≥ 4,5:1", (colore) => {
    expect(contrasto(token(colore), token("inchiostro"))).toBeGreaterThanOrEqual(4.5);
  });

  it("testo-3 sul giallo NON arriva a 4,5:1: sul giallo si usano solo inchiostro e testo-2", () => {
    // Registrato perché nessuno lo usi lì: se un giorno i valori cambiano, questo test lo dice.
    expect(contrasto(token("testo-3"), token("segnale"))).toBeLessThan(4.5);
    expect(contrasto(token("testo-2"), token("segnale"))).toBeGreaterThanOrEqual(4.5);
  });
});
