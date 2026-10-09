"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLingua } from "@/lib/i18n/client";
import { COOKIE_LINGUA, INFO_LINGUA, LINGUE_SITO, type LinguaSito, percorso, togliLingua } from "@/lib/i18n/lingue";

// Selettore della lingua dell'interfaccia: bandiera della lingua attuale; nell'elenco l'italiano in
// cima, come lingua principale, poi le altre. La scelta resta in un cookie tecnico di preferenza.
export function SceltaLingua({ scuro = true, compatto = false }: { scuro?: boolean; compatto?: boolean }) {
  const { lingua, d, pubblica } = useLingua();
  const [aperto, setAperto] = useState(false);
  const radice = useRef<HTMLDivElement>(null);
  const bottone = useRef<HTMLButtonElement>(null);
  const idLista = useId();

  useEffect(() => {
    if (!aperto) return;
    const fuori = (e: MouseEvent) => {
      if (radice.current && !radice.current.contains(e.target as Node)) setAperto(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAperto(false);
        bottone.current?.focus();
      }
    };
    document.addEventListener("mousedown", fuori);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuori);
      document.removeEventListener("keydown", esc);
    };
  }, [aperto]);

  function scegli(l: LinguaSito) {
    // Scrivere il cookie è l'effetto voluto del clic, non uno stato di React.
    // eslint-disable-next-line react-hooks/immutability
    document.cookie = `${COOKIE_LINGUA}=${l}; path=/; max-age=31536000; samesite=lax`;
    setAperto(false);
    // Pagine pubbliche: la stessa pagina all'indirizzo della lingua scelta (/ro/prezzi).
    // Area e pagine di servizio: si ricarica, e tutto esce nella lingua scelta.
    if (pubblica) {
      const { resto } = togliLingua(window.location.pathname);
      window.location.assign(percorso(l, resto) + window.location.hash);
    } else window.location.reload();
  }

  const info = INFO_LINGUA[lingua];
  return (
    <div ref={radice} className="relative">
      <button
        ref={bottone}
        type="button"
        aria-expanded={aperto}
        aria-controls={idLista}
        aria-label={`${d.comune.scegliLingua}: ${info.nome}`}
        onClick={() => setAperto((a) => !a)}
        className={`group relative flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full transition-[box-shadow,background-color] ${
          compatto ? "size-11" : "ps-1.5 pe-3"
        } ${
          scuro
            ? "bg-ardesia-2 text-fondo ring-1 ring-scuro-linea hover:ring-2 hover:ring-lime aria-expanded:ring-2 aria-expanded:ring-lime"
            : "bg-superficie text-inchiostro ring-1 ring-linea-2 hover:ring-2 hover:ring-ardesia aria-expanded:ring-2 aria-expanded:ring-ardesia"
        }`}
      >
        <Bandiera codice={info.bandiera} tonda grande />
        {!compatto && <span className="text-[14px] font-bold uppercase tracking-wide">{lingua}</span>}
        <span
          aria-hidden="true"
          className={`flex items-center justify-center rounded-full bg-lime text-inchiostro transition-transform group-aria-expanded:rotate-180 ${
            compatto ? "absolute -bottom-0.5 -end-0.5 size-[18px] ring-2 ring-ardesia" : "size-5"
          }`}
        >
          <svg viewBox="0 0 20 20" className="size-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5.5 8l4.5 4.5L14.5 8" />
          </svg>
        </span>
      </button>
      {aperto && (
        <div
          id={idLista}
          className="absolute end-0 top-full z-50 mt-2.5 w-60 overflow-hidden rounded-[18px] bg-superficie text-inchiostro shadow-[0_18px_40px_rgba(31,32,41,0.28)] ring-1 ring-linea"
        >
          <p className="m-0 border-b border-linea px-4 py-2.5 text-[13px] font-semibold text-testo-3">{d.comune.scegliLingua}</p>
          <ul aria-label={d.comune.scegliLingua} className="m-0 max-h-[65vh] list-none overflow-y-auto p-1.5">
            {LINGUE_SITO.map((l, i) => {
              const attiva = l === lingua;
              return (
                <li key={l} className={i === 1 ? "mt-1.5 border-t border-linea pt-1.5" : ""}>
                  <button
                    type="button"
                    lang={l}
                    aria-current={attiva ? "true" : undefined}
                    onClick={() => scegli(l)}
                    className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-[12px] px-2.5 text-start text-[16px] ${
                      attiva ? "bg-bolla-mia font-bold" : "font-medium hover:bg-fondo"
                    }`}
                  >
                    <Bandiera codice={INFO_LINGUA[l].bandiera} tonda />
                    <span className="flex-1">{INFO_LINGUA[l].nome}</span>
                    {attiva && (
                      <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4 text-lime-scuro" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.5 10.5l3.5 3.5 7.5-8" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function Bandiera({ codice, tonda = false, grande = false }: { codice: string; tonda?: boolean; grande?: boolean }) {
  const misura = tonda ? (grande ? "size-7" : "size-6") : "h-4 w-[22px] rounded-[3px]";
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/bandiere/${codice}.svg`} alt="" width={28} height={28} className={`${misura} shrink-0 object-cover ring-1 ring-black/10 ${tonda ? "rounded-full" : ""}`} />;
}
