import { ImageResponse } from "next/og";
import { MARCHIO } from "@/lib/brand/marchio";

// Icona Apple 180×180: iOS vuole un quadrato pieno e arrotonda da solo gli angoli, quindi fondo notte a tutta
// superficie e dentro l'esagono del marchio, un tono più chiaro, con la K.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const { fondo, trasforma, stanghetta: s, freccia: f } = MARCHIO;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#1B090F" }}>
        <svg width="180" height="180" viewBox="-6 -6 76 76">
          <path d={fondo.esagono} fill={fondo.colore} />
          <g transform={trasforma}>
            <rect x={s.x} y={s.y} width={s.larghezza} height={s.altezza} rx={s.raggio} fill={s.colore} />
            <path d={f.d} fill="none" stroke={f.colore} strokeWidth={f.spessore} strokeMiterlimit={8} />
          </g>
        </svg>
      </div>
    ),
    size,
  );
}
