import { Marchio } from "@/components/Marchio";

// Marchio di K Digital Solution e nome dello strumento in Instrument Serif, come Attestiamo.

export function Logo({ href = "#top", suScuro = true, etichetta, marchioScuro = false }: { href?: string; suScuro?: boolean; etichetta?: string; marchioScuro?: boolean }) {
  return (
    <a
      href={href}
      aria-label={etichetta ?? (href === "#top" ? "Preventivi, torna all'inizio" : "Preventivi, home")}
      className={`flex min-h-11 items-center gap-2.5 no-underline ${suScuro ? "text-fondo" : "text-inchiostro"}`}
    >
      <Marchio className="size-[34px] shrink-0" suScuro={marchioScuro} />
      <span className="nome-strumento whitespace-nowrap text-[26px] leading-none">
        Preventivi
      </span>
    </a>
  );
}
