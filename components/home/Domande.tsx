import { Ricco } from "@/components/Ricco";
import type { Dizionario } from "@/lib/i18n/it";
import { fmt } from "@/lib/i18n/testo";
import { CONTACT_EMAIL } from "@/lib/sito";

// Accordion con details/summary: la prima domanda aperta, le altre chiuse.
export function Domande({ d }: { d: Dizionario }) {
  const D = d.domande;
  const nonTrovi = fmt(D.nonTrovi, { email: CONTACT_EMAIL });
  return (
    <section id="domande" className="margini grid gap-5 py-14 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-20 lg:py-28">
      <div className="flex flex-col gap-6">
        <h2 className="titolo-h2 m-0">{D.titolo}</h2>
        <p className="m-0 hidden text-[17px] leading-[1.55] text-testo-2 lg:block">
          <Ricco testo={nonTrovi} classeLink="font-bold" />
        </p>
      </div>
      <div className="flex flex-col border-b border-linea-2">
        {D.lista.map((voce, indice) => (
          <details key={indice} open={indice === 0} className={`group ${indice === 0 ? "border-t-2 border-ardesia" : "border-t border-linea-2"}`}>
            <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-[18px] lg:py-6 [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 text-xl [font-weight:750] [font-stretch:85%] lg:text-2xl">{voce.d}</h3>
              <svg
                viewBox="0 0 20 20"
                aria-hidden="true"
                focusable="false"
                className="mt-1 size-5 shrink-0 motion-safe:transition-transform group-open:rotate-45"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M10 3v14M3 10h14" />
              </svg>
            </summary>
            <p className="m-0 -mt-3 pb-[18px] text-[15.5px] leading-[1.55] text-testo-2 lg:-mt-3.5 lg:pb-6 lg:text-[17px]">
              <Ricco testo={voce.r} />
            </p>
          </details>
        ))}
      </div>
      <p className="m-0 text-[15.5px] leading-[1.55] text-testo-2 lg:hidden">
        <Ricco testo={nonTrovi} classeLink="font-bold" />
      </p>
    </section>
  );
}
