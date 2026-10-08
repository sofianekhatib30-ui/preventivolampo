import { Suspense } from "react";
import { etichettaPosti, leggiPostiLiberi, POSTI_PILOTA } from "@/lib/impresa/posti";
import { candidatureAperte } from "@/lib/sito";

const cardChiara =
  "flex flex-col gap-2.5 rounded-[20px] border border-linea bg-superficie p-6 lg:gap-[18px] lg:rounded-card lg:p-10";
const titoloCard = "m-0 text-2xl font-extrabold [font-stretch:78%] lg:text-[28px]";
const cifra = "whitespace-nowrap [font-weight:850] leading-none [font-stretch:68%]";
const listaDesktop = "m-0 hidden list-disc pl-5 text-base leading-[1.8] text-testo-2 lg:block";
const notaDesktop = "m-0 mt-auto hidden text-sm leading-normal text-testo-3 lg:block";

export function Prezzi() {
  const aperte = candidatureAperte();
  return (
    <section id="prezzi" className="margini flex flex-col gap-4 bg-fondo-2 py-14 lg:gap-12 lg:py-28">
      <div className="flex max-w-[760px] flex-col gap-4">
        <h2 className="titolo-h2 m-0 mb-2 lg:mb-0">
          Prima lo provi sui tuoi lavori veri. Poi decidi.
        </h2>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-5">
        <article className="su-scuro flex flex-col gap-3 rounded-[20px] bg-ardesia p-6 text-fondo lg:gap-[18px] lg:rounded-card lg:p-10">
          <Suspense fallback={<PostiPilota posti={null} />}>
            <PostiDalDatabase />
          </Suspense>
          <h3 className="m-0 text-[26px] font-extrabold [font-stretch:78%] lg:text-[32px]">
            Programma pilota
          </h3>
          <p className="m-0 flex items-baseline gap-2 lg:gap-2.5">
            <span className={`${cifra} text-[56px] lg:text-[72px]`}>0 €</span>
            <span className="text-base text-scuro-testo lg:text-lg">per 60 giorni</span>
          </p>
          <p className="m-0 text-base leading-[1.55] text-scuro-testo lg:text-[17px]">
            Preventivi illimitati e assistenza se ti serve. In cambio ci dici cosa non funziona.{" "}
            Dal 61° giorno 19,90 € al mese o 199 € l&apos;anno, solo se decidi di restare: nessun rinnovo automatico.
          </p>
          <a
            href={aperte ? "#candidatura" : "/prova"}
            className="bottone bottone-azione-scuro mt-auto py-[15px] text-[17px] lg:py-4"
          >
            {aperte ? "Candidati" : "Prova con un esempio"}
          </a>
        </article>

        <article className={cardChiara}>
          <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-[18px]">
            <h3 className={titoloCard}>Mensile</h3>
            <p className="m-0 flex flex-wrap items-baseline gap-x-2.5">
              <span className={`${cifra} text-4xl lg:text-[64px]`}>
                19,90 €
                <span className="text-base font-medium [font-stretch:100%] lg:hidden"> /mese</span>
              </span>
              <span className="hidden text-base text-testo-3 lg:inline">al mese</span>
            </p>
          </div>
          <ul className={listaDesktop}>
            <li>Preventivi illimitati</li>
            <li>Link di accettazione per il cliente</li>
            <li>Assistenza da una persona</li>
          </ul>
          <p className={notaDesktop}>Nessun costo di avvio. Disdici quando vuoi, senza vincoli.</p>
          <p className="m-0 text-[15px] leading-[1.55] text-testo-2 lg:hidden">
            Preventivi illimitati, link di accettazione per il cliente, assistenza da una persona. Nessun
            costo di avvio. Disdici quando vuoi.
          </p>
        </article>

        <article className={cardChiara}>
          <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-stretch lg:gap-[18px]">
            <h3 className={titoloCard}>Annuale</h3>
            <p className="m-0 flex flex-wrap items-baseline gap-x-2.5">
              <span className={`${cifra} text-4xl lg:text-[64px]`}>
                199 €
                <span className="text-base font-medium [font-stretch:100%] lg:hidden"> /anno</span>
              </span>
              <span className="hidden text-base text-testo-3 lg:inline">all&apos;anno</span>
            </p>
          </div>
          <ul className={listaDesktop}>
            <li>Tutto quello del mensile</li>
            <li>Due mesi in regalo</li>
            <li>Si rinnova solo se lo chiedi tu</li>
          </ul>
          <p className={notaDesktop}>Prezzi IVA esclusa.</p>
          <p className="m-0 text-[15px] leading-[1.55] text-testo-2 lg:hidden">
            Tutto quello del mensile, con due mesi in regalo. Si rinnova solo se lo chiedi tu.
          </p>
        </article>
      </div>
      <p className="m-0 text-[13px] text-testo-3 lg:hidden">Prezzi IVA esclusa.</p>
    </section>
  );
}

// Contatore dei posti del pilota. Il numero viene dal database (imprese accettate nel pilota);
// se non è disponibile resta la scritta fissa, senza numero inventato.
async function PostiDalDatabase() {
  return <PostiPilota posti={await leggiPostiLiberi()} />;
}

function PostiPilota({ posti }: { posti: number | null }) {
  return (
    <>
      <p className="m-0 self-start rounded-full border border-cielo px-2.5 py-[5px] font-mono text-xs font-semibold text-cielo lg:px-3 lg:py-1.5 lg:text-[13px]">
        {posti === null ? `${POSTI_PILOTA} posti` : etichettaPosti(posti)}
      </p>
      {posti !== null && (
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: POSTI_PILOTA }, (_, i) => (
            <span
              key={i}
              className={`h-2 flex-1 rounded-full ${i < POSTI_PILOTA - posti ? "bg-cielo" : "border border-cielo/50"}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
