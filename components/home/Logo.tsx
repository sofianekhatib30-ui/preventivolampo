import { Marchio } from "@/components/Marchio";

export function Logo({ href = "#top", suScuro = true, etichetta }: { href?: string; suScuro?: boolean; etichetta?: string }) {
  return (
    <a
      href={href}
      aria-label={etichetta ?? (href === "#top" ? "PreventivoLampo, torna all'inizio" : "PreventivoLampo, home")}
      className={`flex min-h-11 items-center gap-2 no-underline sm:gap-2.5 lg:gap-3 ${suScuro ? "text-fondo" : "text-inchiostro"}`}
    >
      <Marchio className="size-8 shrink-0 sm:size-9 lg:size-10" />
      <span className="text-[22px] font-extrabold tracking-[-0.01em] [font-stretch:78%] lg:text-[26px]">
        PreventivoLampo
      </span>
    </a>
  );
}
