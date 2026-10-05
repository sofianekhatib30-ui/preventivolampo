import { ctaPrincipale } from "./Header";
import { LogoMark } from "./Logo";
import { SoloDesktop, SoloMobile } from "./Varianti";

const PUNTI = ["Niente app da installare", "Listino caricato da noi", "Decidi sempre tu"];

export function Hero() {
  const CTA_PILOTA = ctaPrincipale();
  return (
    <section
      id="top"
      className="margini grid items-center gap-[22px] pb-12 pt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-[clamp(40px,5vw,72px)] lg:pb-24 lg:pt-[72px]"
    >
      <div className="flex flex-col gap-[22px] lg:gap-7">
        <p className="flex items-center gap-2 self-start rounded-full border border-inchiostro px-3 py-1.5 font-mono text-[11.5px] font-medium lg:gap-2.5 lg:px-3.5 lg:py-2 lg:text-[13px] lg:tracking-[0.02em]">
          <span
            aria-hidden="true"
            className="size-[7px] shrink-0 rounded-full bg-segnale outline outline-inchiostro lg:size-2"
          />
          <SoloDesktop>Idraulici, piastrellisti, ristrutturazioni · Monza e Brianza</SoloDesktop>
          <SoloMobile>Artigiani edili · Monza e Brianza</SoloMobile>
        </p>
        <h1 className="titolo-h1 m-0">
          Finisci il sopralluogo.
          <SoloMobile> </SoloMobile>
          <br className="hidden lg:inline" />
          Il preventivo parte dal furgone.
        </h1>
        <p className="testo-hero m-0 max-w-[600px] text-testo-2">
          Mandi un vocale su WhatsApp, come parli di solito. Ti torna la bozza con i prezzi del{" "}
          <strong className="text-inchiostro">tuo</strong> listino, l&apos;IVA giusta e le voci
          dubbie segnate. Controlli, approvi, e il cliente riceve il PDF da accettare con un clic.
        </p>
        <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3.5">
          <a
            href={CTA_PILOTA.href}
            className="flex min-h-11 items-center justify-center rounded-full border-2 border-inchiostro bg-segnale px-6 py-4 text-[17px] font-extrabold no-underline lg:px-7 lg:py-[18px] lg:text-lg"
          >
            {CTA_PILOTA.label}
          </a>
          <a
            href="#come"
            className="flex min-h-11 items-center justify-center rounded-full border-2 border-inchiostro px-6 py-4 text-[17px] font-semibold no-underline lg:py-[18px] lg:text-lg"
          >
            Guarda come funziona
          </a>
        </div>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0 font-mono text-[13px] text-testo-2 sm:flex-row sm:flex-wrap sm:gap-x-7 lg:pt-3 lg:text-sm">
          {PUNTI.map((punto) => (
            <li key={punto}>
              <span aria-hidden="true">✓ </span>
              {punto}
            </li>
          ))}
        </ul>
      </div>
      <ChatEsempio />
    </section>
  );
}

function Forma() {
  // Forma d'onda del vocale: decorativa.
  const scure = [
    [0, 9, 6], [6, 5, 14], [12, 8, 8], [18, 3, 18], [24, 7, 10], [30, 10, 4], [36, 4, 16],
    [42, 6, 12], [48, 9, 6], [54, 2, 20], [60, 7, 10], [66, 5, 14], [72, 9, 6],
  ];
  const chiare = [
    [78, 6, 12], [84, 9, 6], [90, 4, 16], [96, 8, 8], [102, 10, 4], [108, 6, 12], [114, 9, 6],
    [120, 5, 14], [126, 8, 8], [132, 10, 4], [138, 7, 10], [144, 9, 6],
  ];
  return (
    <svg
      viewBox="0 0 150 24"
      aria-hidden="true"
      focusable="false"
      className="h-5 w-[110px] shrink lg:h-6 lg:w-[150px]"
    >
      <g fill="#16150F">
        {scure.map(([x, y, h]) => (
          <rect key={x} x={x} y={y} width="3" height={h} rx="1.5" />
        ))}
      </g>
      <g fill="#8C8878">
        {chiare.map(([x, y, h]) => (
          <rect key={x} x={x} y={y} width="3" height={h} rx="1.5" />
        ))}
      </g>
    </svg>
  );
}

