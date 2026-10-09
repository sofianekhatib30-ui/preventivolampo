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
import { FUNZIONI, type IdFunzione, MESTIERI, percorsoFunzione, percorsoMestiere } from "@/lib/contenuti/registro";
import { LINGUE_SITO, linguaValida, percorso } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { applicazione, briciole, grafo } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LINGUE_SITO.flatMap((lang) => FUNZIONI.map((funzione) => ({ lang, funzione })));
}

async function carica(params: PageProps<"/[lang]/funzioni/[funzione]">["params"]) {
  const { lang, funzione } = await params;
  if (!FUNZIONI.includes(funzione as IdFunzione)) notFound();
  const id = funzione as IdFunzione;
  const lingua = linguaValida(lang);
  const c = await contenutiDi(lingua);
  return { id, lingua, c, f: c.funzioni[id] };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/funzioni/[funzione]">): Promise<Metadata> {
  const { id, lingua, f } = await carica(params);
  return metadati({ lingua, p: percorsoFunzione(id), titolo: f.meta.titolo, descrizione: f.meta.descrizione });
}

export default async function PaginaFunzione({ params }: PageProps<"/[lang]/funzioni/[funzione]">) {
  const { id, lingua, c, f } = await carica(params);
  const d = dizionarioDi(lingua);
  const p = (x: string) => percorso(lingua, x);
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.come, p: "/funzioni" },
    { nome: f.nome, p: percorsoFunzione(id) },
  ];
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={f.h1} sottotitolo={f.sottotitolo}>
        <a href={p("/#candidatura")} className="bottone bottone-azione-scuro self-start py-4 text-[17px]">
          {d.comune.ctaPilota}
        </a>
      </TestaPagina>
      <div className="margini grid gap-12 py-14 lg:grid-cols-[240px_minmax(0,720px)] lg:gap-20 lg:py-24">
        <Indice sezioni={f.sezioni} titolo={c.ui.inQuestaPagina} />
        <Sezioni sezioni={f.sezioni} lingua={lingua} />
      </div>
      <ElencoDomande titolo={f.domande.titolo} voci={f.domande.voci} lingua={lingua} />
      <section className="margini flex flex-col gap-6 border-t border-linea-2 py-14 lg:py-20">
        <h2 className="m-0 text-[24px] font-extrabold [font-stretch:85%]">{c.ui.funzione.altre}</h2>
        <Schede colonne={3} voci={FUNZIONI.filter((x) => x !== id).map((x) => ({ href: p(percorsoFunzione(x)), nome: c.funzioni[x].nome, riga: c.funzioni[x].riga }))} />
        <h2 className="m-0 mt-6 text-[24px] font-extrabold [font-stretch:85%]">{c.ui.funzione.mestieri}</h2>
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {MESTIERI.map((m) => (
            <li key={m}>
              <a href={p(percorsoMestiere(m))} className="flex min-h-11 items-center rounded-full border border-linea-2 bg-superficie px-4 text-[16px] font-semibold no-underline hover:border-inchiostro">
                {c.mestieri[m].nome}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <CtaFinale d={d} lingua={lingua} titolo={d.candidatura.titolo} testo={c.ui.mestiere.ctaTesto} />
      <JsonLd dati={grafo(briciole(lingua, vie), applicazione(lingua))} />
    </Guscio>
  );
}
