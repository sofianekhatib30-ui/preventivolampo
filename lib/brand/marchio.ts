// Il marchio di Preventivi è quello di K Digital Solution, come per Attestiamo e Smistatore: la K fatta
// di una stanghetta sabbia e di una freccia d'oro su fondo inchiostro (lo stesso disegno di
// kdigitalsolution.it e dell'account). Il vecchio marchio col fulmine di PreventivoLampo è andato con il nome l'11/10/2026.
// Dall'11/10/2026 sera il fondo non è più un quadrato arrotondato ma un esagono con le punte a destra e a sinistra
// (Sofiane: «voglio cambiare il quadrato della favicon e del logo con un esagono che iniziera a far parte della brand
// idendity», «gira l esagono con le punte su desta e sinistra»). Stesso disegno in logo.svg e favicon.svg degli altri
// prodotti (copia in kds pubblicazioni/2026-10-11-marchio-esagono/).
// Usato dal logo, dall'icona della scheda, dall'icona Apple e dall'immagine di anteprima.
export const MARCHIO = {
  viewBox: "0 0 64 64",
  fondo: { esagono: "M61.77 29.00A6 6 0 0 1 61.77 35.00L49.48 56.28A6 6 0 0 1 44.29 59.28L19.71 59.28A6 6 0 0 1 14.52 56.28L2.23 35.00A6 6 0 0 1 2.23 29.00L14.52 7.72A6 6 0 0 1 19.71 4.72L44.29 4.72A6 6 0 0 1 49.48 7.72Z", colore: "#2A1018" },
  // Disegnata in un riquadro 100×100, poi ridotta e centrata nell'esagono
  trasforma: "translate(12.8 12) scale(0.4)",
  stanghetta: { x: 14, y: 10, larghezza: 15, altezza: 80, raggio: 1.5, colore: "#F2E4D0" },
  freccia: { d: "M82 10 L42 50 L82 90", colore: "#C6A15B", spessore: 15 },
} as const;

export function marchioSvg({ size = 64 }: { size?: number } = {}): string {
  const { fondo, trasforma, stanghetta: s, freccia: f } = MARCHIO;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><path d="${fondo.esagono}" fill="${fondo.colore}"/><g transform="${trasforma}"><rect x="${s.x}" y="${s.y}" width="${s.larghezza}" height="${s.altezza}" rx="${s.raggio}" fill="${s.colore}"/><path d="${f.d}" fill="none" stroke="${f.colore}" stroke-width="${f.spessore}" stroke-miterlimit="8"/></g></svg>`;
}
