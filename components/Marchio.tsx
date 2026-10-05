"use client";

import { useState } from "react";
import { MARCHIO } from "@/lib/brand/marchio";

// Il marchio animato: il fulmine si traccia e si accende, poi l'orecchia del foglio scatta.
// Si anima all'apertura e di nuovo al passaggio del mouse; con «riduci movimento» resta fermo.
export function Marchio({ className, animato = true }: { className?: string; animato?: boolean }) {
  const [giro, setGiro] = useState(0);
  const { foglio, orecchia, fulmine, colori } = MARCHIO;
  return (
    <svg
      key={giro}
      className={`${animato ? "logo-animato" : ""} ${className ?? ""}`}
      viewBox={MARCHIO.viewBox}
      aria-hidden="true"
      focusable="false"
      onMouseEnter={animato ? () => setGiro((g) => g + 1) : undefined}
    >
      <path d={foglio} fill={colori.foglio} />
      <path className="lampo-angolo" d={orecchia} fill={colori.orecchia} />
      <path
        className="lampo-fulmine"
        d={fulmine}
        fill={colori.fulmine}
        stroke={colori.fulmine}
        strokeWidth="1.2"
        strokeLinejoin="round"
        pathLength={1}
      />
    </svg>
  );
}
