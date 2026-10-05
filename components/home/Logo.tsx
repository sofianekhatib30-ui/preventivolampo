import { Marchio } from "@/components/Marchio";

export function Logo({ href = "#top", suScuro = true }: { href?: string; suScuro?: boolean }) {
  return (
    <a
      href={href}
      aria-label={href === "#top" ? "PreventivoLampo, torna all'inizio" : "PreventivoLampo, home"}
      className={`flex min-h-11 items-center gap-2.5 no-underline lg:gap-3 ${suScuro ? "text-fondo" : "text-inchiostro"}`}
    >
      <Marchio className="size-9 lg:size-10" />
      <span className="text-[22px] font-extrabold tracking-[-0.01em] [font-stretch:78%] lg:text-[26px]">
        PreventivoLampo
      </span>
    </a>
  );
}
