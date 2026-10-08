import { CONTACT_EMAIL, linkWhatsAppProva } from "@/lib/sito";
import { ModuloCandidatura } from "./ModuloCandidatura";
import { PiePagina } from "./PiePagina";
import { SoloDesktop } from "./Varianti";

export function Candidatura() {
  return (
    <section
      id="candidatura"
      className="margini flex flex-col gap-6 bg-fondo-2 pb-7 pt-14 lg:gap-[72px] lg:pb-12 lg:pt-28"
    >
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-[clamp(40px,5vw,72px)] lg:gap-y-7">
        <h2 className="titolo-finale m-0 lg:col-start-1">Il prossimo preventivo mandalo dal furgone.</h2>
        <p className="m-0 max-w-[520px] text-[17px] leading-normal lg:col-start-1 lg:text-xl">
          Cerchiamo 10 artigiani in Monza e Brianza per il programma pilota. Lasciaci i tuoi dati:
          ti richiamiamo noi<SoloDesktop> per capire se fa per te</SoloDesktop>.
        </p>
        <div className="lg:col-start-2 lg:row-span-3 lg:row-start-1">
          <ModuloCandidatura />
        </div>
        <div className="flex flex-col gap-3 text-[15px] lg:col-start-1 lg:row-start-3 lg:text-[17px]">
          <p className="m-0">
            Vuoi vederlo prima di candidarti?{" "}
            <a href={linkWhatsAppProva()} target="_blank" rel="noopener noreferrer" className="font-bold">
              Provalo su WhatsApp
            </a>
            : il primo messaggio è già scritto, premi invio e poi racconta un sopralluogo. Oppure{" "}
            <a href="/prova" className="font-bold">
              prova con un esempio
            </a>
            .
          </p>
          <p className="m-0">
            Preferisci scrivere?{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
      <PiePagina>PreventivoLampo è un servizio di K Digital Solution · Monza (MB)</PiePagina>
    </section>
  );
}
