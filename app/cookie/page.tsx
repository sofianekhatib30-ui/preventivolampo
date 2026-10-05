import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";

export const metadata: Metadata = { title: "Cookie · PreventivoLampo" };

export default function Page() {
  return (
    <PaginaLegale titolo="Cookie" aggiornata="5 ottobre 2026">
      <p>
        La demo non usa cookie: niente cookie di profilazione, niente statistiche, niente strumenti di terze parti che ti
        seguono da un sito all&apos;altro. Per questo non trovi un banner dei cookie.
      </p>
      <p>
        I caratteri sono serviti dal sito stesso, non da server esterni. Se un giorno servisse un cookie, questa pagina dirà
        quale, a cosa serve e quanto dura, e te lo chiederemo prima.
      </p>
    </PaginaLegale>
  );
}
