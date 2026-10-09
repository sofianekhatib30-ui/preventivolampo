import type { Metadata } from "next";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { Schede } from "@/components/sito/Schede";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { GUIDE, percorsoGuida } from "@/lib/contenuti/registro";
import { linguaValida, percorso } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { briciole, grafo } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/guide">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  const P = (await contenutiDi(lingua)).pagine.guide;
  return metadati({ lingua, p: "/guide", titolo: P.meta.titolo, descrizione: P.meta.descrizione });
}

export default async function Guide({ params }: PageProps<"/[lang]/guide">) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  const c = await contenutiDi(lingua);
  const P = c.pagine.guide;
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.guide, p: "/guide" },
  ];
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={P.h1} sottotitolo={P.testo} />
      <section className="margini py-14 lg:py-20">
        <Schede voci={GUIDE.map((g) => ({ href: percorso(lingua, percorsoGuida(g)), nome: c.guide[g].nome, riga: c.guide[g].riga }))} />
      </section>
      <JsonLd dati={grafo(briciole(lingua, vie))} />
    </Guscio>
  );
}
