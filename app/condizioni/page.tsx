import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";

export const metadata: Metadata = { title: "Condizioni · PreventivoLampo" };

export default function Page() {
  return (
    <PaginaLegale titolo="Condizioni d'uso della demo" aggiornata="5 ottobre 2026">
      <p>
        PreventivoLampo è un progetto dimostrativo, mostrato come portfolio. La pagina principale racconta il prodotto come se
        fosse sul mercato, ma il servizio non è in vendita: non ci sono prezzi da pagare né contratti da firmare.
      </p>
      <h2>Cosa puoi fare</h2>
      <ul>
        <li>Provare il motore con gli esempi pronti o con un tuo testo (con il codice d&apos;accesso).</li>
        <li>Rivedere la bozza, approvarla, aprire il PDF e la pagina che vedrebbe il cliente.</li>
      </ul>
      <h2>Cosa non è</h2>
      <ul>
        <li>Non è un preventivo vero: impresa, listino e clienti sono inventati, e i prezzi vengono da un prezzario pubblico.</li>
        <li>Non è consulenza fiscale: l&apos;IVA è calcolata sulle risposte date e va verificata con un commercialista.</li>
        <li>Un&apos;«accettazione» nella demo non crea alcun impegno tra persone reali.</li>
      </ul>
      <h2>Uso corretto</h2>
      <p>
        Non usare la demo per dati di persone reali, per testi offensivi o per caricare in massa richieste: il limite di prove e
        il codice d&apos;accesso servono a tenerla disponibile per tutti. Il codice sorgente è pubblico su GitHub.
      </p>
    </PaginaLegale>
  );
}
