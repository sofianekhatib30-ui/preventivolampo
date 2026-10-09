import type { Metadata } from "next";
import { Marchio } from "@/components/Marchio";
import { classiCaratteri } from "@/lib/brand/caratteri";
import "./globals.css";

// Pagina 404 per gli indirizzi che non corrispondono a nessuna pagina (il sito ha due layout
// radice, pubblico e area: questa li scavalca entrambi). In italiano: non sappiamo la lingua.
export const metadata: Metadata = { title: "Pagina non trovata · PreventivoLampo", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="it" className={classiCaratteri}>
      <body className="min-h-dvh">
        <main className="su-scuro quadretti margini flex min-h-dvh flex-col items-start justify-center gap-6 bg-ardesia text-fondo">
          <Marchio className="size-12" />
          <h1 className="titolo-h2 m-0">Questa pagina non c&apos;è.</h1>
          <p className="testo-hero m-0 max-w-[560px] text-scuro-testo">L&apos;indirizzo potrebbe essere cambiato. Dalla home trovi tutti i mestieri, le guide e i modelli.</p>
          <a href="/" className="bottone bottone-azione-scuro py-4 text-[17px]">
            Vai alla home
          </a>
        </main>
      </body>
    </html>
  );
}
