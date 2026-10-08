import { GuardaEsempio } from "./demo/GuardaEsempio";

// Tutti i mestieri della casa: per ognuno una frase come si dice in cantiere e la riga che ne
// esce dal listino. Le prime cinque hanno l'esempio animato in cima alla pagina.

type Mestiere = { nome: string; detto: string; riga: string; esempio?: string };

const MESTIERI: Mestiere[] = [
  { nome: "Elettricista", detto: "sei punti luce, due deviati", riga: "Punto luce deviato · 2 cad", esempio: "elettricista" },
  { nome: "Idraulico", detto: "sposto il lavello di un metro e mezzo", riga: "Tubo PE-X Ø 16 · 1,5 m", esempio: "idraulico" },
  { nome: "Imbianchino", detto: "due mani di lavabile, centoventi metri", riga: "Idropittura lavabile · 120 m²", esempio: "imbianchino" },
  { nome: "Piastrellista", detto: "poso il gres che ha comprato lei", riga: "Posa gres, solo posa · m²", esempio: "piastrellista" },
  { nome: "Muratore", detto: "tre e venti per due e settanta", riga: "Tramezzo in forati · 8,64 m²", esempio: "muratore" },
  { nome: "Cartongessista", detto: "controsoffitto nel corridoio, sei per uno e dieci", riga: "Controsoffitto · 6,60 m²" },
  { nome: "Serramentista", detto: "tre finestre a due ante e una portafinestra", riga: "Finestra a due ante · 3 cad" },
  { nome: "Termoidraulico", detto: "cambio la caldaia, i radiatori restano", riga: "Sostituzione caldaia · 1 cad" },
  { nome: "Falegname", detto: "armadio a muro, due e quaranta per due e sessanta", riga: "Armadio su misura · 6,24 m²" },
  { nome: "Fabbro", detto: "ringhiera del balcone, sei metri", riga: "Ringhiera in ferro · 6 m" },
  { nome: "Giardiniere", detto: "siepe da tagliare, quaranta metri", riga: "Taglio siepe · 40 m" },
  { nome: "Impresa edile", detto: "bagno completo, chiavi in mano", riga: "Tutte le voci, una per riga" },
];

export function Mestieri() {
  return (
    <section id="mestieri" className="margini flex flex-col gap-8 py-14 lg:gap-14 lg:py-28">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <h2 className="titolo-h2 m-0">Ogni mestiere ha le sue parole. Il tuo listino le ha già.</h2>
        <p className="testo-base m-0 max-w-[560px] text-testo-2">
          Non devi imparare a parlare in un altro modo: dici le misure a spanne, i nomi che usi tu, «quello che ha comprato
          lei». Il sistema cerca fra le voci del tuo listino, rifà i conti delle misure e quello che non trova te lo segna.
        </p>
      </div>
      <ul tabIndex={0} aria-label="Esempi per mestiere" className="m-0 -mx-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] flex list-none snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] pb-2 [scrollbar-width:thin] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-px sm:overflow-hidden sm:rounded-[20px] sm:border sm:border-linea-2 sm:bg-linea-2 sm:p-0 xl:grid-cols-3">
        {MESTIERI.map((m) => (
          <li key={m.nome} className="flex w-[80%] shrink-0 snap-start flex-col gap-3 rounded-[18px] border border-linea-2 bg-superficie p-5 sm:w-auto sm:rounded-none sm:border-0 lg:p-6">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="m-0 text-[22px] font-extrabold leading-none [font-stretch:78%] lg:text-[24px]">{m.nome}</h3>
              {m.esempio && <GuardaEsempio id={m.esempio} />}
            </div>
            <p className="m-0 text-[17px] leading-snug text-testo-2">«{m.detto}»</p>
            <p className="m-0 mt-auto flex items-center gap-2 font-mono text-[13px] font-semibold">
              <span aria-hidden="true" className="text-lime-scuro">→</span>
              <span className="rounded-md bg-fondo px-2 py-1">{m.riga}</span>
            </p>
          </li>
        ))}
      </ul>
      <p className="m-0 max-w-[720px] text-[15px] leading-normal text-testo-3">
        <span className="sm:hidden">Scorri per vedere gli altri mestieri. </span>Righe di esempio. Funziona con qualunque listino a voci e misure: se il tuo mestiere non è qui, vale lo stesso.
      </p>
    </section>
  );
}
