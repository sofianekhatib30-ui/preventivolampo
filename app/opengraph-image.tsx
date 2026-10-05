import { ImageResponse } from "next/og";
import { MARCHIO } from "@/lib/brand/marchio";

// Immagine di anteprima 1200×630: ardesia, titolo chiaro, il lime solo sul marchio e sul filetto.
// Usa il carattere predefinito di next/og (Archivo non è un file locale del repository).
export const alt = "PreventivoLampo — Finisci il sopralluogo. Il preventivo parte dal furgone.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const { foglio, orecchia, fulmine, colori } = MARCHIO;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#343645",
          color: "#F5F6F2",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="76" height="76" viewBox="0 0 40 40">
            <path d={foglio} fill={colori.foglio} />
            <path d={orecchia} fill={colori.orecchia} />
            <path d={fulmine} fill={colori.fulmine} />
          </svg>
          <span style={{ fontSize: 46, fontWeight: 800 }}>PreventivoLampo</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.02em" }}>
            <span>Finisci il sopralluogo.</span>
            <span>Il preventivo parte dal furgone.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#D5D7E0" }}>
            <div style={{ width: 64, height: 8, background: "#B2F601", borderRadius: 4 }} />
            Prezzi solo dal tuo listino · IVA edile giusta · il cliente accetta dal link
          </div>
        </div>
      </div>
    ),
    size,
  );
}
