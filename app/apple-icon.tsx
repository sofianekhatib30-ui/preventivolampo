import { ImageResponse } from "next/og";
import { MARCHIO } from "@/lib/brand/marchio";

// Icona Apple 180×180: il marchio di K Digital Solution a tutta superficie (iOS arrotonda da solo gli angoli).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const { fondo, trasforma, stanghetta: s, freccia: f } = MARCHIO;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: fondo.colore }}>
        <svg width="180" height="180" viewBox="0 0 64 64">
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
