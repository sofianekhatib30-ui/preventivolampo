import type { ReactNode } from "react";
import { SoloDesktop } from "./Varianti";

type Passo = { numero: string; titolo: string; testo: ReactNode; nota: string };

const PASSI: Passo[] = [
  {
    numero: "01",
    titolo: "Racconti il lavoro",
    testo: "A voce o per iscritto, dal telefono, appena finito il sopralluogo: misure, lavori, cosa porta il cliente, cosa è escluso.",
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
      className="margini flex flex-col gap-7 bg-superficie py-14 lg:gap-14 lg:py-24"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <h2 className="titolo-h2 m-0 max-w-[720px]">
          Dal vocale al preventivo accettato, in quattro passaggi.
        </h2>
        <p className="m-0 hidden max-w-[380px] text-lg leading-normal text-testo-2 lg:block">
          Tu racconti e controlli. Conti, listino, IVA, PDF e invio li fa il sistema.
        </p>
      </div>
      <ol className="m-0 grid list-none gap-3 p-0 lg:grid-cols-2 lg:gap-5 xl:grid-cols-4">
        {PASSI.map((passo) => (
          <li
            key={passo.numero}
            className="flex flex-col gap-2 rounded-[18px] border border-linea bg-fondo p-5 lg:gap-4 lg:rounded-[20px] lg:p-7"
          >
            <span className="font-mono text-[15px] font-semibold text-lime-scuro lg:text-base">{passo.numero}</span>
            <h3 className="m-0 text-2xl font-extrabold [font-stretch:80%] lg:text-[26px]">
              {passo.titolo}
            </h3>
            <p className="m-0 text-base leading-normal text-testo-2">{passo.testo}</p>
            <span className="mt-auto hidden font-mono text-sm text-testo-3 lg:block">
              {passo.nota}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
