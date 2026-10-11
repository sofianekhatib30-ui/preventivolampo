import { Marchio } from "@/components/Marchio";

// Marchio di K Digital Solution e nome dello strumento in Instrument Serif, come Attestiamo.

export function Logo({ href = "#top", suScuro = true, etichetta }: { href?: string; suScuro?: boolean; etichetta?: string }) {
  return (
    <a
      href={href}
      aria-label={etichetta ?? (href === "#top" ? "Preventivi, torna all'inizio" : "Preventivi, home")}
      className={`flex min-h-11 items-center gap-2 no-underline sm:gap-2.5 lg:gap-3 ${suScuro ? "text-fondo" : "text-inchiostro"}`}
    >
      <Marchio className="size-8 shrink-0 sm:size-9 lg:size-10" />
      <span className="nome-strumento text-[26px] leading-none lg:text-[30px]">
        Preventivi
      </span>
    </a>
  );
}
