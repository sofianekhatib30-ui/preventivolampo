import { Ricco } from "@/components/Ricco";
import type { Dizionario } from "@/lib/i18n/it";
import { fmt } from "@/lib/i18n/testo";
import { CONTACT_EMAIL, linkWhatsAppProva } from "@/lib/sito";
import { ModuloCandidatura } from "./ModuloCandidatura";
import { PiePagina } from "./PiePagina";

export function Candidatura({ d }: { d: Dizionario }) {
  const C = d.candidatura;
  return (
    <section id="candidatura" className="margini flex flex-col gap-6 bg-fondo-2 pb-7 pt-14 lg:gap-[72px] lg:pb-12 lg:pt-28">
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-[clamp(40px,5vw,72px)] lg:gap-y-7">
        <h2 className="titolo-finale m-0 lg:col-start-1">{C.titolo}</h2>
        <p className="m-0 max-w-[520px] text-[17px] leading-normal lg:col-start-1 lg:text-xl">{C.testo}</p>
        <div className="lg:col-start-2 lg:row-span-3 lg:row-start-1">
          <ModuloCandidatura />
        </div>
        <div className="flex flex-col gap-3 text-[15px] lg:col-start-1 lg:row-start-3 lg:text-[17px]">
          <p className="m-0">
            <Ricco testo={fmt(C.vederlo, { whatsapp: linkWhatsAppProva() })} classeLink="font-bold" />
          </p>
          <p className="m-0">
            <Ricco testo={fmt(C.scrivere, { email: CONTACT_EMAIL })} classeLink="font-bold" />
          </p>
        </div>
      </div>
      <PiePagina d={d}>{d.comune.servizioDi}</PiePagina>
    </section>
  );
}
