import { EsagoniVivi } from "@/components/home/EsagoniVivi";
import { ctaPrincipale } from "@/components/home/Header";
import { Logo } from "@/components/home/Logo";
import type { Contenuti } from "@/lib/contenuti";
import { FUNZIONI, GUIDE, MESTIERI, percorsoFunzione, percorsoGuida, percorsoMestiere } from "@/lib/contenuti/registro";
import type { Dizionario } from "@/lib/i18n/it";
import { type LinguaSito, percorso } from "@/lib/i18n/lingue";

// Piè di pagina di tutte le pagine pubbliche: la mappa del sito, così ogni pagina è a un clic da tutte le altre.
// Rifatto l'11/10/2026 (Sofiane, sugli schermi larghi: «sistema anche qua il footer che cosi non si puo vedere»):
// a sinistra il marchio con la regola del listino e il pulsante, poi le colonne; i mestieri su due colonne invece
// di una lista lunga; in fondo chi fa il servizio e le pagine legali. Larghezza come la testata (margini).
export function Piede({ d, c, lingua }: { d: Dizionario; c: Contenuti; lingua: LinguaSito }) {
  const p = (x: string) => percorso(lingua, x);
  const cta = ctaPrincipale(d, lingua);
  const colonne: { titolo: string; voci: { href: string; label: string }[]; due?: boolean }[] = [
    { titolo: c.ui.piede.mestieri, voci: MESTIERI.map((m) => ({ href: p(percorsoMestiere(m)), label: c.mestieri[m].nome })), due: true },
    { titolo: c.ui.piede.funzioni, voci: FUNZIONI.map((f) => ({ href: p(percorsoFunzione(f)), label: c.funzioni[f].nome })) },
    {
      titolo: c.ui.piede.risorse,
      voci: [
        ...GUIDE.map((g) => ({ href: p(percorsoGuida(g)), label: c.guide[g].nome })),
        { href: p("/modelli"), label: d.nav.modelli },
        { href: p("/glossario"), label: d.nav.glossario },
      ],
    },
    {
      titolo: c.ui.piede.servizio,
      voci: [
        { href: p("/prezzi"), label: d.nav.prezzi },
        { href: p("/chi-siamo"), label: d.nav.chiSiamo },
      ],
    },
  ];
  const legali = [
    { href: p("/privacy"), label: d.comune.privacy },
    { href: p("/cookie"), label: d.comune.cookie },
    { href: p("/condizioni"), label: d.comune.condizioni },
  ];
  return (
    <footer className="su-scuro margini relative isolate mt-auto overflow-hidden bg-ardesia-2 pb-8 pt-14 text-scuro-testo lg:pt-20">
      <EsagoniVivi />
      <div className="grid gap-x-10 gap-y-12 lg:grid-cols-[minmax(220px,0.8fr)_minmax(0,2.8fr)] xl:gap-x-20">
        <div className="max-w-[26rem]">
          <Logo href={p("/")} etichetta={d.comune.logoHome} marchioScuro />
          <p className="m-0 mt-5 text-[15px] leading-[1.6] text-scuro-testo">{d.hero.garanzia}</p>
          <a
            href={cta.href}
            className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-lime px-6 py-3 text-[15.5px] font-semibold text-ardesia-2 no-underline hover:bg-cielo"
          >
            {cta.label}
          </a>
        </div>
        <nav aria-label={c.ui.piede.risorse} className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-[2fr_1.2fr_1.5fr_0.8fr]">
          {colonne.map((col) => (
            <div key={col.titolo} className={col.due ? "col-span-2 md:col-span-1" : undefined}>
              <p className="m-0 mb-3 text-[13px] font-bold uppercase tracking-[.08em] text-fondo">{col.titolo}</p>
              <ul className={`m-0 list-none p-0 ${col.due ? "grid grid-cols-2 gap-x-6" : "flex flex-col"}`}>
                {col.voci.map((v) => (
                  <li key={v.href}>
                    <a href={v.href} className="flex min-h-9 items-center text-[15px] no-underline hover:text-lime hover:underline">
                      {v.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-scuro-linea pt-6 text-[14px]">
        <a href="https://kdigitalsolution.it/prodotti/" className="no-underline hover:text-lime hover:underline">
          {d.comune.servizioDi}
        </a>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0" aria-label={d.comune.infoLegali}>
          {legali.map((v) => (
            <li key={v.href}>
              <a href={v.href} className="flex min-h-9 items-center no-underline hover:text-lime hover:underline">
                {v.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
