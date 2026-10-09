import { Ricco } from "@/components/Ricco";
import type { Sezione } from "@/lib/contenuti/tipi";
import type { LinguaSito } from "@/lib/i18n/lingue";

export const ancora = (i: number) => `sezione-${i + 1}`;

// Sezioni di testo di funzioni e guide: titolo, paragrafi, punti. Colonna di lettura stretta.
export function Sezioni({ sezioni, lingua }: { sezioni: readonly Sezione[]; lingua: LinguaSito }) {
  const link = "font-semibold text-cielo-scuro";
  return (
    <div className="flex flex-col gap-12 lg:gap-16">
      {sezioni.map((s, i) => (
        <section key={s.titolo} id={ancora(i)} aria-labelledby={`${ancora(i)}-t`} className="flex flex-col gap-4">
          <h2 id={`${ancora(i)}-t`} className="m-0 text-[28px] font-black leading-[1.05] [font-stretch:75%] lg:text-[36px]">
            {s.titolo}
          </h2>
          {s.paragrafi.map((par) => (
            <p key={par.slice(0, 40)} className="m-0 text-[17.5px] leading-[1.7] text-testo-2">
              <Ricco testo={par} lingua={lingua} classeLink={link} classeGrassetto="text-inchiostro" />
            </p>
          ))}
          {s.punti && s.punti.length > 0 && (
            <ul className="m-0 mt-2 flex list-none flex-col gap-4 p-0">
              {s.punti.map((pt) => (
                <li key={pt.titolo} className="rounded-[16px] border border-linea bg-superficie p-5">
                  <p className="m-0 text-[17.5px] font-extrabold [font-stretch:85%]">{pt.titolo}</p>
                  <p className="m-0 mt-1.5 text-[16.5px] leading-relaxed text-testo-2">
                    <Ricco testo={pt.testo} lingua={lingua} classeLink={link} classeGrassetto="text-inchiostro" />
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}

// Indice laterale delle sezioni (desktop), per saltare al punto che serve.
export function Indice({ sezioni, titolo }: { sezioni: readonly Sezione[]; titolo: string }) {
  return (
    <nav aria-label={titolo} className="hidden lg:block">
      <div className="sticky top-[112px] flex flex-col gap-3">
        <p className="m-0 text-[14px] font-bold text-testo-3">{titolo}</p>
        <ol className="m-0 flex list-none flex-col gap-2 border-s-2 border-linea-2 p-0">
          {sezioni.map((s, i) => (
            <li key={s.titolo}>
              <a href={`#${ancora(i)}`} className="-ms-[2px] block border-s-2 border-transparent ps-4 text-[15px] leading-snug text-testo-2 no-underline hover:border-lime-scuro hover:text-inchiostro">
                {s.titolo}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
