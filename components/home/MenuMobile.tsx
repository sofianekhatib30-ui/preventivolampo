"use client";

import { useEffect, useId, useRef, useState } from "react";

type Link = { readonly href: string; readonly label: string };

// Menu sotto 1024 px: disclosure con aria-expanded, si chiude con Esc e al click su una voce.
export function MenuMobile({ links, cta }: { links: readonly Link[]; cta: Link }) {
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
        aria-label={open ? "Chiudi il menu" : "Apri il menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex size-11 items-center justify-center rounded-campo border-[1.5px] border-scuro-linea bg-transparent text-fondo"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>
      <nav
        id={panelId}
        aria-label="Principale"
        hidden={!open}
        className="margini absolute inset-x-0 top-full border-b border-scuro-linea bg-ardesia pb-6 pt-2 text-fondo"
      >
        <ul className="flex flex-col">
          {links.map((link) => (
            <li key={link.href} className="border-b border-scuro-linea">
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-12 items-center text-lg font-medium no-underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={cta.href}
          onClick={() => setOpen(false)}
          className="bottone bottone-azione-scuro mt-5 flex w-full text-[17px]"
        >
          {cta.label}
        </a>
      </nav>
    </div>
  );
}
