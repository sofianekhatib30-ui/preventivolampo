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
  return (
    <header className="su-scuro margini sticky top-0 z-40 flex h-16 items-center justify-between border-b border-scuro-linea bg-ardesia text-fondo lg:h-[80px]">
      <Logo />
      <nav aria-label="Principale" className="hidden items-center gap-9 font-medium xl:flex">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="flex min-h-11 items-center whitespace-nowrap no-underline hover:text-lime"
          >
            {link.label}
          </a>
        ))}
        <a
          href={CTA_PILOTA.href}
          className="bottone bottone-azione-scuro whitespace-nowrap"
        >
          {CTA_PILOTA.label}
        </a>
      </nav>
      <MenuMobile links={NAV_LINKS} cta={CTA_PILOTA} />
    </header>
  );
}
