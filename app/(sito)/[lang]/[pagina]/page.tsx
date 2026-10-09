import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Ricco } from "@/components/Ricco";
import { CtaFinale } from "@/components/sito/CtaFinale";
import { ElencoDomande } from "@/components/sito/ElencoDomande";
import { EsempioBozza } from "@/components/sito/EsempioBozza";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { Punti } from "@/components/sito/Punti";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { ESEMPI } from "@/lib/contenuti/esempi";
import {
  FUNZIONI,
  GUIDE_MESTIERE,
  MESTIERI,
  mestiereDaSlug,
  percorsoFunzione,
  percorsoGuida,
  percorsoMestiere,
  SLUG_MESTIERE,
  VICINI,
} from "@/lib/contenuti/registro";
import { INFO_LINGUA, LINGUE_SITO, linguaValida, percorso } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/testo";
import { briciole, grafo } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";

// Pagine «Preventivo <mestiere>»: /preventivo-elettricista, /ro/preventivo-elettricista…
// Testi in lib/contenuti/it/mestieri/, esempio ricavato dal sistema in lib/contenuti/esempi/.
export const dynamicParams = false;

export function generateStaticParams() {
  return LINGUE_SITO.flatMap((lang) => MESTIERI.map((m) => ({ lang, pagina: SLUG_MESTIERE[m] })));
}

async function carica(params: PageProps<"/[lang]/[pagina]">["params"]) {
  const { lang, pagina } = await params;
  const id = mestiereDaSlug(pagina);
  if (!id) notFound();
  const lingua = linguaValida(lang);
  const c = await contenutiDi(lingua);
  return { id, lingua, c, m: c.mestieri[id] };
}

export async function generateMetadata({ params }: PageProps<"/[lang]/[pagina]">): Promise<Metadata> {
  const { id, lingua, m } = await carica(params);
  return metadati({ lingua, p: percorsoMestiere(id), titolo: m.meta.titolo, descrizione: m.meta.descrizione });
}

// Le lingue in cui il cliente può ricevere il preventivo, con la bandiera.
const LINGUE_CLIENTE = ["en", "de", "fr", "es", "nl"] as const;

