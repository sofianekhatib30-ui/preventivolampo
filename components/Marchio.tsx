"use client";

import { useState } from "react";
import { MARCHIO } from "@/lib/brand/marchio";

// Il marchio di K Digital Solution, animato come su kdigitalsolution.it: la stanghetta cresce e la
// freccia si disegna all'apertura e di nuovo al passaggio del mouse; con «riduci movimento» resta fermo.
// Su un fondo scuro (il piede) l'esagono prende il tono più chiaro con il bordo, come logo-scuro.svg degli altri prodotti.
export function Marchio({ className, animato = true, suScuro = false }: { className?: string; animato?: boolean; suScuro?: boolean }) {
  const [giro, setGiro] = useState(0);
  const { fondo, trasforma, stanghetta: s, freccia: f } = MARCHIO;
  return (
    <svg
      key={giro}
      className={`${animato ? "marchio-animato" : ""} ${className ?? ""}`}
      viewBox={MARCHIO.viewBox}
      aria-hidden="true"
      focusable="false"
      onMouseEnter={animato ? () => setGiro((g) => g + 1) : undefined}
    >
      <path d={fondo.esagono} fill={suScuro ? "#3D1522" : fondo.colore} stroke={suScuro ? "#5A2A38" : undefined} strokeWidth={suScuro ? 1.5 : undefined} />
      <g transform={trasforma}>
        <rect className="marchio-stanghetta" x={s.x} y={s.y} width={s.larghezza} height={s.altezza} rx={s.raggio} fill={s.colore} />
        <path className="marchio-freccia" d={f.d} fill="none" stroke={f.colore} strokeWidth={f.spessore} strokeMiterlimit={8} pathLength={1} />
      </g>
    </svg>
  );
}
