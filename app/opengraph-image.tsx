import { ImageResponse } from "next/og";

// Immagine Open Graph 1200×630: fondo inchiostro, H1 in giallo, logo (SPEC).
// Usa il carattere predefinito di next/og: Archivo non è disponibile come file locale
// senza aggiungere un asset al repository (dichiarato nella consegna).
export const alt = "PreventivoLampo — Finisci il sopralluogo. Il preventivo parte dal furgone.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
          background: "#16150F",
          color: "#FFC21F",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="10" fill="#FFC21F" />
            <path d="M22.5 7 L12 22 H19 L17 33 L28 17.5 H21 Z" fill="#16150F" />
          </svg>
          <span style={{ fontSize: 44, fontWeight: 800, color: "#F3F0E8" }}>PreventivoLampo</span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 88,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          <span>Finisci il sopralluogo.</span>
          <span>Il preventivo parte dal furgone.</span>
        </div>
      </div>
    ),
    size,
  );
}
