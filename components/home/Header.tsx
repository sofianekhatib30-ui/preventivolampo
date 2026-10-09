import { SceltaLingua } from "@/components/SceltaLingua";
import type { Dizionario } from "@/lib/i18n/it";
import { configurato } from "@/lib/impresa/db";
import { candidatureAperte } from "@/lib/sito";
import { Logo } from "./Logo";
import { MenuMobile } from "./MenuMobile";

export function navLinks(d: Dizionario) {
  return [
    { href: "#come", label: d.nav.come },
    { href: "#mestieri", label: d.nav.mestieri },
    { href: "#numeri", label: d.nav.numeri },
    { href: "#prezzi", label: d.nav.prezzi },
    { href: "#domande", label: d.nav.domande },
  ] as const;
}

// Con le candidature chiuse (demo pubblica) la chiamata all'azione porta alla prova del motore.
export function ctaPrincipale(d: Dizionario) {
  return candidatureAperte() ? ({ href: "#candidatura", label: d.comune.ctaPilota } as const) : ({ href: "/prova", label: d.comune.ctaProva } as const);
}

export function Header({ d }: { d: Dizionario }) {
  const CTA_PILOTA = ctaPrincipale(d);
  const NAV_LINKS = navLinks(d);
  // Chi ha già un account entra da qui: sempre a vista, anche sul telefono accanto al menu.
  const area = configurato();
  return (
    <header className="su-scuro margini sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-scuro-linea bg-ardesia text-fondo lg:h-[80px]">
      {/* Sui telefoni più stretti il nome si stringe e non spinge fuori lingua, «Entra» e il menu */}
      <div className="min-w-0 [&_a]:min-w-0 [&_span]:truncate max-[439px]:[&_span]:text-[17px] max-[359px]:[&_span]:text-[15px]">
        <Logo etichetta={d.comune.logoTop} />
      </div>
      <nav aria-label={d.comune.principale} className="hidden items-center gap-5 font-medium xl:flex">
        {NAV_LINKS.map((link) => (
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
        <MenuMobile links={NAV_LINKS} cta={CTA_PILOTA} />
        <SceltaLingua compatto />
      </div>
    </header>
  );
}
