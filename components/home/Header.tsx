import { configurato } from "@/lib/impresa/db";
import { candidatureAperte } from "@/lib/sito";
import { Logo } from "./Logo";
import { MenuMobile } from "./MenuMobile";

export const NAV_LINKS = [
  { href: "#come", label: "Come funziona" },
  { href: "#perche", label: "Cosa cambia" },
  { href: "#prezzi", label: "Prezzi" },
  { href: "#domande", label: "Domande" },
] as const;

// Con le candidature chiuse (demo pubblica) la chiamata all'azione porta alla prova del motore.
export function ctaPrincipale() {
  return candidatureAperte()
    ? ({ href: "#candidatura", label: "Diventa artigiano pilota" } as const)
    : ({ href: "/prova", label: "Prova con un esempio" } as const);
}

export function Header() {
  const CTA_PILOTA = ctaPrincipale();
  // Chi ha già un account entra da qui: sempre a vista, anche sul telefono accanto al menu.
  const area = configurato();
  return (
    <header className="su-scuro margini sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-scuro-linea bg-ardesia text-fondo lg:h-[80px]">
      {/* Sui telefoni più stretti il nome si stringe e non spinge fuori «Entra» e il menu */}
      <div className="min-w-0 [&_a]:min-w-0 [&_span]:truncate max-[419px]:[&_span]:text-[18px] max-[359px]:[&_span]:text-[15px]">
        <Logo />
      </div>
      <nav aria-label="Principale" className="hidden items-center gap-7 font-medium xl:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex min-h-11 items-center whitespace-nowrap no-underline hover:text-lime"
          >
            {link.label}
          </a>
        ))}
        {area && (
          <a href="/accedi" className="bottone whitespace-nowrap border-[1.5px] border-scuro-linea text-fondo hover:border-lime">
            Entra
          </a>
        )}
        <a
          href={CTA_PILOTA.href}
          className="bottone bottone-azione-scuro whitespace-nowrap"
        >
          {CTA_PILOTA.label}
        </a>
      </nav>
      <div className="flex shrink-0 items-center gap-1 xl:hidden">
        {area && (
          <a href="/accedi" className="flex min-h-11 items-center rounded-campo px-2 text-[16px] font-bold text-fondo underline underline-offset-4">
            Entra
          </a>
        )}
        <MenuMobile links={NAV_LINKS} cta={CTA_PILOTA} />
      </div>
    </header>
  );
}
