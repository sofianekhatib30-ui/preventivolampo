import type { ReactNode } from "react";
import type { Dizionario } from "@/lib/i18n/it";
import type { LinguaSito } from "@/lib/i18n/lingue";
import { fmt } from "@/lib/i18n/testo";
import { CONTACT_EMAIL } from "@/lib/sito";
import { Ricco } from "./Ricco";

type Blocco = Dizionario["legale"]["privacy"]["blocchi"][number];

// Corpo delle pagine legali del servizio (privacy, condizioni, cookie), dentro il guscio delle pagine pubbliche. Il testo che fa fede è l'italiano:
// nelle altre lingue la pagina lo dice in cima.
export function PaginaLegale({
  d,
  lingua,
  titolo,
  aggiornata,
  blocchi,
  children,
}: {
  d: Dizionario;
  lingua: LinguaSito;
  titolo: string;
  aggiornata: string; // data ISO
  blocchi: readonly Blocco[];
  children?: ReactNode;
}) {
  const data = new Date(`${aggiornata}T12:00:00`).toLocaleDateString(lingua === "ar" ? "ar-MA" : lingua, { day: "numeric", month: "long", year: "numeric" });
  return (
    <>
      <div className="margini py-12 lg:py-20">
        <article className="testo-legale flex max-w-[68ch] flex-col gap-4 text-[17px] leading-relaxed text-testo-2">
          <h1 className="titolo-h2 m-0 text-inchiostro">{titolo}</h1>
          <p className="m-0 text-[15px] text-testo-3">{fmt(d.comune.aggiornata, { data })}</p>
          {lingua !== "it" && <p className="m-0 rounded-campo bg-ambra px-4 py-3 text-[15px] font-semibold text-ambra-testo">{d.comune.faFede}</p>}
          {blocchi.map((b, i) => {
            const testo = (s: string) => <Ricco lingua={lingua} testo={fmt(s, { email: CONTACT_EMAIL })} classeLink="font-semibold text-cielo-scuro" classeGrassetto="text-inchiostro" />;
            if (b.t === "h2") return <h2 key={i}>{"testo" in b ? b.testo : ""}</h2>;
            if (b.t === "h3") return <h3 key={i} className="m-0 mt-2 text-[18px] font-bold text-inchiostro">{"testo" in b ? b.testo : ""}</h3>;
            if (b.t === "ul")
              return (
                <ul key={i}>
                  {("voci" in b && b.voci ? b.voci : []).map((v, j) => (
                    <li key={j}>{testo(v)}</li>
                  ))}
                </ul>
              );
            return <p key={i}>{testo("testo" in b && b.testo ? b.testo : "")}</p>;
          })}
          {children}
        </article>
      </div>
    </>
  );
}
