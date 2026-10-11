import { Frasi } from "@/components/Frasi";
import { Ricco } from "@/components/Ricco";
import type { Dizionario } from "@/lib/i18n/it";
import type { LinguaSito } from "@/lib/i18n/lingue";
import { DemoSopralluogo } from "./demo/DemoSopralluogo";
import { EsagoniVivi } from "./EsagoniVivi";
import { ctaPrincipale } from "./Header";
import { Matrice } from "./Matrice";

// La hero è la stessa di Attestiamo e Smistatore Mail (Sofiane, 11/10/2026: «hero uguali per tutte e 3,
// quella di Attestiamo»): fondo inchiostro con il fondale a quadratini, a sinistra per chi è, titolo,
// guida, la regola che conta, i due pulsanti e il canone; a destra la prova del prodotto in una finestra
// chiara. Misure e colori copiati da styles.css di Attestiamo (.hero, .per-chi, .regola, .canone, .scena).
export function Hero({ d, lingua }: { d: Dizionario; lingua: LinguaSito }) {
  const CTA_PILOTA = ctaPrincipale(d, lingua);
  const h = d.hero;
  return (
    <section
      id="top"
      className="su-scuro griglia-kds relative isolate overflow-hidden bg-ardesia pb-[clamp(52px,7vw,104px)] pt-[clamp(44px,6vw,92px)] text-fondo-2"
    >
      <Matrice />
      <EsagoniVivi />
      <div className="mx-auto grid max-w-[1240px] items-center gap-[clamp(36px,5vw,72px)] px-[clamp(16px,5vw,72px)] min-[1021px]:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)] [&>*]:min-w-0">
        <div>
          <p className="m-0 inline-flex items-center gap-2.5 text-[15px] font-semibold text-fondo-2">
            <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-lime" />
            {h.etichetta}
          </p>
          <h1 className="mb-[22px] mt-[18px] max-w-[15ch] text-[clamp(42px,4.8vw,64px)] leading-[1.02] text-white">
            <Frasi testo={h.titolo} />
          </h1>
          <p className="m-0 max-w-[32em] text-[19px] leading-[1.6] text-fondo-2 [text-wrap:pretty]">
            <Ricco testo={h.testo} classeGrassetto="text-white" />
          </p>
          <p className="mb-0 mt-5 flex max-w-[32em] items-start gap-3 font-semibold text-white">
            <span aria-hidden="true" className="mt-px flex size-[22px] shrink-0 items-center justify-center rounded-full bg-fondo-2 text-cielo-scuro">
              <svg viewBox="0 0 24 24" className="size-[13px]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            {h.garanzia}
          </p>
          <div className="mt-[30px] flex flex-wrap gap-3">
            <a
              href={CTA_PILOTA.href}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-lime px-7 py-3.5 text-[17px] font-semibold text-ardesia-2 no-underline hover:bg-cielo max-[420px]:flex-[1_1_100%]"
            >
              {CTA_PILOTA.label}
            </a>
            <a
              href="#come"
              className="inline-flex min-h-14 items-center justify-center rounded-full border-2 border-fondo-2 px-7 py-3.5 text-[17px] font-semibold text-fondo-2 no-underline hover:bg-fondo-2 hover:text-inchiostro max-[420px]:flex-[1_1_100%]"
            >
              {h.guarda}
            </a>
          </div>
          <p className="mb-0 mt-7 flex max-w-[34em] flex-wrap items-baseline gap-x-3.5 gap-y-1 border-t border-fondo-2/25 pt-[18px]">
            <b className="font-[family-name:var(--font-titoli)] text-[38px] font-normal leading-none text-white">{h.canonePrezzo}</b>
            <span className="text-[15.5px] text-fondo-2">{h.canoneTesto}</span>
          </p>
        </div>
        <DemoSopralluogo cta={CTA_PILOTA.href} />
      </div>
    </section>
  );
}
