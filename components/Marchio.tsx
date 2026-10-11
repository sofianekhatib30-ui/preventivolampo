"use client";

import { useState } from "react";
import { MARCHIO } from "@/lib/brand/marchio";

// Il marchio di K Digital Solution, animato come su kdigitalsolution.it: la stanghetta cresce e la
// freccia si disegna all'apertura e di nuovo al passaggio del mouse; con «riduci movimento» resta fermo.
export function Marchio({ className, animato = true }: { className?: string; animato?: boolean }) {
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
      <rect width="64" height="64" rx={fondo.raggio} fill={fondo.colore} />
      <g transform={trasforma}>
        <rect className="marchio-stanghetta" x={s.x} y={s.y} width={s.larghezza} height={s.altezza} rx={s.raggio} fill={s.colore} />
        <path className="marchio-freccia" d={f.d} fill="none" stroke={f.colore} strokeWidth={f.spessore} strokeMiterlimit={8} pathLength={1} />
      </g>
    </svg>
  );
}
