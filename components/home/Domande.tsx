import type { ReactNode } from "react";
import { CONTACT_EMAIL } from "@/lib/sito";
import { SoloDesktop, SoloMobile } from "./Varianti";

type Domanda = { domanda: ReactNode; risposta: ReactNode };

const DOMANDE: Domanda[] = [
  {
    domanda: "E se sbaglia?",
    risposta: (
      <>
        Al cliente non arriva niente senza la tua approvazione. Le voci incerte le vedi evidenziate
        e i prezzi vengono solo dal tuo listino.
        <SoloDesktop> Il controllo finale è sempre tuo.</SoloDesktop>
      </>
    ),
  },
  {
    domanda: "Parlo veloce, c'è rumore, uso termini miei.",
    risposta: (
      <>
        Il sistema conosce le voci del tuo listino<SoloDesktop> e i nomi che usi tu</SoloDesktop>.
        Se una misura non è chiara, te la richiede invece di
        <SoloDesktop> tirare a</SoloDesktop> indovinare.
      </>
    ),
  },
  {
    domanda: "Devo installare qualcosa?",
    risposta: (
      <>
        No. Usi WhatsApp come fai già, e la bozza si apre nel browser del telefono.{" "}
        <SoloDesktop>Il tuo cliente non deve registrarsi: apre il link e accetta.</SoloDesktop>
        <SoloMobile>Il cliente apre il link e accetta, senza registrarsi.</SoloMobile>
      </>
    ),
  },
  {
    domanda: (
      <>
        <SoloDesktop>Dove finiscono i vocali e i dati dei miei clienti?</SoloDesktop>
        <SoloMobile>Dove finiscono vocali e dati?</SoloMobile>
      </>
    ),
    risposta: (
      <>
        Su server nell&apos;Unione Europea. Gli audio vengono cancellati dopo 30 giorni, e con te
        firmiamo l&apos;accordo per il trattamento dei dati
        <SoloDesktop> dei tuoi clienti</SoloDesktop>.
      </>
    ),
  },
  {
    domanda: (
      <>
        Devo cambiare <SoloDesktop>il </SoloDesktop>programma delle fatture?
      </>
    ),
    risposta: (
      <>
        No, tieni il tuo. PreventivoLampo si occupa dei preventivi
        <SoloDesktop>; le fatture restano dove sono</SoloDesktop>.
      </>
    ),
  },
  {
    domanda: "Va bene anche per elettricisti e imbianchini?",
    risposta: (
      <>
        Sì, se lavori a voci e misure. Partiamo da bagni, impianti e ristrutturazioni
        <SoloDesktop> in Monza e Brianza</SoloDesktop>: se fai altro, candidati lo stesso
        <SoloDesktop> e ne parliamo</SoloDesktop>.
      </>
    ),
  },
];

// Accordion con details/summary: la prima domanda aperta, le altre chiuse (SPEC, «Domande»).
export function Domande() {
  return (
    <section
      id="domande"
      className="margini grid gap-5 py-14 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-20 lg:py-28"
    >
      <div className="flex flex-col gap-6">
        <h2 className="titolo-h2 m-0">Le domande che ci fanno tutti</h2>
        <p className="m-0 hidden text-[17px] leading-[1.55] text-testo-2 lg:block">
          Non trovi la tua? Scrivici a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold">
            {CONTACT_EMAIL}
          </a>
          : rispondiamo noi, non un bot.
        </p>
      </div>
      <div className="flex flex-col border-b border-linea-2">
        {DOMANDE.map((voce, indice) => (
          <details
            key={indice}
            open={indice === 0}
            className={`group ${indice === 0 ? "border-t-2 border-inchiostro" : "border-t border-linea-2"}`}
          >
            <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 py-[18px] lg:py-6 [&::-webkit-details-marker]:hidden">
              <h3 className="m-0 text-xl [font-weight:750] [font-stretch:85%] lg:text-2xl">{voce.domanda}</h3>
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
              {voce.risposta}
            </p>
          </details>
        ))}
      </div>
      <p className="m-0 text-[15.5px] leading-[1.55] text-testo-2 lg:hidden">
        Non trovi la tua?{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold">
          Scrivici
        </a>
        : rispondiamo noi, non un bot.
      </p>
    </section>
  );
}
