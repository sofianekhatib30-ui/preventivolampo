import { Logo } from "@/components/home/Logo";

// Testata delle pagine di lavoro (prova, revisione, pagine legali): ardesia, sottile, col logo che porta alla home.
export function TestataApp({ children, etichettaLogo }: { children?: React.ReactNode; etichettaLogo?: string }) {
  return (
    <header className="su-scuro margini flex h-16 items-center justify-between gap-4 bg-ardesia text-fondo">
      <Logo href="/" etichetta={etichettaLogo} />
      <div className="flex items-center gap-3">{children}</div>
    </header>
  );
}
