import type { ReactNode } from "react";
import type { Dizionario } from "@/lib/i18n/it";

export function PiePagina({ d, children }: { d: Dizionario; children: ReactNode }) {
  return (
    <footer className="mt-auto flex flex-col gap-3 border-t-2 border-current pt-[18px] text-[13.5px] font-medium leading-normal lg:flex-row lg:items-center lg:justify-between lg:pt-6 lg:text-[15px]">
      <span>{children}</span>
      <nav aria-label={d.comune.infoLegali} className="flex gap-[22px] lg:gap-7">
        <a href="/privacy" className="flex min-h-11 items-center">
          {d.comune.privacy}
        </a>
        <a href="/cookie" className="flex min-h-11 items-center">
          {d.comune.cookie}
        </a>
        <a href="/condizioni" className="flex min-h-11 items-center">
          {d.comune.condizioni}
        </a>
      </nav>
    </footer>
  );
}
