import type { ReactNode } from "react";
import { Frasi } from "@/components/Frasi";
import type { LinguaSito } from "@/lib/i18n/lingue";
import { Briciole } from "./Briciole";

// Apertura scura delle pagine interne: percorso, titolo, sottotitolo e, se servono, i pulsanti.
export function TestaPagina({
  lingua,
  briciole,
  etichettaBriciole,
  h1,
  sottotitolo,
  children,
}: {
  lingua: LinguaSito;
  briciole: { nome: string; p: string }[];
  etichettaBriciole: string;
  h1: string;
  sottotitolo?: string;
  children?: ReactNode;
}) {
  return (
    <section className="su-scuro quadretti margini flex flex-col gap-6 bg-ardesia pb-14 pt-8 text-fondo lg:gap-8 lg:pb-20 lg:pt-12">
      <Briciole lingua={lingua} voci={briciole} etichetta={etichettaBriciole} />
      <h1 className="titolo-h2 m-0 max-w-[1000px]">
        <Frasi testo={h1} />
      </h1>
      {sottotitolo && <p className="testo-hero m-0 max-w-[720px] text-scuro-testo">{sottotitolo}</p>}
      {children}
    </section>
  );
}
