import { candidatureAperte } from "@/lib/sito";
import { SoloDesktop } from "./Varianti";

const cardChiara =
  "flex flex-col gap-2.5 rounded-[20px] border border-linea bg-superficie p-6 lg:gap-[18px] lg:rounded-card lg:p-10";
const titoloCard = "m-0 text-2xl font-extrabold [font-stretch:78%] lg:text-[28px]";
const cifra = "whitespace-nowrap [font-weight:850] leading-none [font-stretch:68%]";
const listaDesktop = "m-0 hidden list-disc pl-5 text-base leading-[1.8] text-testo-2 lg:block";
const notaDesktop = "m-0 mt-auto hidden text-sm leading-normal text-testo-3 lg:block";

export function Prezzi() {
  const aperte = candidatureAperte();
  return (
    <section id="prezzi" className="margini flex flex-col gap-4 bg-fondo-2 py-14 lg:gap-12 lg:py-28">
      <div className="flex max-w-[760px] flex-col gap-4">
        <p className="etichetta m-0 text-[13px] lg:text-sm">Prezzi</p>
        <h2 className="titolo-h2 m-0 mb-2 lg:mb-0">
          Prima lo provi sui tuoi lavori veri. Poi decidi.
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
        <article className="su-scuro flex flex-col gap-3 rounded-[20px] bg-inchiostro p-6 text-fondo lg:gap-[18px] lg:rounded-card lg:p-10">
          <p className="m-0 self-start rounded-full bg-segnale px-2.5 py-[5px] font-mono text-xs font-semibold text-inchiostro lg:px-3 lg:py-1.5 lg:text-[13px]">
            10 posti · Monza e Brianza
          </p>
          <h3 className="m-0 text-[26px] font-extrabold [font-stretch:78%] lg:text-[32px]">
            Programma pilota
          </h3>
          <p className="m-0 flex items-baseline gap-2 lg:gap-2.5">
            <span className={`${cifra} text-[56px] lg:text-[72px]`}>0 €</span>
            <span className="text-base text-scuro-testo lg:text-lg">per 60 giorni</span>
          </p>
          <p className="m-0 text-base leading-[1.55] text-scuro-testo lg:text-[17px]">
            Avvio completo incluso, preventivi illimitati. In cambio ci dici cosa non funziona.{" "}
            <SoloDesktop>Alla fine resti solo se ti conviene: nessun rinnovo automatico.</SoloDesktop>
            <span className="lg:hidden">Nessun rinnovo automatico.</span>
          </p>
          <a
            href={aperte ? "#candidatura" : "/prova"}
            className="mt-auto flex min-h-11 items-center justify-center rounded-full bg-segnale px-6 py-[15px] text-[17px] font-extrabold text-inchiostro no-underline lg:py-4"
          >
            {aperte ? "Candidati" : "Prova la demo"}
          </a>
        </article>

        <article className={cardChiara}>
          <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-[18px]">
            <h3 className={titoloCard}>Avvio fatto per te</h3>
            <p className="m-0 flex items-baseline gap-2.5">
              <span className={`${cifra} text-4xl lg:text-[64px]`}>290 €</span>
              <span className="hidden text-base text-testo-3 lg:inline">una tantum</span>
            </p>
          </div>
          <ul className={listaDesktop}>
            <li>Caricamento del tuo listino</li>
            <li>Logo, dati e condizioni sul PDF</li>
            <li>Un&apos;ora di affiancamento</li>
          </ul>
          <p className={notaDesktop}>Gratis per chi entra nel programma pilota.</p>
          <p className="m-0 text-[15px] leading-[1.55] text-testo-2 lg:hidden">
            Una tantum: caricamento del listino, logo, dati e condizioni sul PDF, un&apos;ora di
            affiancamento. Gratis per chi entra nel programma pilota.
          </p>
        </article>

        <article className={cardChiara}>
          <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-[18px]">
            <h3 className={titoloCard}>Canone</h3>
            <p className="m-0 flex items-baseline gap-2.5">
              <span className={`${cifra} text-4xl lg:text-[64px]`}>
                19 €
                <span className="text-base font-medium [font-stretch:100%] lg:hidden"> /mese</span>
              </span>
              <span className="hidden text-base text-testo-3 lg:inline">al mese</span>
            </p>
          </div>
          <ul className={listaDesktop}>
            <li>Preventivi illimitati</li>
            <li>Link di accettazione per il cliente</li>
            <li>Assistenza da una persona</li>
          </ul>
          <p className={notaDesktop}>Prezzi IVA esclusa. Disdici quando vuoi, senza vincoli.</p>
          <p className="m-0 text-[15px] leading-[1.55] text-testo-2 lg:hidden">
            Preventivi illimitati, link di accettazione per il cliente, assistenza da una persona.
            Disdici quando vuoi.
          </p>
        </article>
      </div>
      <p className="m-0 text-[13px] text-testo-3 lg:hidden">Prezzi IVA esclusa.</p>
    </section>
  );
}
