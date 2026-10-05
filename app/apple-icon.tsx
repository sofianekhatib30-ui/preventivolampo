import { ImageResponse } from "next/og";
import { MARCHIO } from "@/lib/brand/marchio";

// Icona Apple 180×180: il marchio su fondo ardesia (iOS arrotonda da solo gli angoli).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  const { foglio, orecchia, fulmine, colori } = MARCHIO;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#343645" }}>
        <svg width="132" height="132" viewBox="0 0 40 40">
          <path d={foglio} fill={colori.foglio} />
          <path d={orecchia} fill={colori.orecchia} />
          <path d={fulmine} fill={colori.fulmine} />
        </svg>
      </div>
    ),
    size,
  );
}
