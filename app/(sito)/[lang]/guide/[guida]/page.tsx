import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaFinale } from "@/components/sito/CtaFinale";
import { ElencoDomande } from "@/components/sito/ElencoDomande";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { Schede } from "@/components/sito/Schede";
import { Indice, Sezioni } from "@/components/sito/Sezioni";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { AGGIORNATO, GUIDE, type IdGuida, percorsoGuida } from "@/lib/contenuti/registro";
import { LINGUE_SITO, linguaValida, percorso } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/testo";
import { articolo, briciole, grafo } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LINGUE_SITO.flatMap((lang) => GUIDE.map((guida) => ({ lang, guida })));
}

async function carica(params: PageProps<"/[lang]/guide/[guida]">["params"]) {
  const { lang, guida } = await params;
  if (!GUIDE.includes(guida as IdGuida)) notFound();
  const id = guida as IdGuida;
  const lingua = linguaValida(lang);
  const c = await contenutiDi(lingua);
  return { id, lingua, c, g: c.guide[id] };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/guide/[guida]">): Promise<Metadata> {
  const { id, lingua, g } = await carica(params);
  return metadati({ lingua, p: percorsoGuida(id), titolo: g.meta.titolo, descrizione: g.meta.descrizione, articolo: { modificato: AGGIORNATO } });
}

export default async function PaginaGuida({ params }: PageProps<"/[lang]/guide/[guida]">) {
  const { id, lingua, c, g } = await carica(params);
  const d = dizionarioDi(lingua);
  const p = (x: string) => percorso(lingua, x);
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.guide, p: "/guide" },
    { nome: g.nome, p: percorsoGuida(id) },
  ];
  const data = new Date(`${AGGIORNATO}T12:00:00`).toLocaleDateString(lingua === "ar" ? "ar-MA" : lingua, { day: "numeric", month: "long", year: "numeric" });
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={g.h1}>
        <p className="m-0 text-[15px] text-scuro-nota">
          {fmt(c.ui.aggiornata, { data })} · K Digital Solution
        </p>
      </TestaPagina>
      <div className="margini grid gap-12 py-14 lg:grid-cols-[240px_minmax(0,720px)] lg:gap-20 lg:py-24">
        <Indice sezioni={g.sezioni} titolo={c.ui.inQuestaPagina} />
        <article className="flex flex-col gap-12">
          <p className="m-0 text-[19px] leading-[1.65] text-inchiostro lg:text-[20px]">{g.intro}</p>
          <aside aria-labelledby="in-breve" className="rounded-[20px] bg-bolla-mia p-6 lg:p-8">
            <h2 id="in-breve" className="m-0 text-[20px] font-extrabold [font-stretch:85%]">
              {c.ui.guida.inBreve}
            </h2>
            <ul className="m-0 mt-4 flex list-disc flex-col gap-2 ps-5 text-[17px] leading-relaxed">
              {g.inBreve.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </aside>
          <Sezioni sezioni={g.sezioni} lingua={lingua} />
          <p className="m-0 rounded-campo border border-ambra-bordo bg-ambra px-4 py-3 text-[15px] leading-normal text-ambra-testo">{g.avvertenza}</p>
          <section aria-labelledby="fonti" className="flex flex-col gap-3">
            <h2 id="fonti" className="m-0 text-[20px] font-extrabold [font-stretch:85%]">
              {c.ui.guida.fonti}
            </h2>
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[15.5px]">
              {g.fonti.map((f) => (
                <li key={f.url}>
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-cielo-scuro">
                    {f.nome}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
      <ElencoDomande titolo={g.domande.titolo} voci={g.domande.voci} lingua={lingua} />
      <section className="margini flex flex-col gap-6 border-t border-linea-2 py-14 lg:py-20">
        <h2 className="m-0 text-[24px] font-extrabold [font-stretch:85%]">{c.ui.guida.altreGuide}</h2>
        <Schede voci={GUIDE.filter((x) => x !== id).map((x) => ({ href: p(percorsoGuida(x)), nome: c.guide[x].nome, riga: c.guide[x].riga }))} colonne={2} />
      </section>
      <CtaFinale d={d} lingua={lingua} titolo={d.candidatura.titolo} testo={c.ui.mestiere.ctaTesto} />
      <JsonLd dati={grafo(briciole(lingua, vie), articolo(lingua, { titolo: g.h1, descrizione: g.meta.descrizione, p: percorsoGuida(id), modificato: AGGIORNATO }))} />
    </Guscio>
  );
}
