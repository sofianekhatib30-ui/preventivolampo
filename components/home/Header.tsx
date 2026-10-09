import { SceltaLingua } from "@/components/SceltaLingua";
import type { Contenuti } from "@/lib/contenuti";
import { FUNZIONI, MESTIERI, percorsoFunzione, percorsoMestiere } from "@/lib/contenuti/registro";
import type { Dizionario } from "@/lib/i18n/it";
import { type LinguaSito, percorso } from "@/lib/i18n/lingue";
import { configurato } from "@/lib/impresa/db";
import { candidatureAperte } from "@/lib/sito";
import { Logo } from "./Logo";
import { type GruppoMenu, MenuMobile } from "./MenuMobile";

// Con le candidature chiuse (demo pubblica) la chiamata all'azione porta alla prova del motore.
export function ctaPrincipale(d: Dizionario, lingua: LinguaSito = "it") {
  return candidatureAperte() ? ({ href: percorso(lingua, "/#candidatura"), label: d.comune.ctaPilota } as const) : ({ href: "/prova", label: d.comune.ctaProva } as const);
}

export function Header({ d, c, lingua }: { d: Dizionario; c: Contenuti; lingua: LinguaSito }) {
  const CTA_PILOTA = ctaPrincipale(d, lingua);
  const p = (x: string) => percorso(lingua, x);
  const NAV = [
    { href: p("/mestieri"), label: d.nav.mestieri },
    { href: p("/funzioni"), label: d.nav.come },
    { href: p("/prezzi"), label: d.nav.prezzi },
    { href: p("/guide"), label: d.nav.guide },
  ];
  // Menu del telefono: tutte le pagine, raggruppate.
  const gruppi: GruppoMenu[] = [
    { titolo: d.nav.mestieri, colonne: true, voci: MESTIERI.map((m) => ({ href: p(percorsoMestiere(m)), label: c.mestieri[m].nome })) },
    { titolo: d.nav.come, voci: FUNZIONI.map((f) => ({ href: p(percorsoFunzione(f)), label: c.funzioni[f].nome })) },
    {
      titolo: d.nav.risorse,
      voci: [
        { href: p("/prezzi"), label: d.nav.prezzi },
        { href: p("/guide"), label: d.nav.guide },
        { href: p("/modelli"), label: d.nav.modelli },
        { href: p("/glossario"), label: d.nav.glossario },
        { href: p("/chi-siamo"), label: d.nav.chiSiamo },
      ],
    },
  ];
  // Chi ha già un account entra da qui: sempre a vista, anche sul telefono accanto al menu.
  const area = configurato();
  return (
    <header className="su-scuro margini sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-scuro-linea bg-ardesia text-fondo lg:h-[80px]">
      {/* Sui telefoni più stretti il nome si stringe e non spinge fuori lingua, «Accedi» e il menu */}
      <div className="min-w-0 [&_a]:min-w-0 [&_span]:truncate max-[439px]:[&_span]:text-[17px] max-[359px]:[&_span]:text-[15px]">
        <Logo href={p("/")} etichetta={d.comune.logoHome} />
      </div>
      <nav aria-label={d.comune.principale} className="hidden items-center gap-5 font-medium xl:flex">
        {NAV.map((link) => (
          <a key={link.href} href={link.href} className="flex min-h-11 items-center whitespace-nowrap no-underline hover:text-lime">
            {link.label}
          </a>
        ))}
        {area && (
          <a href="/accedi" className="bottone whitespace-nowrap border-[1.5px] border-scuro-linea text-fondo hover:border-lime">
            {d.comune.entra}
          </a>
        )}
        <a href={CTA_PILOTA.href} className="bottone bottone-azione-scuro whitespace-nowrap">
          {CTA_PILOTA.label}
        </a>
        <SceltaLingua compatto />
      </nav>
      <div className="flex shrink-0 items-center gap-1 xl:hidden">
        {area && (
          <a href="/accedi" className="flex min-h-11 items-center rounded-campo px-1.5 text-[16px] font-bold text-fondo underline underline-offset-4">
            {d.comune.entra}
          </a>
        )}
        <MenuMobile gruppi={gruppi} cta={CTA_PILOTA} />
        <SceltaLingua compatto />
      </div>
    </header>
  );
}
