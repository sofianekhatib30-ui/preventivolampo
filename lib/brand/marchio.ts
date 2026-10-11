// Il marchio di Preventivi è quello di K Digital Solution, come per Attestiamo e Smistatore: la K fatta
// di una stanghetta sabbia e di una freccia d'oro su fondo inchiostro (lo stesso disegno di
// kdigitalsolution.it e dell'account). Il vecchio marchio col fulmine di PreventivoLampo è andato con il nome l'11/10/2026.
// Usato dal logo, dall'icona della scheda, dall'icona Apple e dall'immagine di anteprima.
export const MARCHIO = {
  viewBox: "0 0 64 64",
  fondo: { raggio: 14, colore: "#2A1018" },
  // Disegnata in un riquadro 100×100, poi ridotta e centrata: translate(10 10) scale(0.44)
  trasforma: "translate(10 10) scale(0.44)",
  stanghetta: { x: 14, y: 10, larghezza: 15, altezza: 80, raggio: 1.5, colore: "#F2E4D0" },
  freccia: { d: "M82 10 L42 50 L82 90", colore: "#C6A15B", spessore: 15 },
} as const;

export function marchioSvg({ size = 64 }: { size?: number } = {}): string {
  const { fondo, trasforma, stanghetta: s, freccia: f } = MARCHIO;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><rect width="64" height="64" rx="${fondo.raggio}" fill="${fondo.colore}"/><g transform="${trasforma}"><rect x="${s.x}" y="${s.y}" width="${s.larghezza}" height="${s.altezza}" rx="${s.raggio}" fill="${s.colore}"/><path d="${f.d}" fill="none" stroke="${f.colore}" stroke-width="${f.spessore}" stroke-miterlimit="8"/></g></svg>`;
}