export default async function PaginaMestiere({ params }: PageProps<"/[lang]/[pagina]">) {
  const { id, lingua, c, m } = await carica(params);
  const d = dizionarioDi(lingua);
  const U = c.ui.mestiere;
  const p = (x: string) => percorso(lingua, x);
  const esempio = ESEMPI[id];
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.mestieri, p: "/mestieri" },
    { nome: m.nome, p: percorsoMestiere(id) },
  ];
  const slug = SLUG_MESTIERE[id];
  // Dentro una frase il mestiere va minuscolo, tranne in tedesco (nomi maiuscoli) e nelle lingue senza maiuscole.
  const nomeMin = lingua === "de" ? m.nome : m.nome.toLocaleLowerCase(lingua);
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={m.h1} sottotitolo={m.sottotitolo}>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href={p("/#candidatura")} className="bottone bottone-azione-scuro py-4 text-[17px]">
            {d.comune.ctaPilota}
          </a>
          <a href="#esempio" className="bottone border-[1.5px] border-scuro-linea py-4 text-[17px] text-fondo no-underline hover:border-lime">
            {m.esempio.titolo}
          </a>
        </div>
      </TestaPagina>

      {esempio && (
        <section id="esempio" aria-labelledby="esempio-titolo" className="margini flex flex-col gap-8 py-14 lg:gap-10 lg:py-24">
          <div className="flex max-w-[760px] flex-col gap-4">
            <h2 id="esempio-titolo" className="titolo-h2 m-0">
              {m.esempio.titolo}
            </h2>
            <p className="testo-base m-0 text-testo-2">{m.esempio.intro}</p>
          </div>
          <EsempioBozza c={c} lingua={lingua} lavoro={m.esempio.lavoro} esempio={esempio} etichettaVoci={d.demo.voci} />
        </section>
      )}

      <section id="voci" aria-labelledby="voci-titolo" className="margini flex flex-col gap-8 bg-fondo-2 py-14 lg:py-24">
        <div className="flex max-w-[760px] flex-col gap-4">
          <h2 id="voci-titolo" className="titolo-h2 m-0">
            {m.voci.titolo}
          </h2>
          <p className="testo-base m-0 text-testo-2">{m.voci.intro}</p>
        </div>
        <div className="overflow-hidden rounded-[20px] border border-linea-2 bg-superficie">
          <table className="w-full border-collapse text-start">
            <thead className="sr-only sm:not-sr-only">
              <tr className="border-b border-linea-2 bg-fondo text-[14px] text-testo-3">
                <th scope="col" className="px-5 py-3 text-start font-semibold">
                  {U.colVoce}
                </th>
                <th scope="col" className="px-3 py-3 text-start font-semibold">
                  {U.colUnita}
                </th>
                <th scope="col" className="px-5 py-3 text-start font-semibold">
                  {U.colNota}
                </th>
              </tr>
            </thead>
            <tbody>
              {m.voci.righe.map((r) => (
                <tr key={r.voce} className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-riga last:border-0 sm:table-row">
                  <th scope="row" lang="it" className="px-5 pb-1 pt-4 text-start align-top text-[16.5px] font-bold leading-snug sm:py-4">
                    {r.voce}
                  </th>
                  <td lang="it" className="px-5 pb-1 pt-4 text-end align-top font-mono text-[15px] font-semibold text-testo-2 sm:px-3 sm:py-4 sm:text-start">
                    {r.unita}
                  </td>
                  <td className="col-span-2 px-5 pb-4 align-top text-[15.5px] leading-normal text-testo-2 sm:py-4">{r.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="prezzare" aria-labelledby="prezzare-titolo" className="margini flex flex-col gap-10 py-14 lg:py-24">
        <div className="flex max-w-[760px] flex-col gap-4">
          <h2 id="prezzare-titolo" className="titolo-h2 m-0">
            {m.prezzare.titolo}
          </h2>
          <p className="testo-base m-0 text-testo-2">{m.prezzare.intro}</p>
        </div>
        <Punti punti={m.prezzare.punti} lingua={lingua} colonne={3} />
      </section>

      <section id="documenti" aria-labelledby="documenti-titolo" className="margini grid gap-8 bg-fondo-2 py-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16 lg:py-24">
        <div className="flex flex-col gap-4">
          <h2 id="documenti-titolo" className="titolo-h2 m-0">
            {m.documenti.titolo}
          </h2>
          <p className="testo-base m-0 text-testo-2">{m.documenti.intro}</p>
          <p className="m-0 rounded-campo border border-ambra-bordo bg-ambra px-4 py-3 text-[15px] leading-normal text-ambra-testo">{m.documenti.avvertenza}</p>
        </div>
        <dl className="m-0 flex flex-col divide-y divide-linea-2 border-y border-linea-2">
          {m.documenti.punti.map((pt) => (
            <div key={pt.titolo} className="py-5">
              <dt className="text-[19px] font-extrabold [font-stretch:85%]">{pt.titolo}</dt>
              <dd className="m-0 mt-2 text-[16.5px] leading-relaxed text-testo-2">
                <Ricco testo={pt.testo} lingua={lingua} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="straniero-titolo" className="margini grid items-center gap-6 py-14 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-4">
          <h2 id="straniero-titolo" className="titolo-h2 m-0">
            {m.straniero.titolo}
          </h2>
          <p className="testo-base m-0 text-testo-2">
            <Ricco testo={m.straniero.testo} lingua={lingua} />
          </p>
          <a href={p(percorsoFunzione("preventivo-in-lingua-del-cliente"))} className="self-start text-[17px] font-bold text-cielo-scuro">
            {c.funzioni["preventivo-in-lingua-del-cliente"].nome}
          </a>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-3 p-0" aria-label={c.funzioni["preventivo-in-lingua-del-cliente"].nome}>
          {LINGUE_CLIENTE.map((l) => (
            <li key={l} lang={l} className="flex items-center gap-2.5 rounded-full border border-linea-2 bg-superficie py-2 pe-4 ps-2 text-[16px] font-semibold">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/bandiere/${INFO_LINGUA[l].bandiera}.svg`} alt="" width={28} height={28} className="size-7 rounded-full object-cover ring-1 ring-black/10" />
              {INFO_LINGUA[l].nome}
            </li>
          ))}
        </ul>
      </section>

      <section id="modello" aria-labelledby="modello-titolo" className="margini py-4 lg:py-8">
        <div className="flex flex-col gap-5 rounded-[24px] border-2 border-dashed border-linea-2 bg-superficie p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:p-10">
          <div className="flex max-w-[640px] flex-col gap-3">
            <h2 id="modello-titolo" className="m-0 text-[26px] font-extrabold leading-tight [font-stretch:80%] lg:text-[32px]">
              {fmt(U.modelloTitolo, { mestiere: nomeMin })}
            </h2>
            <p className="m-0 text-[16.5px] leading-relaxed text-testo-2">{U.modelloTesto}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <a href={`/modelli/${slug}.pdf`} download className="bottone bottone-azione py-4 text-[17px]">
              {fmt(c.pagine.modelli.scarica, { mestiere: nomeMin, formato: c.pagine.modelli.pdf })}
            </a>
            <a href={`/modelli/${slug}.xlsx`} download className="bottone border-[1.5px] border-inchiostro py-4 text-[17px] no-underline">
              {c.pagine.modelli.excel}
            </a>
          </div>
        </div>
      </section>

      <ElencoDomande titolo={m.domande.titolo} voci={m.domande.voci} lingua={lingua} />

      <section aria-label={U.vicini} className="margini grid gap-10 border-t border-linea-2 py-14 md:grid-cols-3 lg:py-20">
        <Collegamenti
          titolo={U.vicini}
          voci={VICINI[id].map((v) => ({ href: p(percorsoMestiere(v)), nome: c.mestieri[v].nome, riga: c.mestieri[v].riga }))}
        />
        <Collegamenti titolo={U.funzioni} voci={FUNZIONI.map((f) => ({ href: p(percorsoFunzione(f)), nome: c.funzioni[f].nome, riga: c.funzioni[f].riga }))} />
        <Collegamenti titolo={U.guide} voci={GUIDE_MESTIERE.map((g) => ({ href: p(percorsoGuida(g)), nome: c.guide[g].nome, riga: c.guide[g].riga }))} />
      </section>

      <CtaFinale d={d} lingua={lingua} titolo={fmt(U.ctaTitolo, { mestiere: nomeMin })} testo={U.ctaTesto} />
      <JsonLd dati={grafo(briciole(lingua, vie))} />
    </Guscio>
  );
}

function Collegamenti({ titolo, voci }: { titolo: string; voci: { href: string; nome: string; riga: string }[] }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="m-0 text-[20px] font-extrabold [font-stretch:85%]">{titolo}</h2>
      <ul className="m-0 flex list-none flex-col gap-4 p-0">
        {voci.map((v) => (
          <li key={v.href}>
            <a href={v.href} className="text-[17px] font-bold text-cielo-scuro">
              {v.nome}
            </a>
            <p className="m-0 mt-1 text-[15px] leading-snug text-testo-3">{v.riga}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
