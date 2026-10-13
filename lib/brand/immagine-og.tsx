import { ImageResponse } from "next/og";
import { MARCHIO } from "@/lib/brand/marchio";
import type { LinguaSito } from "@/lib/i18n/lingue";

// Immagine di anteprima 1200×630 delle pagine pubbliche: fondo inchiostro di K Digital Solution, titolo
// sabbia, l'oro solo sul marchio e sul filetto. Carattere predefinito di next/og, incluso nel pacchetto: nessuna richiesta
// a domini terzi. Quel carattere non ha l'arabo né il cirillico: per quelle lingue il testo resta italiano.
export const DIMENSIONE_OG = { width: 1200, height: 630 };

export function lingueSenzaCaratteri(lingua: LinguaSito) {
  return lingua === "ar" || lingua === "uk";
}

export function immagineOg({ titolo, riga }: { titolo: string; riga: string }) {
  const { fondo, trasforma, stanghetta: s, freccia: f } = MARCHIO;
  const lungo = titolo.length > 60;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: fondo.colore, color: "#F2E4D0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="76" height="76" viewBox="0 0 64 64">
            <path d={fondo.esagono} fill="#3A1A24" />
            <g transform={trasforma}>
              <rect x={s.x} y={s.y} width={s.larghezza} height={s.altezza} rx={s.raggio} fill={s.colore} />
              <path d={f.d} fill="none" stroke={f.colore} strokeWidth={f.spessore} strokeMiterlimit={8} />
            </g>
          </svg>
          <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
            {/* Il nome come .nome-strumento di app/globals.css sul fondo scuro: maiuscolo, grassetto, bordeaux in targa
                Champagne. Spaziatura e margini della targa in proporzione al corpo (0,05em; 6px 12px su 19px). */}
            <span style={{ fontSize: 46, fontWeight: 700, lineHeight: 1.1, letterSpacing: 2.3, textTransform: "uppercase", color: "#6E1734", background: "#F2E4D0", padding: "15px 29px", borderRadius: 999 }}>Preventivi</span>
            <span style={{ fontSize: 22, color: "#DCC6A4" }}>K Digital Solution</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: lungo ? 64 : 80, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.02em" }}>{titolo}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#DCC6A4" }}>
            <div style={{ width: 64, height: 8, background: "#C6A15B", borderRadius: 4, flexShrink: 0 }} />
            {riga}
          </div>
        </div>
      </div>
    ),
    DIMENSIONE_OG,
  );
}
