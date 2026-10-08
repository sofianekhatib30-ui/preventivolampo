import { DemoSopralluogo } from "./demo/DemoSopralluogo";
import { ctaPrincipale } from "./Header";

const PUNTI = ["Niente da installare", "Listino anche da una foto", "Decidi sempre tu"];

export function Hero() {
  const CTA_PILOTA = ctaPrincipale();
  return (
    <section
      id="top"
      className="su-scuro quadretti margini grid items-start gap-9 bg-ardesia pb-14 pt-8 text-fondo lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,620px)] lg:gap-[clamp(40px,5vw,80px)] lg:pb-24 lg:pt-[72px]"
    >
      <div className="flex flex-col gap-[22px] lg:sticky lg:top-[120px] lg:gap-7">
        <p className="m-0 flex items-center gap-2 self-start rounded-full border border-scuro-linea bg-ardesia px-3 py-1.5 text-[13.5px] font-semibold text-scuro-testo lg:gap-2.5 lg:px-3.5 lg:py-2 lg:text-[14.5px]">
          <span aria-hidden="true" className="size-[7px] shrink-0 rounded-full bg-lime lg:size-2" />
          Per tutti i mestieri della casa
        </p>
        <h1 className="titolo-h1 m-0">
          Finisci il sopralluogo. Il preventivo parte dal furgone.
        </h1>
        <p className="testo-hero m-0 max-w-[600px] text-scuro-testo">
          Lo racconti a voce o lo scrivi, come faresti con un collega. Ti torna la bozza con i prezzi del{" "}
          <strong className="text-fondo">tuo</strong> listino, l&apos;IVA giusta e le voci dubbie segnate. Controlli, approvi,
          e il cliente riceve il PDF da accettare con un clic.
        </p>
        <p className="m-0 max-w-[600px] border-l-4 border-lime pl-3.5 text-[17px] font-semibold leading-snug lg:text-lg">
          Prezzi solo dal tuo listino. Se una voce non c&apos;è resta da prezzare: niente cifre inventate.
        </p>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
          <a href={CTA_PILOTA.href} className="bottone bottone-azione-scuro py-4 text-[17px] lg:px-7 lg:py-[18px] lg:text-lg">
            {CTA_PILOTA.label}
          </a>
          <a
            href="#come"
            className="bottone border-2 border-cielo py-4 text-[17px] font-semibold text-fondo hover:bg-cielo hover:text-inchiostro lg:py-[18px] lg:text-lg"
          >
            Guarda come funziona
          </a>
        </div>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] text-scuro-testo sm:flex-row sm:flex-wrap sm:gap-x-7 lg:pt-2">
          {PUNTI.map((punto) => (
            <li key={punto}>
              <span aria-hidden="true" className="text-lime">✓ </span>
              {punto}
            </li>
          ))}
        </ul>
      </div>
      <DemoSopralluogo cta={CTA_PILOTA.href} />
    </section>
  );
}
