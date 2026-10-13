import { Marchio } from "@/components/Marchio";

// Marchio di K Digital Solution e nome dello strumento con la regola .nome-strumento di app/globals.css,
// come gli altri prodotti: maiuscolo, grassetto, bordeaux; sui fondi scuri (.su-scuro) in targa Champagne.

export function Logo({ href = "#top", suScuro = true, etichetta, marchioScuro = false }: { href?: string; suScuro?: boolean; etichetta?: string; marchioScuro?: boolean }) {
  return (
    <a
      href={href}
      aria-label={etichetta ?? (href === "#top" ? "Preventivi, torna all'inizio" : "Preventivi, home")}
      className={`flex min-h-11 items-center gap-2.5 no-underline ${suScuro ? "text-fondo" : "text-inchiostro"}`}
    >
      <Marchio className="size-[34px] shrink-0" suScuro={marchioScuro} />
      <span className="nome-strumento">Preventivi</span>
    </a>
  );
}
