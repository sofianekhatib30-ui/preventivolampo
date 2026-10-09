import type { Contenuti } from "@/lib/contenuti";
import type { EsempioMotore } from "@/lib/contenuti/esempi";
import { fmt } from "@/lib/i18n/testo";
import { type LinguaSito } from "@/lib/i18n/lingue";

const UNITA: Record<string, string> = { m2: "m²", m3: "m³", m: "m", cad: "cad", h: "h", corpo: "a corpo", kg: "kg", l: "l", "100kg": "q" };

function quantita(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(".", ",");
}

function dataLunga(iso: string, lingua: LinguaSito) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString(lingua === "ar" ? "ar-MA" : lingua, { day: "numeric", month: "long", year: "numeric" });
}

// L'esempio della pagina mestiere: a sinistra il vocale (testo inventato, in italiano),
// a destra la bozza che il sistema ne ha ricavato davvero (lib/contenuti/esempi), senza prezzi.
export function EsempioBozza({ c, lingua, lavoro, esempio, etichettaVoci }: { c: Contenuti; lingua: LinguaSito; lavoro: string; esempio: EsempioMotore; etichettaVoci: string }) {
  const U = c.ui.mestiere;
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
      <figure className="m-0 flex flex-col gap-3">
        <figcaption className="text-[15px] font-bold text-testo-3">{U.racconti}</figcaption>
        <div className="rounded-[22px] rounded-ss-md bg-bolla-mia p-5 shadow-[0_1px_0_rgba(31,32,41,0.08)] lg:p-6">
          <p className="m-0 mb-3 flex items-center gap-2 text-[14px] font-semibold text-lime-scuro">
            <svg viewBox="0 0 20 20" aria-hidden="true" className="size-4" fill="currentColor">
              <path d="M10 13a3 3 0 0 0 3-3V5a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-4 4.9V17h2v1.5H7V17h2v-2.1A5 5 0 0 1 5 10h1.5a3.5 3.5 0 0 0 7 0H15Z" />
            </svg>
            {U.vocale} · {lavoro}
          </p>
          <p lang="it" dir="ltr" className="m-0 text-[17px] leading-relaxed text-inchiostro">
            «{esempio.dettatura}»
          </p>
        </div>
        {lingua !== "it" && <p className="m-0 text-[14px] text-testo-3">{U.raccontaInLingua}</p>}
      </figure>

      <figure className="m-0 flex flex-col gap-3">
        <figcaption className="text-[15px] font-bold text-testo-3">{U.ricevi}</figcaption>
        <div className="overflow-hidden rounded-[20px] border border-linea-2 bg-scontrino">
          <p className="m-0 flex items-center justify-between gap-3 border-b border-linea px-5 py-3 text-[14px] font-semibold text-testo-3">
            <span>{U.bozza}</span>
            <span>{fmt(etichettaVoci, { n: esempio.righe.length })}</span>
          </p>
          <ul lang="it" dir="ltr" className="m-0 list-none divide-y divide-riga p-0">
            {esempio.righe.map((r, i) => (
              <li key={i} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 px-5 py-3">
                <span className="text-[16px] font-semibold leading-snug first-letter:uppercase">{r.voce}</span>
                <span className="text-end font-mono text-[15px] font-semibold">
                  {r.quantita === null ? <span className="rounded-md bg-ambra px-1.5 py-0.5 text-[13px] text-ambra-testo">{U.daChiedere}</span> : `${quantita(r.quantita)} ${r.unita ? UNITA[r.unita] ?? r.unita : ""}`}
                </span>
                <span className="text-[14px] leading-snug text-testo-3">
                  {r.materialeCliente ? `${U.materialeCliente}. ` : ""}
                  {r.nota ?? ""}
                </span>
                <span className="text-end text-[13px] text-testo-3">{U.prezzo}</span>
              </li>
            ))}
          </ul>
          {esempio.domande.length > 0 && (
            <div className="border-t border-linea bg-ambra/50 px-5 py-4">
              <p className="m-0 mb-2 text-[14px] font-bold text-ambra-testo">{U.domande}</p>
              <ul lang="it" dir="ltr" className="m-0 flex list-none flex-col gap-1.5 p-0 text-[15px] text-inchiostro">
                {esempio.domande.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {esempio.escluso.length > 0 && (
            <div className="border-t border-linea px-5 py-4">
              <p className="m-0 mb-2 text-[14px] font-bold text-testo-3">{U.escluso}</p>
              <ul lang="it" dir="ltr" className="m-0 list-disc ps-5 text-[15px] text-testo-2">
                {esempio.escluso.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className="m-0 text-[14px] leading-normal text-testo-3">{fmt(U.didascalia, { data: dataLunga(esempio.data, lingua) })}</p>
      </figure>
    </div>
  );
}
