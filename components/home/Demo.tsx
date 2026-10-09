import { linkWhatsAppProva, WHATSAPP_PROVA } from "@/lib/sito";
import type { Dizionario } from "@/lib/i18n/it";
import { PiePagina } from "./PiePagina";

// Chiusura della home nella demo pubblica, al posto del modulo di candidatura.
export function Demo({ d }: { d: Dizionario }) {
  return (
    <section id="demo" className="su-scuro margini flex flex-col gap-6 bg-ardesia pb-7 pt-14 text-fondo lg:gap-[72px] lg:pb-12 lg:pt-28">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-[clamp(40px,5vw,72px)]">
        <h2 className="titolo-finale m-0">Il servizio non è in vendita. Il motore sì, funziona.</h2>
        <div className="flex flex-col gap-6">
          <p className="m-0 max-w-[520px] text-[17px] leading-normal text-scuro-testo lg:text-xl">
            PreventivoLampo è un progetto dimostrativo di Sofiane Khatib. Questa pagina racconta il prodotto come se fosse sul
            mercato; la parte che conta gira davvero. Incolli il testo di un sopralluogo e ricevi la bozza con i prezzi di un
            listino di prova, le domande su quello che manca, l&apos;IVA edile ripartita e il PDF per il cliente.
          </p>
          <ol className="m-0 flex max-w-[520px] list-decimal flex-col gap-1.5 pl-5 text-[15px] leading-normal text-scuro-testo lg:text-base">
            <li>
              Premi «Provalo su WhatsApp»: il messaggio «{WHATSAPP_PROVA.accesso}» è già scritto, tu premi invio.
            </li>
            <li>Scrivi il sopralluogo come lo racconteresti a un collega: misure, lavori, cosa porta il cliente.</li>
            <li>Ti arriva il riepilogo della bozza: rispondi «ok» e ricevi il link per aprirla.</li>
          </ol>
          <p className="m-0 max-w-[520px] text-sm text-scuro-testo">
            Per ora solo messaggi scritti: i vocali arrivano con il numero definitivo.
          </p>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-3.5">
            <a
              href="/prova"
              className="bottone bottone-azione-scuro py-4 text-[17px]"
            >
              Prova con un esempio
            </a>
            <a
              href={linkWhatsAppProva()}
              target="_blank"
              rel="noopener noreferrer"
              className="bottone border-2 border-cielo py-4 text-[17px] font-semibold text-fondo hover:bg-cielo hover:text-inchiostro"
            >
              Provalo su WhatsApp
            </a>
          </div>
        </div>
      </div>
      <PiePagina d={d}>Progetto dimostrativo di Sofiane Khatib. Listino, impresa e clienti degli esempi sono inventati.</PiePagina>
    </section>
  );
}

// Striscia in cima alla home: chi arriva deve capire subito che è una demo.
export function BannerDemo() {
  return (
    <aside aria-label="Progetto dimostrativo" className="margini m-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-cielo py-2 text-center text-sm font-medium text-inchiostro">
      <span>Progetto dimostrativo: il servizio non è in vendita.</span>
      <span className="flex gap-4">
        <a href="/prova" className="font-bold underline">
          Prova con un esempio
        </a>
        <a href={linkWhatsAppProva()} target="_blank" rel="noopener noreferrer" className="font-bold underline">
          Provalo su WhatsApp
        </a>
      </span>
    </aside>
  );
}
