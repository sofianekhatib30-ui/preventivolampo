import { SceltaLingua } from "@/components/SceltaLingua";
import type { Contenuti } from "@/lib/contenuti";
import { ORDINE_FAMIGLIE } from "@/lib/contenuti/famiglie";
import { FUNZIONI, percorsoFunzione } from "@/lib/contenuti/registro";
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
    { titolo: d.nav.mestieri, colonne: true, voci: ORDINE_FAMIGLIE.map((f) => ({ href: p(`/mestieri#${f}`), label: d.area.modulo.famiglie[f] })) },
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
    // Testata chiara come quella di Attestiamo e Smistatore Mail (.testata di Attestiamo): sabbia velata, sfocatura, linea sotto.
    <header className="margini sticky top-0 z-40 flex h-[68px] items-center justify-between gap-3 border-b border-linea bg-fondo/95 text-inchiostro backdrop-blur-md backdrop-saturate-[1.3]">
      {/* Sui telefoni più stretti il nome si stringe e non spinge fuori lingua, «Accedi» e il menu */}
      <div className="min-w-0 [&_a]:min-w-0 [&_span]:truncate max-[439px]:[&_span]:text-[23px] max-[359px]:[&_span]:text-[20px]">
        <Logo href={p("/")} etichetta={d.comune.logoHome} suScuro={false} />
      </div>
      <nav aria-label={d.comune.principale} className="hidden items-center gap-6 text-[15.5px] font-medium xl:flex">
        {NAV.map((link) => (
          <a key={link.href} href={link.href} className="flex min-h-11 items-center whitespace-nowrap text-inchiostro no-underline hover:text-cielo-scuro">
            {link.label}
          </a>
        ))}
        {area && (
          <a href="/accedi" className="flex min-h-11 items-center whitespace-nowrap text-inchiostro no-underline hover:text-cielo-scuro">
            {d.comune.entra}
          </a>
        )}
        <a href={CTA_PILOTA.href} className="ms-1 inline-flex min-h-[42px] items-center whitespace-nowrap rounded-full bg-cielo-scuro px-[18px] text-[15px] font-semibold text-white no-underline hover:bg-inchiostro">
          {CTA_PILOTA.label}
        </a>
        <SceltaLingua compatto scuro={false} />
      </nav>
      <div className="flex shrink-0 items-center gap-1 xl:hidden">
        {area && (
          <a href="/accedi" className="flex min-h-11 items-center rounded-campo px-1.5 text-[16px] font-semibold text-inchiostro underline underline-offset-4">
            {d.comune.entra}
          </a>
        )}
        <MenuMobile gruppi={gruppi} cta={CTA_PILOTA} />
        <SceltaLingua compatto scuro={false} />
      </div>
    </header>
  );
}
