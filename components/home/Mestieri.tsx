import type { Dizionario } from "@/lib/i18n/it";
import { GuardaEsempio } from "./demo/GuardaEsempio";

// Tutti i mestieri della casa: per ognuno una frase come si dice in cantiere (nella lingua della
// pagina) e la riga che ne esce dal listino, sempre in italiano. Le prime cinque hanno l'esempio animato.

type Chiave = keyof Dizionario["mestieri"]["voci"];
const RIGHE: { id: Chiave; riga: string; esempio?: string }[] = [
  { id: "elettricista", riga: "Punto luce deviato · 2 cad", esempio: "elettricista" },
  { id: "idraulico", riga: "Tubo PE-X Ø 16 · 1,5 m", esempio: "idraulico" },
  { id: "imbianchino", riga: "Idropittura lavabile · 120 m²", esempio: "imbianchino" },
  { id: "piastrellista", riga: "Posa gres, solo posa · m²", esempio: "piastrellista" },
  { id: "muratore", riga: "Tramezzo in forati · 8,64 m²", esempio: "muratore" },
  { id: "cartongessista", riga: "Controsoffitto · 6,60 m²" },
  { id: "serramentista", riga: "Finestra a due ante · 3 cad" },
  { id: "termoidraulico", riga: "Sostituzione caldaia · 1 cad" },
  { id: "falegname", riga: "Armadio su misura · 6,24 m²" },
  { id: "fabbro", riga: "Ringhiera in ferro · 6 m" },
  { id: "giardiniere", riga: "Taglio siepe · 40 m" },
  { id: "impresa", riga: "Tutte le voci, una per riga" },
];

export function Mestieri({ d }: { d: Dizionario }) {
  const M = d.mestieri;
  return (
    <section id="mestieri" className="margini flex flex-col gap-8 py-14 lg:gap-14 lg:py-28">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <h2 className="titolo-h2 m-0">{M.titolo}</h2>
        <p className="testo-base m-0 max-w-[560px] text-testo-2">{M.testo}</p>
      </div>
      <ul
        tabIndex={0}
        aria-label={M.etichettaLista}
        className="m-0 -mx-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] flex list-none snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] pb-2 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-[20px] sm:border sm:border-linea-2 sm:bg-linea-2 sm:p-0 xl:grid-cols-3"
      >
        {RIGHE.map((m) => (
          <li key={m.id} className="flex w-[80%] shrink-0 snap-start flex-col gap-3 rounded-[18px] border border-linea-2 bg-superficie p-5 sm:w-auto sm:rounded-none sm:border-0 lg:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="m-0 text-[22px] font-extrabold leading-none [font-stretch:78%] lg:text-[24px]">{M.voci[m.id].nome}</h3>
              {m.esempio && <GuardaEsempio id={m.esempio} testo={M.guarda} />}
            </div>
            <p className="m-0 text-[17px] leading-snug text-testo-2">«{M.voci[m.id].detto}»</p>
            <p className="m-0 mt-auto flex items-center gap-2 font-mono text-[13px] font-semibold">
              <span aria-hidden="true" className="text-lime-scuro rtl:-scale-x-100">→</span>
              <span lang="it" dir="ltr" className="rounded-md bg-fondo px-2 py-1">
                {m.riga}
              </span>
            </p>
          </li>
        ))}
      </ul>
      <p className="m-0 max-w-[720px] text-[15px] leading-normal text-testo-3">
        <span className="sm:hidden">{M.scorri} </span>
        {M.nota}
      </p>
    </section>
  );
}
