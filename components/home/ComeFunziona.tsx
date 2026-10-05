import type { ReactNode } from "react";
import { SoloDesktop, SoloMobile } from "./Varianti";

type Passo = { numero: string; titolo: string; testo: ReactNode; nota: string };

const PASSI: Passo[] = [
  {
    numero: "01",
    titolo: "Parli come parli",
    testo: (
      <>
        Un vocale dopo il sopralluogo<SoloDesktop>. Misure</SoloDesktop>
        <SoloMobile>: misure</SoloMobile> a voce, lavori, cosa porta il cliente, cosa è escluso.
      </>
    ),
    nota: "«tre per due e mezzo, più o meno»",
  },
  {
    numero: "02",
    titolo: "Ti chiede cosa manca",
    testo: (
      <>
        Se una quantità non è chiara non la indovina: ti fa una domanda secca
        <SoloDesktop> e aspetta la risposta</SoloDesktop>.
      </>
    ),
    nota: "«Quanti m² di pavimento?»",
  },
  {
    numero: "03",
    titolo: "Controlli dal telefono",
    testo: "Voce per voce: correggi, togli, aggiungi. Quello che non è nel tuo listino è evidenziato.",
    nota: "Modifica · Approva",
  },
  {
    numero: "04",
    titolo: "Il cliente accetta",
    testo:
      "Riceve il PDF con il tuo logo e un link per accettarlo. Tu vedi quando lo apre e quando dice sì.",
    nota: "Inviato · Visto · Accettato",
  },
];

export function ComeFunziona() {
  return (
    <section
      id="come"
      className="su-scuro margini flex flex-col gap-7 bg-inchiostro py-14 text-fondo lg:gap-14 lg:py-24"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h2 className="titolo-h2 m-0 max-w-[720px]">
          Dal vocale al preventivo accettato, in quattro passaggi.
        </h2>
        <p className="m-0 hidden max-w-[380px] text-lg leading-normal text-scuro-testo lg:block">
          Tu parli e controlli. Il resto — misure, listino, IVA, PDF, invio — lo fa il sistema.
        </p>
      </div>
      <ol className="m-0 grid list-none gap-3 p-0 lg:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        {PASSI.map((passo) => (
          <li
            key={passo.numero}
            className="flex flex-col gap-2 rounded-[18px] border border-scuro-linea p-5 lg:gap-4 lg:rounded-[20px] lg:p-7"
          >
            <span className="font-mono text-[13px] text-segnale lg:text-sm">{passo.numero}</span>
            <h3 className="m-0 text-2xl font-extrabold [font-stretch:80%] lg:text-[26px]">
              {passo.titolo}
            </h3>
            <p className="m-0 text-base leading-normal text-scuro-testo">{passo.testo}</p>
            <span className="mt-auto hidden font-mono text-[13px] text-scuro-nota lg:block">
              {passo.nota}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
