import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";
import { CONTACT_EMAIL } from "@/lib/sito";

export const metadata: Metadata = { title: "Privacy · PreventivoLampo" };

export default function Page() {
  return (
    <PaginaLegale titolo="Privacy" aggiornata="5 ottobre 2026">
      <p>
        PreventivoLampo è un progetto dimostrativo di Sofiane Khatib (K Digital Solution, Monza): non è un servizio in vendita.
        Questa pagina dice quali dati passano dalla demo, dove vanno e quando si cancellano. Per qualsiasi richiesta scrivi a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-cielo-scuro">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
      <h2>Cosa raccoglie la demo</h2>
      <ul>
        <li>Il testo che scrivi o detti nella pagina di prova, e la bozza che ne nasce.</li>
        <li>Le modifiche che fai alla bozza, e il nome che scrive chi accetta o rifiuta il preventivo dalla pagina del cliente.</li>
        <li>Per il limite di prove: un&apos;impronta (hash) dell&apos;indirizzo IP, non l&apos;indirizzo in chiaro.</li>
      </ul>
      <p>
        <strong className="text-inchiostro">Non inserire dati di persone reali.</strong> Gli esempi della demo sono inventati e
        bastano per provarla.
      </p>
      <h2>Dove vanno</h2>
      <ul>
        <li>Il sito e l&apos;archivio delle bozze sono su Vercel, con le funzioni e l&apos;archivio a Francoforte (UE). Le bozze sono oggetti privati, raggiungibili solo con il link casuale.</li>
        <li>Il testo libero viene elaborato dall&apos;API di Claude (Anthropic) per estrarre le lavorazioni. Gli esempi pronti non passano dall&apos;API.</li>
        <li>La dettatura usa il riconoscimento vocale del tuo browser (per esempio quello di Google in Chrome o di Apple in Safari): l&apos;audio non arriva a questo sito, arriva solo il testo.</li>
      </ul>
      <h2>Quanto restano</h2>
      <p>
        Ogni notte una pulizia automatica cancella le bozze, i link dei clienti e i contatori del limite non toccati da più di 7
        giorni.
      </p>
      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiedere di vedere o cancellare prima del tempo una bozza che hai creato, scrivendo all&apos;indirizzo qui sopra con
        il link della bozza. Puoi anche rivolgerti al Garante per la protezione dei dati personali.
      </p>
    </PaginaLegale>
  );
}
