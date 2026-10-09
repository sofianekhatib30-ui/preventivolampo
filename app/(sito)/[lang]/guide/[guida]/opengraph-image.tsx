import { DIMENSIONE_OG, immagineOg, lingueSenzaCaratteri } from "@/lib/brand/immagine-og";
import { contenutiDi } from "@/lib/contenuti";
import { GUIDE, type IdGuida } from "@/lib/contenuti/registro";
import { linguaValida } from "@/lib/i18n/lingue";

export const alt = "PreventivoLampo";
export const size = DIMENSIONE_OG;
export const contentType = "image/png";

export default async function Immagine({ params }: { params: Promise<{ lang: string; guida: string }> }) {
  const { lang, guida } = await params;
  const lingua = linguaValida(lang);
  const c = await contenutiDi(lingueSenzaCaratteri(lingua) ? "it" : lingua);
  const g = c.guide[GUIDE.includes(guida as IdGuida) ? (guida as IdGuida) : GUIDE[0]];
  return immagineOg({ titolo: g.meta.titolo, riga: g.riga });
}
