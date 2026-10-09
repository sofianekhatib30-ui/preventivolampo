import type { Metadata } from "next";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { Schede } from "@/components/sito/Schede";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { MESTIERI, percorsoMestiere } from "@/lib/contenuti/registro";
import { linguaValida, percorso } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { briciole, grafo } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/mestieri">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  const P = (await contenutiDi(lingua)).pagine.mestieri;
  return metadati({ lingua, p: "/mestieri", titolo: P.meta.titolo, descrizione: P.meta.descrizione });
}

export default async function Mestieri({ params }: PageProps<"/[lang]/mestieri">) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  const c = await contenutiDi(lingua);
  const P = c.pagine.mestieri;
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.mestieri, p: "/mestieri" },
  ];
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={P.h1} sottotitolo={P.testo} />
      <section className="margini flex flex-col gap-8 py-14 lg:py-20">
        <Schede voci={MESTIERI.map((m) => ({ href: percorso(lingua, percorsoMestiere(m)), nome: c.mestieri[m].nome, riga: c.mestieri[m].riga }))} />
        <p className="m-0 max-w-[720px] text-[17px] leading-relaxed text-testo-2">{P.altro}</p>
      </section>
      <JsonLd dati={grafo(briciole(lingua, vie))} />
    </Guscio>
  );
}
