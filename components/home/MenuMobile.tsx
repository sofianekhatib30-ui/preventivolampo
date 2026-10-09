"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLingua } from "@/lib/i18n/client";

type Link = { readonly href: string; readonly label: string };
export type GruppoMenu = { titolo: string; voci: Link[]; colonne?: boolean };

// Menu sotto 1280 px: disclosure con aria-expanded, si chiude con Esc e al click su una voce.
// Tutte le pagine del sito, raggruppate: mestieri, come funziona, risorse.
export function MenuMobile({ gruppi, cta }: { gruppi: GruppoMenu[]; cta: Link }) {
  const { d } = useLingua();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? d.comune.chiudiMenu : d.comune.apriMenu}
        onClick={() => setOpen((value) => !value)}
        className="flex size-11 items-center justify-center rounded-campo border-[1.5px] border-scuro-linea bg-transparent text-fondo"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>
      <nav
        id={panelId}
        aria-label={d.comune.principale}
        hidden={!open}
        className="margini absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-scuro-linea bg-ardesia pb-6 pt-4 text-fondo"
      >
        <div className="flex flex-col gap-6">
          {gruppi.map((g) => (
            <div key={g.titolo}>
              <p className="m-0 mb-1 text-[14px] font-semibold text-scuro-nota">{g.titolo}</p>
              <ul className={`m-0 grid list-none p-0 ${g.colonne ? "grid-cols-2 gap-x-4" : ""}`}>
                {g.voci.map((link) => (
                  <li key={link.href} className="border-b border-scuro-linea">
                    <a href={link.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center text-[17px] font-medium no-underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a href={cta.href} onClick={() => setOpen(false)} className="bottone bottone-azione-scuro mt-6 flex w-full text-[17px]">
          {cta.label}
        </a>
      </nav>
    </div>
  );
}
