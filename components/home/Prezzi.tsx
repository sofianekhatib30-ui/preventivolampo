import { Frasi } from "@/components/Frasi";
import { Suspense } from "react";
import type { Dizionario } from "@/lib/i18n/it";
import { fmt } from "@/lib/i18n/testo";
import { leggiPostiLiberi, POSTI_PILOTA } from "@/lib/impresa/posti";
import { candidatureAperte } from "@/lib/sito";

const cardChiara = "flex flex-col gap-2.5 rounded-[20px] border border-linea bg-superficie p-6 lg:gap-[18px] lg:rounded-card lg:p-10";
const titoloCard = "m-0 text-2xl font-extrabold [font-stretch:78%] lg:text-[28px]";
const cifra = "whitespace-nowrap [font-weight:850] leading-none [font-stretch:68%]";
const listaDesktop = "m-0 hidden list-disc ps-5 text-base leading-[1.8] text-testo-2 lg:block";
const notaDesktop = "m-0 mt-auto hidden text-sm leading-normal text-testo-3 lg:block";

export function Prezzi({ d }: { d: Dizionario }) {
  const P = d.prezzi;
  const aperte = candidatureAperte();
  return (
    <section id="prezzi" className="margini flex flex-col gap-4 bg-fondo-2 py-14 lg:gap-12 lg:py-28">
      <div className="flex max-w-[760px] flex-col gap-4">
        <h2 className="titolo-h2 m-0 mb-2 lg:mb-0"><Frasi testo={P.titolo} /></h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
        <article className="su-scuro flex flex-col gap-3 rounded-[20px] bg-ardesia p-6 text-fondo lg:gap-[18px] lg:rounded-card lg:p-10">
          <Suspense fallback={<PostiPilota posti={null} P={P} />}>
            <PostiDalDatabase P={P} />
          </Suspense>
          <h3 className="m-0 text-[26px] font-extrabold [font-stretch:78%] lg:text-[32px]">{P.pilota}</h3>
          <p className="m-0 flex items-baseline gap-2 lg:gap-2.5">
            <span className={`${cifra} text-[56px] lg:text-[72px]`}>0 €</span>
            <span className="text-base text-scuro-testo lg:text-lg">{P.perGiorni}</span>
          </p>
          <p className="m-0 text-base leading-[1.55] text-scuro-testo lg:text-[17px]">{P.pilotaTesto}</p>
          <a href={aperte ? "#candidatura" : "/prova"} className="bottone bottone-azione-scuro mt-auto py-[15px] text-[17px] lg:py-4">
            {aperte ? P.candidati : d.comune.ctaProva}
          </a>
        </article>

        <article className={cardChiara}>
          <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-[18px]">
            <h3 className={titoloCard}>{P.mensile}</h3>
            <p className="m-0 flex flex-wrap items-baseline gap-x-2.5">
              <span className={`${cifra} text-4xl lg:text-[64px]`}>
                19,90 €<span className="text-base font-medium [font-stretch:100%] lg:hidden"> {P.perMese}</span>
              </span>
              <span className="hidden text-base text-testo-3 lg:inline">{P.alMese}</span>
            </p>
          </div>
          <ul className={listaDesktop}>
            {P.mensileVoci.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <p className={notaDesktop}>{P.mensileNota}</p>
          <p className="m-0 text-[15px] leading-[1.55] text-testo-2 lg:hidden">
            {P.mensileVoci.join(", ")}. {P.mensileNota}
          </p>
        </article>

        <article className={cardChiara}>
          <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-[18px]">
            <h3 className={titoloCard}>{P.annuale}</h3>
            <p className="m-0 flex flex-wrap items-baseline gap-x-2.5">
              <span className={`${cifra} text-4xl lg:text-[64px]`}>
                199 €<span className="text-base font-medium [font-stretch:100%] lg:hidden"> {P.perAnno}</span>
              </span>
              <span className="hidden text-base text-testo-3 lg:inline">{P.allAnno}</span>
            </p>
          </div>
          <ul className={listaDesktop}>
            {P.annualeVoci.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
          <p className={notaDesktop}>{P.ivaEsclusa}</p>
          <p className="m-0 text-[15px] leading-[1.55] text-testo-2 lg:hidden">{P.annualeVoci.join(", ")}.</p>
        </article>
      </div>
      <p className="m-0 text-[13px] text-testo-3 lg:hidden">{P.ivaEsclusa}</p>
    </section>
  );
}

// Contatore dei posti del pilota. Il numero viene dal database (imprese accettate nel pilota);
// se non è disponibile resta la scritta fissa, senza numero inventato.
async function PostiDalDatabase({ P }: { P: Dizionario["prezzi"] }) {
  return <PostiPilota posti={await leggiPostiLiberi()} P={P} />;
}

function etichetta(posti: number, P: Dizionario["prezzi"]) {
  if (posti <= 0) return P.esauriti;
  if (posti === 1) return fmt(P.ultimoPosto, { totale: POSTI_PILOTA });
  return fmt(P.postiLiberi, { n: posti, totale: POSTI_PILOTA });
}

function PostiPilota({ posti, P }: { posti: number | null; P: Dizionario["prezzi"] }) {
  return (
    <>
      <p className="m-0 self-start rounded-full border border-cielo px-2.5 py-[5px] font-mono text-xs font-semibold text-cielo lg:px-3 lg:py-1.5 lg:text-[13px]">
        {posti === null ? fmt(P.posti, { n: POSTI_PILOTA }) : etichetta(posti, P)}
      </p>
      {posti !== null && (
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: POSTI_PILOTA }, (_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${i < POSTI_PILOTA - posti ? "bg-cielo" : "border border-cielo/50"}`} />
          ))}
        </div>
      )}
    </>
  );
}
