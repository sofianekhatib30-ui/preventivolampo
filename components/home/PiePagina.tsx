import type { ReactNode } from "react";

export function PiePagina({ children }: { children: ReactNode }) {
  return (
    <footer className="mt-auto flex flex-col gap-3 border-t-2 border-inchiostro pt-[18px] text-[13.5px] font-medium leading-normal lg:flex-row lg:items-center lg:justify-between lg:pt-6 lg:text-[15px]">
      <span>{children}</span>
      <nav aria-label="Informazioni legali" className="flex gap-[22px] lg:gap-7">
        <a href="/privacy" className="flex min-h-11 items-center">
          Privacy
        </a>
        <a href="/cookie" className="flex min-h-11 items-center">
          Cookie
        </a>
        <a href="/condizioni" className="flex min-h-11 items-center">
          Condizioni
        </a>
      </nav>
    </footer>
  );
}
