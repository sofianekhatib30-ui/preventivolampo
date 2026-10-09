import { Frasi } from "@/components/Frasi";
import { ctaPrincipale } from "@/components/home/Header";
import type { Dizionario } from "@/lib/i18n/it";
import type { LinguaSito } from "@/lib/i18n/lingue";

// Chiusura delle pagine: un titolo, una riga, il pulsante del pilota (o della prova, a candidature chiuse).
export function CtaFinale({ d, lingua, titolo, testo }: { d: Dizionario; lingua: LinguaSito; titolo: string; testo: string }) {
  const cta = ctaPrincipale(d, lingua);
  return (
    <section className="su-scuro quadretti margini flex flex-col items-start gap-6 bg-ardesia py-16 text-fondo lg:py-24">
      <h2 className="titolo-h2 m-0 max-w-[900px]">
        <Frasi testo={titolo} />
      </h2>
      <p className="testo-hero m-0 max-w-[620px] text-scuro-testo">{testo}</p>
      <a href={cta.href} className="bottone bottone-azione-scuro py-4 text-[17px] lg:px-7 lg:text-lg">
        {cta.label}
      </a>
    </section>
  );
}
