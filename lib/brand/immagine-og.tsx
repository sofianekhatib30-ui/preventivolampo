import { ImageResponse } from "next/og";
import { MARCHIO } from "@/lib/brand/marchio";
import type { LinguaSito } from "@/lib/i18n/lingue";

// Immagine di anteprima 1200×630 delle pagine pubbliche: ardesia, titolo chiaro, il lime solo sul
// marchio e sul filetto. Carattere predefinito di next/og, incluso nel pacchetto: nessuna richiesta
// a domini terzi. Quel carattere non ha l'arabo né il cirillico: per quelle lingue il testo resta italiano.
export const DIMENSIONE_OG = { width: 1200, height: 630 };

export function lingueSenzaCaratteri(lingua: LinguaSito) {
  return lingua === "ar" || lingua === "uk";
}

export function immagineOg({ titolo, riga }: { titolo: string; riga: string }) {
  const { foglio, orecchia, fulmine, colori } = MARCHIO;
  const lungo = titolo.length > 60;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px 80px", background: "#343645", color: "#F5F6F2" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <svg width="76" height="76" viewBox="0 0 40 40">
            <path d={foglio} fill={colori.foglio} />
            <path d={orecchia} fill={colori.orecchia} />
            <path d={fulmine} fill={colori.fulmine} />
          </svg>
          <span style={{ fontSize: 46, fontWeight: 800 }}>PreventivoLampo</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: lungo ? 64 : 80, fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.02em" }}>{titolo}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#D5D7E0" }}>
            <div style={{ width: 64, height: 8, background: "#B2F601", borderRadius: 4, flexShrink: 0 }} />
            {riga}
          </div>
        </div>
      </div>
    ),
    DIMENSIONE_OG,
  );
}
