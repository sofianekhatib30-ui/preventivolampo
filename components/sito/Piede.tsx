import type { Contenuti } from "@/lib/contenuti";
import { FUNZIONI, GUIDE, MESTIERI, percorsoFunzione, percorsoGuida, percorsoMestiere } from "@/lib/contenuti/registro";
import type { Dizionario } from "@/lib/i18n/it";
import { type LinguaSito, percorso } from "@/lib/i18n/lingue";

// Piè di pagina di tutte le pagine pubbliche: la mappa del sito, così ogni pagina è a un clic da tutte le altre.
export function Piede({ d, c, lingua }: { d: Dizionario; c: Contenuti; lingua: LinguaSito }) {
  const p = (x: string) => percorso(lingua, x);
  const colonne: { titolo: string; voci: { href: string; label: string }[] }[] = [
    { titolo: c.ui.piede.mestieri, voci: MESTIERI.map((m) => ({ href: p(percorsoMestiere(m)), label: c.mestieri[m].nome })) },
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
        { href: p("/privacy"), label: d.comune.privacy },
        { href: p("/cookie"), label: d.comune.cookie },
        { href: p("/condizioni"), label: d.comune.condizioni },
      ],
    },
  ];
  return (
    <footer className="su-scuro margini mt-auto bg-ardesia-2 py-12 text-scuro-testo lg:py-16">
      <nav aria-label={c.ui.piede.risorse} className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 lg:gap-8">
        {colonne.map((col) => (
          <div key={col.titolo}>
            <p className="m-0 mb-3 text-[15px] font-bold text-fondo">{col.titolo}</p>
            <ul className="m-0 flex list-none flex-col p-0">
              {col.voci.map((v) => (
                <li key={v.href}>
                  <a href={v.href} className="flex min-h-10 items-center text-[15px] no-underline hover:text-lime hover:underline">
                    {v.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <p className="m-0 mt-10 border-t border-scuro-linea pt-6 text-[14px]">{d.comune.servizioDi}</p>
    </footer>
  );
}
