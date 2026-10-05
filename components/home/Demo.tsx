import { REPO_URL } from "@/lib/sito";
import { PiePagina } from "./PiePagina";

// Chiusura della home nella demo pubblica, al posto del modulo di candidatura.
export function Demo() {
  return (
    <section id="demo" className="margini flex flex-col gap-6 bg-segnale pb-7 pt-14 lg:gap-[72px] lg:pb-12 lg:pt-28">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-[clamp(40px,5vw,72px)]">
        <h2 className="titolo-finale m-0">Il servizio non è in vendita. Il motore sì, funziona.</h2>
        <div className="flex flex-col gap-6">
          <p className="m-0 max-w-[520px] text-[17px] leading-normal lg:text-xl">
            PreventivoLampo è un progetto dimostrativo di Sofiane Khatib. Questa pagina racconta il prodotto come se fosse sul
            mercato; la parte che conta gira davvero. Incolli il testo di un sopralluogo e ricevi la bozza con i prezzi di un
            listino di prova, le domande su quello che manca, l&apos;IVA edile ripartita e il PDF per il cliente.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3.5">
            <a
              href="/prova"
              className="flex min-h-11 items-center justify-center rounded-full bg-inchiostro px-6 py-4 text-[17px] font-extrabold text-fondo no-underline hover:text-fondo"
            >
              Prova la demo
            </a>
            <a
              href={REPO_URL}
              className="flex min-h-11 items-center justify-center rounded-full border-2 border-inchiostro px-6 py-4 text-[17px] font-semibold no-underline"
            >
              Leggi il codice su GitHub
            </a>
          </div>
        </div>
      </div>
      <PiePagina>Progetto dimostrativo di Sofiane Khatib. Listino, impresa e clienti degli esempi sono inventati.</PiePagina>
    </section>
  );
}

// Striscia in cima alla home: chi arriva deve capire subito che è una demo.
export function BannerDemo() {
  return (
    <p className="margini m-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-inchiostro py-2.5 text-center text-sm text-fondo">
      <span>Progetto dimostrativo: il servizio non è in vendita.</span>
      <a href="/prova" className="font-bold text-fondo underline hover:text-fondo">
        Prova la demo
      </a>
    </p>
  );
}
