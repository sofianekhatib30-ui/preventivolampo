import { SaltaAlContenuto } from "./SaltaAlContenuto";
import { TestataApp } from "./TestataApp";

// Contenitore delle pagine legali. I testi veri li scrive Notaio in legale/ e li inserisce
// un passo successivo: fino ad allora la pagina dichiara che è una bozza.
export function PaginaLegale({ titolo }: { titolo: string }) {
  return (
    <>
      <SaltaAlContenuto />
      <TestataApp />
      <main id="contenuto" tabIndex={-1} className="margini py-14 outline-none lg:py-24">
        <article className="flex max-w-[760px] flex-col gap-6">
          <h1 className="titolo-h2 m-0">{titolo}</h1>
          <p className="m-0 self-start rounded-full bg-ambra px-4 py-2 font-mono text-sm font-semibold text-ambra-testo">
            Bozza in preparazione
          </p>
        </article>
      </main>
    </>
  );
}
