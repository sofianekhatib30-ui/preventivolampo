// Fulmine su quadrato giallo. Decorativo: il nome accanto porta il significato.
export function LogoMark({ className, round = false }: { className?: string; round?: boolean }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx={round ? 20 : 10} fill="#FFC21F" />
      <path d="M22.5 7 L12 22 H19 L17 33 L28 17.5 H21 Z" fill="#16150F" />
    </svg>
  );
}

export function Logo() {
  return (
    <a
      href="#top"
      aria-label="PreventivoLampo, torna all'inizio"
      className="flex min-h-11 items-center gap-2.5 no-underline lg:gap-3"
    >
      <LogoMark className="size-8 lg:size-10" />
      <span className="text-[22px] font-extrabold tracking-[-0.01em] [font-stretch:78%] lg:text-[26px]">
        PreventivoLampo
      </span>
    </a>
  );
}
