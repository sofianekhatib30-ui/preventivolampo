import { DIMENSIONE_OG, immagineOg, lingueSenzaCaratteri } from "@/lib/brand/immagine-og";
import { linguaValida } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";

// Anteprima della home e delle pagine che non ne hanno una propria.
export const alt = "PreventivoLampo";
export const size = DIMENSIONE_OG;
export const contentType = "image/png";

export default async function Immagine({ params }: { params: Promise<{ lang: string }> }) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingueSenzaCaratteri(lingua) ? "it" : lingua);
  return immagineOg({ titolo: d.hero.titolo, riga: d.hero.garanzia });
}
