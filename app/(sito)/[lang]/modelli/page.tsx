import type { Metadata } from "next";
import { Guscio } from "@/components/sito/Guscio";
import { JsonLd } from "@/components/sito/JsonLd";
import { Punti } from "@/components/sito/Punti";
import { TestaPagina } from "@/components/sito/TestaPagina";
import { contenutiDi } from "@/lib/contenuti";
import { MESTIERI, percorsoMestiere, SLUG_MESTIERE } from "@/lib/contenuti/registro";
import { linguaValida, percorso } from "@/lib/i18n/lingue";
import { dizionarioDi } from "@/lib/i18n/server";
import { fmt } from "@/lib/i18n/testo";
import { briciole, grafo } from "@/lib/json-ld";
import { metadati } from "@/lib/seo";
import { SITE_URL } from "@/lib/sito";

export async function generateMetadata({ params }: PageProps<"/[lang]/modelli">): Promise<Metadata> {
  const lingua = linguaValida((await params).lang);
  const P = (await contenutiDi(lingua)).pagine.modelli;
  return metadati({ lingua, p: "/modelli", titolo: P.meta.titolo, descrizione: P.meta.descrizione });
}

// Modelli di preventivo da scaricare, uno per mestiere (file in public/modelli/, generati da
// scripts/genera-modelli.ts). I modelli sono in italiano in tutte le lingue: è la lingua del preventivo.
export default async function Modelli({ params }: PageProps<"/[lang]/modelli">) {
  const lingua = linguaValida((await params).lang);
  const d = dizionarioDi(lingua);
  const c = await contenutiDi(lingua);
  const P = c.pagine.modelli;
  const vie = [
    { nome: c.ui.home, p: "/" },
    { nome: d.nav.modelli, p: "/modelli" },
  ];
  return (
    <Guscio d={d} c={c} lingua={lingua}>
      <TestaPagina lingua={lingua} briciole={vie} etichettaBriciole={d.comune.briciole} h1={P.h1} sottotitolo={P.testo} />
      <section className="margini py-14 lg:py-20">
        <ul className="m-0 grid list-none gap-px overflow-hidden rounded-[20px] border border-linea-2 bg-linea-2 p-0 md:grid-cols-2">
          {MESTIERI.map((m) => {
            const nome = c.mestieri[m].nome;
            const nomeMin = lingua === "de" ? nome : nome.toLocaleLowerCase(lingua);
            return (
              <li key={m} className="flex flex-col gap-4 bg-superficie p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="m-0 text-[22px] font-extrabold [font-stretch:80%]">{nome}</h2>
                  <a href={percorso(lingua, percorsoMestiere(m))} className="text-[15px] font-semibold text-cielo-scuro">
                    {c.mestieri[m].meta.titolo}
                  </a>
                </div>
                <div className="flex shrink-0 gap-2">
                  <a
                    href={`/modelli/${SLUG_MESTIERE[m]}.pdf`}
                    download
                    aria-label={fmt(P.scarica, { mestiere: nomeMin, formato: P.pdf })}
                    className="bottone bottone-azione min-h-11 px-4 py-2 text-[16px]"
                  >
                    {P.pdf}
                  </a>
                  <a
                    href={`/modelli/${SLUG_MESTIERE[m]}.xlsx`}
                    download
                    aria-label={fmt(P.scarica, { mestiere: nomeMin, formato: P.excel })}
                    className="bottone min-h-11 border-[1.5px] border-inchiostro px-4 py-2 text-[16px] no-underline"
                  >
                    {P.excel}
                  </a>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="margini flex flex-col gap-8 bg-fondo-2 py-14 lg:py-20">
        <h2 className="titolo-h2 m-0">{P.cosaContiene.titolo}</h2>
        <Punti punti={P.cosaContiene.punti} lingua={lingua} colonne={3} />
        <p className="m-0 max-w-[760px] text-[17px] leading-relaxed text-testo-2">{P.nota}</p>
      </section>
      <JsonLd
        dati={grafo(
          briciole(lingua, vie),
          ...MESTIERI.map((m) => ({
            "@type": "DigitalDocument",
            name: `Modello preventivo ${c.mestieri[m].nome.toLowerCase()} (PDF)`,
            inLanguage: "it",
            isAccessibleForFree: true,
            encodingFormat: "application/pdf",
            url: new URL(`/modelli/${SLUG_MESTIERE[m]}.pdf`, SITE_URL).toString(),
          })),
        )}
      />
    </Guscio>
  );
}
