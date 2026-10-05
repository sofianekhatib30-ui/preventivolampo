import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// Regole di contrasto del brand (WCAG 2.x, testo normale ≥ 4,5:1).
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
  it.each(["inchiostro", "testo-2", "testo-3", "lime-scuro", "cielo-scuro", "errore", "successo"])("%s sui fondi chiari ≥ 4,5:1", (colore) => {
    for (const fondo of ["fondo", "fondo-2", "superficie", "scontrino"]) {
      expect(contrasto(token(colore), token(fondo)), `${colore} su ${fondo}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it.each(["fondo", "scuro-testo", "scuro-nota", "lime", "cielo"])("%s sull'ardesia ≥ 4,5:1", (colore) => {
    for (const fondo of ["ardesia", "ardesia-2"]) {
      expect(contrasto(token(colore), token(fondo)), `${colore} su ${fondo}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("sul lime si scrive in inchiostro; l'avviso ambra si legge", () => {
    expect(contrasto(token("inchiostro"), token("lime"))).toBeGreaterThanOrEqual(7);
    expect(contrasto(token("ambra-testo"), token("ambra"))).toBeGreaterThanOrEqual(4.5);
    expect(contrasto(token("inchiostro"), token("cielo"))).toBeGreaterThanOrEqual(4.5);
  });

  it("lime e azzurro non vanno mai come testo sul chiaro: per questo esistono lime-scuro e cielo-scuro", () => {
    // Registrato perché nessuno li usi lì: se un giorno i valori cambiano, questo test lo dice.
    expect(contrasto(token("lime"), token("superficie"))).toBeLessThan(3);
    expect(contrasto(token("cielo"), token("superficie"))).toBeLessThan(3);
  });
});
