import { Ricco } from "@/components/Ricco";
import type { LinguaSito } from "@/lib/i18n/lingue";

// Punti con titolo, in griglia: non sono una sequenza, quindi niente numeri.
export function Punti({ punti, lingua, colonne = 2 }: { punti: readonly { titolo: string; testo: string }[]; lingua: LinguaSito; colonne?: 2 | 3 }) {
  return (
    <ul className={`m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2 ${colonne === 3 ? "lg:grid-cols-3" : ""}`}>
      {punti.map((pt) => (
        <li key={pt.titolo} className="border-s-[3px] border-lime-scuro ps-4">
          <h3 className="m-0 text-[19px] font-extrabold leading-tight [font-stretch:85%] lg:text-[21px]">{pt.titolo}</h3>
          <p className="m-0 mt-2 text-[16.5px] leading-relaxed text-testo-2">
            <Ricco testo={pt.testo} lingua={lingua} classeLink="font-semibold text-cielo-scuro" />
          </p>
        </li>
      ))}
    </ul>
  );
}
