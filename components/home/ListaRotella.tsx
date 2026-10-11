"use client";

import { type ComponentProps, useEffect, useRef } from "react";

// Lista di schede che scorre di lato con la rotella del mouse, senza la barra di scorrimento
// (Sofiane, 11/10/2026: «facciamolo scorrere con la rotella invece che con quella barra antiquata»).
// Un giro di rotella porta alla scheda dopo (o a quella prima); arrivati in fondo la rotella torna a far
// scorrere la pagina, così nessuno resta incastrato. Il dito sul telefono e lo scorrimento laterale del
// trackpad funzionano come prima; da tastiera la lista resta raggiungibile con Tab e si scorre con le frecce.
export function ListaRotella({ className = "", ...resto }: ComponentProps<"ul">) {
  const rif = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const ul = rif.current;
    if (!ul) return;
    let accumulo = 0;
    let fermoFino = 0;
    const suRotella = (e: WheelEvent) => {
      // Il trackpad che scorre già di lato, o una lista che non scorre (schermi larghi, griglia): niente da fare.
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return;
      const max = ul.scrollWidth - ul.clientWidth;
      if (max <= 1) return;
      const rtl = getComputedStyle(ul).direction === "rtl";
      const avanti = e.deltaY > 0;
      const pos = Math.abs(ul.scrollLeft);
      if ((avanti && pos >= max - 1) || (!avanti && pos <= 1)) {
        accumulo = 0;
        return; // in fondo o all'inizio: scorre la pagina
      }
      e.preventDefault();
      const ora = performance.now();
      if (ora < fermoFino) return; // la scheda di prima sta ancora arrivando
      accumulo += e.deltaY;
      if (Math.abs(accumulo) < 24) return;
      accumulo = 0;
      const scheda = ul.querySelector<HTMLElement>(":scope > li");
      const gap = parseFloat(getComputedStyle(ul).columnGap) || 0;
      const passo = (scheda?.offsetWidth ?? ul.clientWidth * 0.8) + gap;
      const verso = (avanti ? 1 : -1) * (rtl ? -1 : 1);
      const riduci = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      ul.scrollBy({ left: verso * passo, behavior: riduci ? "auto" : "smooth" });
      fermoFino = ora + 380;
    };
    ul.addEventListener("wheel", suRotella, { passive: false });
    return () => ul.removeEventListener("wheel", suRotella);
  }, []);

  return <ul ref={rif} className={`${className} [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`} {...resto} />;
}
