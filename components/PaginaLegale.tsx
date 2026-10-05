import type { ReactNode } from "react";
import { SaltaAlContenuto } from "./SaltaAlContenuto";
import { TestataApp } from "./TestataApp";

// Pagine legali della demo. Il servizio non è in vendita: queste pagine descrivono la demo
// pubblica (cosa si raccoglie, dove va, quando si cancella), non un contratto commerciale.
export function PaginaLegale({ titolo, aggiornata, children }: { titolo: string; aggiornata: string; children: ReactNode }) {
  return (
    <>
      <SaltaAlContenuto />
      <TestataApp />
      <main id="contenuto" tabIndex={-1} className="margini py-12 outline-none lg:py-20">
        <article className="testo-legale flex max-w-[68ch] flex-col gap-4 text-[17px] leading-relaxed text-testo-2">
          <h1 className="titolo-h2 m-0 text-inchiostro">{titolo}</h1>
          <p className="m-0 text-[15px] text-testo-3">Progetto dimostrativo · aggiornata il {aggiornata}</p>
          {children}
        </article>
      </main>
    </>
  );
}
