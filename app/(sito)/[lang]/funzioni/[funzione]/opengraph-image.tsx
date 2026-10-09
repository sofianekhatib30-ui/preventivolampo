import { DIMENSIONE_OG, immagineOg, lingueSenzaCaratteri } from "@/lib/brand/immagine-og";
import { contenutiDi } from "@/lib/contenuti";
import { FUNZIONI, type IdFunzione } from "@/lib/contenuti/registro";
import { linguaValida } from "@/lib/i18n/lingue";

export const alt = "PreventivoLampo";
export const size = DIMENSIONE_OG;
export const contentType = "image/png";

export default async function Immagine({ params }: { params: Promise<{ lang: string; funzione: string }> }) {
  const { lang, funzione } = await params;
  const lingua = linguaValida(lang);
  const c = await contenutiDi(lingueSenzaCaratteri(lingua) ? "it" : lingua);
  const f = c.funzioni[FUNZIONI.includes(funzione as IdFunzione) ? (funzione as IdFunzione) : FUNZIONI[0]];
  return immagineOg({ titolo: f.meta.titolo, riga: f.riga });
}
