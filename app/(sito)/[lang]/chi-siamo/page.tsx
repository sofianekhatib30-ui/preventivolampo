import type { Metadata } from "next";
import { Ricco } from "@/components/Ricco";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { Sezioni } from "@/components/sito/Sezioni";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { linguaValida } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/testo";
import { briciole, grafo, organizzazione } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/sito";

export async function generateMetadata({ params }: PageProps<"/[lang]/chi-siamo">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  const P = (await contenutiDi(lingua)).pagine.chiSiamo;
  return metadati({ lingua, p: "/chi-siamo", titolo: P.meta.titolo, descrizione: P.meta.descrizione });
}

export default async function ChiSiamo({ params }: PageProps<"/[lang]/chi-siamo">) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  const c = await contenutiDi(lingua);
  const P = c.pagine.chiSiamo;
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.chiSiamo, p: "/chi-siamo" },
  ];
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={P.h1} sottotitolo={P.intro} />
      <div className="margini flex max-w-[860px] flex-col gap-12 py-14 lg:py-24">
        <Sezioni sezioni={P.sezioni} lingua={lingua} />
        <p className="m-0 text-[19px] font-semibold">
          <Ricco testo={fmt(P.contatti, { email: CONTACT_EMAIL })} classeLink="text-cielo-scuro" />
        </p>
      </div>
      <JsonLd dati={grafo(briciole(lingua, vie), { ...organizzazione(), founder: { "@type": "Person", name: "Sofiane Khatib" } })} />
    </Guscio>
  );
}
