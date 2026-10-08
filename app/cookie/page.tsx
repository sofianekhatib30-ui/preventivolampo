import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";

export const metadata: Metadata = { title: "Cookie · PreventivoLampo" };

export default function Page() {
  return (
    <PaginaLegale titolo="Cookie" aggiornata="8 ottobre 2026">
      <p>
        PreventivoLampo usa un solo cookie, ed è tecnico: senza, l&apos;area artigiani non saprebbe che sei entrato. Niente cookie
        di profilazione, niente statistiche, niente strumenti di terze parti che ti seguono da un sito all&apos;altro. Per questo
        non trovi un banner dei cookie.
      </p>
      <ul>
        <li>
          <strong className="text-inchiostro">pl_sessione</strong>: tiene aperto l&apos;accesso all&apos;area artigiani dopo che hai
          inserito il codice ricevuto via email. Lo mettiamo solo quando entri, dura 30 giorni e si cancella quando premi «Esci».
        </li>
      </ul>
      <p>
        I caratteri sono serviti dal sito stesso, non da server esterni. Se un giorno servisse un altro cookie, questa pagina dirà
        quale, a cosa serve e quanto dura, e se non è tecnico te lo chiederemo prima.
      </p>
    </PaginaLegale>
  );
}
