import type { Metadata } from "next";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { ORDINE_FAMIGLIE, PAGINA_DEL_MESTIERE } from "@/lib/contenuti/famiglie";
import { percorsoMestiere } from "@/lib/contenuti/registro";
import { linguaValida, percorso } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { ELENCO_MESTIERI, type Famiglia } from "@/lib/impresa/mestieri";
import { briciole, grafo } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";

// Un'unica pagina con tutti i mestieri che Preventivi conosce, per famiglia (Sofiane, 11/10/2026: «i mestieri li voglio
// tutti quanti e non penso che serva una pagina per ciascuno ma ne basta una»). L'elenco è il catalogo del modulo
// (lib/impresa/mestieri.ts), con i nomi tradotti del dizionario: un mestiere aggiunto lì compare qui da solo.
// I mestieri che hanno anche la pagina con le voci tipiche portano lì. Ordine delle famiglie in lib/contenuti/famiglie.ts.

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
  const nomi = d.area.modulo.mestieri as Record<string, string>;
  const famiglie = d.area.modulo.famiglie as Record<Famiglia, string>;
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.mestieri, p: "/mestieri" },
  ];
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={P.h1} sottotitolo={P.testo} />
      <section className="margini flex flex-col gap-8 py-14 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ORDINE_FAMIGLIE.map((f) => {
            const voci = ELENCO_MESTIERI.filter((m) => m.famiglia === f);
            return (
              <section key={f} id={f} aria-labelledby={`famiglia-${f}`} className="flex scroll-mt-24 flex-col gap-4 rounded-[20px] border border-linea-2 bg-superficie p-6 text-center">
                <h2 id={`famiglia-${f}`} className="m-0 text-[26px] leading-tight">
                  {famiglie[f]}
                </h2>
                <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0">
                  {voci.map((m) => {
                    const nome = nomi[m.chiave] ?? m.nome;
                    const pagina = PAGINA_DEL_MESTIERE[m.chiave];
                    return (
                      <li key={m.chiave}>
                        {pagina ? (
                          <a
                            href={percorso(lingua, percorsoMestiere(pagina))}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-full border-[1.5px] border-lime-scuro bg-fondo px-3.5 text-[15px] font-semibold text-inchiostro no-underline hover:bg-lime"
                          >
                            {nome}
                            <span aria-hidden="true" className="text-lime-scuro rtl:-scale-x-100">
                              →
                            </span>
                          </a>
                        ) : (
                          <span className="inline-flex min-h-10 items-center rounded-full border border-linea-2 bg-fondo px-3.5 text-[15px] text-testo-2">{nome}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
        <p className="m-0 max-w-[720px] text-[17px] leading-relaxed text-testo-2">{P.altro}</p>
      </section>
      <JsonLd dati={grafo(briciole(lingua, vie))} />
    </Guscio>
  );
}
