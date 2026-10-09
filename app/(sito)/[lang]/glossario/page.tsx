import type { Metadata } from "next";
import { Ricco, testoPiano } from "@/components/Ricco";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { linguaValida } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { briciole, grafo } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/glossario">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  const G = (await contenutiDi(lingua)).glossario;
  return metadati({ lingua, p: "/glossario", titolo: G.meta.titolo, descrizione: G.meta.descrizione });
}

const slugTermine = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// Glossario su una pagina sola: il termine resta in italiano (è la parola del preventivo), la definizione è nella lingua della pagina.
export default async function Glossario({ params }: PageProps<"/[lang]/glossario">) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  const c = await contenutiDi(lingua);
  const G = c.glossario;
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.glossario, p: "/glossario" },
  ];
  const termini = [...G.termini].sort((a, b) => a.termine.localeCompare(b.termine, "it"));
  const lettere = [...new Set(termini.map((t) => t.termine[0].toUpperCase()))];
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={G.h1} sottotitolo={G.intro} />
      <div className="margini flex flex-col gap-10 py-14 lg:py-20">
        <nav aria-label={c.ui.glossario.lettere} className="sticky top-16 z-10 -mx-1 bg-fondo/95 py-2 backdrop-blur lg:top-20">
          <ul lang="it" className="m-0 flex list-none flex-wrap gap-1 p-0">
            {lettere.map((l) => (
              <li key={l}>
                <a href={`#lettera-${l}`} className="flex size-10 items-center justify-center rounded-campo font-bold no-underline hover:bg-fondo-2">
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {lettere.map((l) => (
          <section key={l} id={`lettera-${l}`} aria-label={l} className="grid gap-4 border-t border-linea-2 pt-6 lg:grid-cols-[80px_minmax(0,760px)]">
            <p lang="it" className="m-0 text-[40px] font-black leading-none text-lime-scuro [font-stretch:70%]">
              {l}
            </p>
            <dl className="m-0 flex flex-col gap-6">
              {termini
                .filter((t) => t.termine[0].toUpperCase() === l)
                .map((t) => (
                  <div key={t.termine} id={slugTermine(t.termine)}>
                    <dt lang="it" className="text-[20px] font-extrabold [font-stretch:85%]">
                      {t.termine}
                    </dt>
                    <dd className="m-0 mt-1.5 text-[17px] leading-relaxed text-testo-2">
                      <Ricco testo={t.definizione} lingua={lingua} classeLink="font-semibold text-cielo-scuro" />
                    </dd>
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </div>
      <JsonLd
        dati={grafo(briciole(lingua, vie), {
          "@type": "DefinedTermSet",
          name: G.h1,
          inLanguage: lingua,
          hasDefinedTerm: termini.map((t) => ({ "@type": "DefinedTerm", name: t.termine, description: testoPiano(t.definizione) })),
        })}
      />
    </Guscio>
  );
}
