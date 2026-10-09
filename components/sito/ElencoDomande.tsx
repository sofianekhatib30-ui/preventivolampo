import { Ricco } from "@/components/Ricco";
import type { LinguaSito } from "@/lib/i18n/lingue";

// Domande e risposte con details/summary: si aprono senza JavaScript, il testo è nella pagina.
export function ElencoDomande({ titolo, voci, lingua, id = "domande" }: { titolo: string; voci: readonly { d: string; r: string }[]; lingua: LinguaSito; id?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-titolo`} className="margini grid gap-6 py-14 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16 lg:py-24">
      <h2 id={`${id}-titolo`} className="titolo-h2 m-0">
        {titolo}
      </h2>
      <div className="flex flex-col border-t border-linea-2">
        {voci.map((v, i) => (
          <details key={v.d} open={i === 0} className="group border-b border-linea-2">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[18px] font-bold leading-snug lg:text-[20px] [&::-webkit-details-marker]:hidden">
              {v.d}
              <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fondo-2 text-[20px] font-medium transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="m-0 max-w-[70ch] pb-5 text-[17px] leading-relaxed text-testo-2">
              <Ricco testo={v.r} lingua={lingua} classeLink="font-semibold text-cielo-scuro" />
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