function ChatEsempio() {
  const bollaMia = "self-end rounded-[14px_14px_4px_14px] bg-bolla-mia lg:rounded-[16px_16px_4px_16px]";
  const bollaSua = "self-start rounded-[14px_14px_14px_4px] bg-superficie lg:rounded-[16px_16px_16px_4px]";
  return (
    <figure className="m-0 mt-2 flex min-w-0 flex-col gap-2.5 rounded-[24px] bg-inchiostro p-3.5 lg:mt-0 lg:gap-3.5 lg:rounded-[32px] lg:p-7">
      <figcaption className="flex items-center justify-between px-1 font-mono text-[11px] text-linea-2 lg:text-xs">
        <span>Conversazione di esempio</span>
        <span>18:05</span>
      </figcaption>
      <div className="flex flex-col overflow-hidden rounded-2xl bg-chat lg:rounded-[22px]">
        <div className="hidden items-center gap-3 border-b border-linea bg-superficie px-[18px] py-3.5 lg:flex">
          <LogoMark round className="size-9" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold">PreventivoLampo</span>
            <span className="text-xs text-testo-3">assistente preventivi</span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 p-3.5 text-sm leading-[1.45] lg:gap-3 lg:p-[18px]">
          <div
            role="img"
            aria-label="Messaggio vocale di 1 minuto e 42 secondi"
            className={`${bollaMia} flex max-w-full items-center gap-2 px-3 py-[9px] lg:w-[250px] lg:gap-2.5 lg:px-3.5 lg:py-2.5`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="size-5 shrink-0 lg:size-[22px]">
              <circle cx="12" cy="12" r="11" fill="#16150F" />
              <path d="M10 8 L16 12 L10 16 Z" fill="#FFFFFF" />
            </svg>
            <Forma />
            <span className="font-mono text-[11px] lg:text-xs">1:42</span>
          </div>
          <div className={`${bollaSua} flex max-w-[270px] flex-col gap-2.5 px-3 py-2.5 lg:max-w-[330px] lg:px-3.5 lg:py-3`}>
            <span>
              Bagno sig.ra Colombo, Lissone. <SoloDesktop>Una sola domanda: il</SoloDesktop>
              <SoloMobile>Il</SoloMobile> rivestimento arriva fino al soffitto o a 1,20 m?
            </span>
            <div className="hidden gap-2 lg:flex">
              <span className="rounded-full border-[1.5px] border-inchiostro px-3 py-1.5 text-[13px] font-semibold">
                Fino al soffitto
              </span>
              <span className="rounded-full border-[1.5px] border-inchiostro px-3 py-1.5 text-[13px] font-semibold">
                1,20 m
              </span>
            </div>
          </div>
          <div className={`${bollaMia} px-3 py-[9px] lg:px-3.5 lg:py-2.5`}>Fino al soffitto</div>
          <div className={`${bollaSua} flex w-full flex-col gap-2 p-3 lg:w-[356px] lg:max-w-full lg:gap-2.5 lg:p-3.5`}>
            <span className="font-bold">Bozza pronta: 7 voci, 1 da prezzare</span>
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0 font-mono text-xs lg:text-[12.5px]">
              <RigaBozza voce="Rimozione rivestimento · 24 m²" />
              <RigaBozza voce="Posa piastrelle parete · 24 m²" />
              <RigaBozza voce="Smaltimento macerie · 1 viaggio" />
              <li className="flex justify-between gap-2 rounded bg-segnale px-1.5 py-[3px] lg:-mx-1.5">
                <span>Piatto doccia 80×120</span>
                <span>da prezzare</span>
              </li>
              <li className="hidden text-testo-3 lg:block">+ altre 3 voci</li>
            </ul>
            <div className="flex items-baseline justify-between gap-2 border-t border-dashed border-linea-2 pt-2 lg:pt-2.5">
              <span className="text-[12.5px] text-testo-2 lg:text-[13px]">
                IVA 10% e 22% <SoloDesktop>già </SoloDesktop>ripartita
              </span>
              <span className="whitespace-nowrap font-mono font-semibold">6.840,00 €</span>
            </div>
            <span className="rounded-[10px] bg-inchiostro p-2.5 text-center font-bold text-fondo">
              Apri e controlla
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}

function RigaBozza({ voce }: { voce: string }) {
  return (
    <li className="hidden justify-between gap-2 lg:flex">
      <span>{voce}</span>
      <span>✓</span>
    </li>
  );
}
