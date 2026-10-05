import Link from "next/link";
import { LogoMark } from "./home/Logo";
import { SaltaAlContenuto } from "./SaltaAlContenuto";

// Contenitore delle pagine legali. I testi veri li scrive Notaio in legale/ e li inserisce
// un passo successivo: fino ad allora la pagina dichiara che è una bozza.
export function PaginaLegale({ titolo }: { titolo: string }) {
  return (
    <>
      <SaltaAlContenuto />
      <header className="margini flex h-16 items-center border-b border-linea bg-fondo lg:h-[88px]">
        <Link href="/" className="flex min-h-11 items-center gap-2.5 no-underline lg:gap-3">
          <LogoMark className="size-8 lg:size-10" />
          <span className="text-[22px] font-extrabold tracking-[-0.01em] [font-stretch:78%] lg:text-[26px]">
            PreventivoLampo
          </span>
        </Link>
      </header>
      <main id="contenuto" tabIndex={-1} className="margini py-14 outline-none lg:py-24">
        <article className="flex max-w-[760px] flex-col gap-6">
          <h1 className="titolo-h2 m-0">{titolo}</h1>
          <p className="m-0 self-start rounded-full bg-segnale px-4 py-2 font-mono text-sm font-semibold">
            Bozza in preparazione
          </p>
        </article>
      </main>
    </>
  );
}
