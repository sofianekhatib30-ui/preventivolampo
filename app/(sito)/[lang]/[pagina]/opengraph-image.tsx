import { DIMENSIONE_OG, immagineOg, lingueSenzaCaratteri } from "@/lib/brand/immagine-og";
import { contenutiDi } from "@/lib/contenuti";
import { mestiereDaSlug } from "@/lib/contenuti/registro";
import { linguaValida } from "@/lib/i18n/lingue";

export const alt = "PreventivoLampo";
export const size = DIMENSIONE_OG;
export const contentType = "image/png";

export default async function Immagine({ params }: { params: Promise<{ lang: string; pagina: string }> }) {
  const { lang, pagina } = await params;
  const lingua = linguaValida(lang);
  const c = await contenutiDi(lingueSenzaCaratteri(lingua) ? "it" : lingua);
  const m = c.mestieri[mestiereDaSlug(pagina) ?? "elettricista"];
  return immagineOg({ titolo: m.meta.titolo, riga: m.riga });
}
