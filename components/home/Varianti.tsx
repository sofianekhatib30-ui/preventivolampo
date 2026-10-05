import type { ReactNode } from "react";

// Il riferimento desktop e quello mobile usano a volte testi diversi per la stessa cosa.
// Il passaggio avviene a 1024 px (breakpoint lg), come la colonna singola.
// display:none toglie la variante nascosta anche agli screen reader.

export function SoloDesktop({ children }: { children: ReactNode }) {
  return <span className="hidden lg:inline">{children}</span>;
}

export function SoloMobile({ children }: { children: ReactNode }) {
  return <span className="lg:hidden">{children}</span>;
}
