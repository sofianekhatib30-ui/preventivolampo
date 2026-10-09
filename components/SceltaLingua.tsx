"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLingua } from "@/lib/i18n/client";
import { COOKIE_LINGUA, INFO_LINGUA, LINGUE_SITO, type LinguaSito } from "@/lib/i18n/lingue";

// Selettore della lingua dell'interfaccia: bandiera della lingua attuale; nell'elenco l'italiano in
// cima, come lingua principale, poi le altre. La scelta resta in un cookie tecnico di preferenza.
export function SceltaLingua({ scuro = true, compatto = false }: { scuro?: boolean; compatto?: boolean }) {
  const { lingua, d } = useLingua();
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
    // Ricarica la pagina: tutto, testi del server compresi, esce nella lingua scelta.
    window.location.reload();
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
        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-2.5 text-[15px] font-semibold ${
          scuro ? "border-scuro-linea bg-transparent text-fondo hover:border-lime" : "border-linea-2 bg-superficie text-inchiostro hover:border-ardesia"
        }`}
      >
        <Bandiera codice={info.bandiera} />
        {!compatto && <span className="uppercase">{lingua}</span>}
        <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {aperto && (
        <ul
          id={idLista}
          aria-label={d.comune.scegliLingua}
          className="absolute end-0 top-full z-50 mt-2 max-h-[70vh] w-56 overflow-y-auto rounded-campo bg-superficie p-1.5 text-inchiostro shadow-[0_12px_32px_rgba(31,32,41,0.22)] ring-1 ring-linea"
        >
          {LINGUE_SITO.map((l, i) => (
            <li key={l} className={i === 1 ? "mt-1 border-t border-linea pt-1" : ""}>
              <button
                type="button"
                lang={l}
                aria-current={l === lingua ? "true" : undefined}
                onClick={() => scegli(l)}
                className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-[10px] px-3 text-start text-[16px] ${
                  l === lingua ? "bg-fondo font-bold" : "font-medium hover:bg-fondo"
                }`}
              >
                <Bandiera codice={INFO_LINGUA[l].bandiera} />
                {INFO_LINGUA[l].nome}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Bandiera({ codice }: { codice: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/bandiere/${codice}.svg`} alt="" width={22} height={16} className="h-4 w-[22px] shrink-0 rounded-[3px] object-cover ring-1 ring-black/10" />;
}
