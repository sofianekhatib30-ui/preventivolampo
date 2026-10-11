import { ListaRotella } from "@/components/home/ListaRotella";
import { Frasi } from "@/components/Frasi";
import { type IdMestiere, MESTIERI, percorsoMestiere } from "@/lib/contenuti/registro";
import type { Dizionario } from "@/lib/i18n/it";
import { type LinguaSito, percorso } from "@/lib/i18n/lingue";
import { GuardaEsempio } from "./demo/GuardaEsempio";

// Mestieri diversi, non solo della casa (Sofiane, 11/10/2026: «anche i mestieri sono troppo edili»): per ognuno
// una frase come la direbbe chi lo fa (nella lingua della pagina) e la riga che ne esce dal listino, sempre in
// italiano. Quelli con l'esempio animato lo aprono nella hero; il nome porta alla pagina del mestiere solo se
// la pagina esiste (oggi i mestieri della casa).

type Chiave = keyof Dizionario["mestieri"]["voci"];
const RIGHE: { id: Chiave; riga: string; esempio?: string }[] = [
  { id: "elettricista", riga: "Punto luce deviato · 2 cad", esempio: "elettricista" },
  { id: "fotografo", riga: "Album 30 pagine · 1 cad", esempio: "fotografo" },
  { id: "officina", riga: "Tagliando con filtri · 1 cad", esempio: "officina" },
  { id: "catering", riga: "Buffet salato e dolce · 60 persone", esempio: "catering" },
  { id: "idraulico", riga: "Tubo PE-X Ø 16 · 1,5 m", esempio: "idraulico" },
  { id: "informatico", riga: "Configurazione postazione · 5 cad" },
  { id: "grafico", riga: "Volantini A5 · 1000 pz" },
  { id: "imbianchino", riga: "Idropittura lavabile · 120 m²", esempio: "imbianchino" },
  { id: "carrozzeria", riga: "Verniciatura paraurti · 1 cad" },
  { id: "allestimenti", riga: "Noleggio sedie · 100 cad" },
  { id: "traslochi", riga: "Trasloco trilocale, 3° piano · 1 cad" },
  { id: "giardiniere", riga: "Taglio siepe · 40 m" },
];
const pagina = (id: Chiave): IdMestiere | null => (MESTIERI as readonly string[]).includes(id) ? (id as IdMestiere) : null;

export function Mestieri({ d, lingua }: { d: Dizionario; lingua: LinguaSito }) {
  const M = d.mestieri;
  return (
    <section id="mestieri" className="margini flex flex-col gap-8 py-14 lg:gap-14 lg:py-28">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <h2 className="titolo-h2 m-0"><Frasi testo={M.titolo} /></h2>
        <p className="testo-base m-0 max-w-[560px] text-testo-2">{M.testo}</p>
      </div>
      <ListaRotella
        tabIndex={0}
        aria-label={M.etichettaLista}
        className="m-0 -mx-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] flex list-none snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-[20px] sm:border sm:border-linea-2 sm:bg-linea-2 sm:p-0 xl:grid-cols-3"
      >
        {RIGHE.map((m) => (
          <li key={m.id} className="flex w-[80%] shrink-0 snap-start flex-col items-center gap-3 text-center rounded-[18px] border border-linea-2 bg-superficie p-5 sm:w-auto sm:rounded-none sm:border-0 lg:p-6">
            <div className="flex flex-col items-center gap-2">
              <h3 className="m-0 text-[22px] font-extrabold leading-none [font-stretch:78%] lg:text-[24px]">
                {pagina(m.id) ? (
                  <a href={percorso(lingua, percorsoMestiere(pagina(m.id)!))} className="decoration-lime-scuro decoration-2 underline-offset-4 hover:text-lime-scuro">
                    {M.voci[m.id].nome}
                  </a>
                ) : (
                  M.voci[m.id].nome
                )}
              </h3>
              {m.esempio && <GuardaEsempio id={m.esempio} testo={M.guarda} />}
            </div>
            <p className="m-0 text-[17px] leading-snug text-testo-2">«{M.voci[m.id].detto}»</p>
            <p className="m-0 mt-auto flex items-center justify-center gap-2 font-mono text-[13px] font-semibold">
              <span aria-hidden="true" className="text-lime-scuro rtl:-scale-x-100">→</span>
              <span lang="it" dir="ltr" className="rounded-md bg-fondo px-2 py-1">
                {m.riga}
              </span>
            </p>
          </li>
        ))}
      </ListaRotella>
      <p className="m-0 max-w-[720px] text-[15px] leading-normal text-testo-3">
        <span className="sm:hidden">{M.scorri} </span>
        {M.nota}
      </p>
    </section>
  );
}
