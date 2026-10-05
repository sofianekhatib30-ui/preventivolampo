// Geometria del marchio: un foglio con l'orecchia (il preventivo) e il fulmine (il lampo).
// Usata dal logo animato, dalla favicon, dall'icona Apple e dall'immagine di anteprima.
export const MARCHIO = {
  viewBox: "0 0 40 40",
  // Foglio con l'angolo in alto a destra piegato
  foglio: "M9 0H29L40 11V31C40 36 36 40 31 40H9C4 40 0 36 0 31V9C0 4 4 0 9 0Z",
  orecchia: "M29 0V8C29 9.7 30.3 11 32 11H40Z",
  fulmine: "M23.5 6.5 11.5 22.6H19.2L16.4 33.5 28.6 17.2H20.9Z",
  colori: { foglio: "#2A2C39", orecchia: "#62C0F6", fulmine: "#B2F601" },
} as const;

export function marchioSvg({ size = 40, sfondo }: { size?: number; sfondo?: string } = {}): string {
  const { foglio, orecchia, fulmine, colori } = MARCHIO;
  const bg = sfondo ? `<rect width="40" height="40" fill="${sfondo}"/>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${size}" height="${size}">${bg}<path d="${foglio}" fill="${colori.foglio}"/><path d="${orecchia}" fill="${colori.orecchia}"/><path d="${fulmine}" fill="${colori.fulmine}"/></svg>`;
}
