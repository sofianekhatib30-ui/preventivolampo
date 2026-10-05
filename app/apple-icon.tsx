import { ImageResponse } from "next/og";

// Icona Apple 180×180 dal fulmine del logo (SPEC, «SEO, condivisione, dati strutturati»).
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFC21F",
        }}
      >
        <svg width="150" height="150" viewBox="0 0 40 40">
          <path d="M22.5 7 L12 22 H19 L17 33 L28 17.5 H21 Z" fill="#16150F" />
        </svg>
      </div>
    ),
    size,
  );
}
