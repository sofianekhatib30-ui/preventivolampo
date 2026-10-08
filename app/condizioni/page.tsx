import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";
import { CONTACT_EMAIL } from "@/lib/sito";

export const metadata: Metadata = { title: "Condizioni · PreventivoLampo" };

export default function Page() {
  return (
    <PaginaLegale titolo="Condizioni del servizio" aggiornata="8 ottobre 2026">
      <p>
        PreventivoLampo è un servizio di Sofiane Khatib, K Digital Solution, Monza (MB). Aiuta artigiani e imprese edili a
        preparare i preventivi: dal racconto del sopralluogo prepara una bozza con i prezzi del listino dell&apos;impresa, che
        l&apos;artigiano controlla, approva e manda al cliente. Il servizio è riservato a imprese e professionisti con partita
        IVA.
      </p>

      <h2>Programma pilota</h2>
      <ul>
        <li>Dieci posti per artigiani di Monza e Brianza, assegnati da noi dopo una telefonata.</li>
        <li>60 giorni gratuiti dall&apos;avvio, con preventivi illimitati e un&apos;ora di affiancamento per caricare il listino e impostare logo, dati e condizioni sul PDF.</li>
        <li>Nessun rinnovo automatico: alla fine dei 60 giorni decidi tu se restare. Se non ci dici niente, il pilota finisce lì.</li>
        <li>In cambio ti chiediamo di usarlo sui tuoi lavori veri e di dirci cosa funziona e cosa no.</li>
      </ul>

      <h2>Dopo il pilota</h2>
      <ul>
        <li>Canone: 19,90 € al mese oppure 199 € l&apos;anno, IVA esclusa, con preventivi illimitati. Nessun costo di avvio.</li>
        <li>Il mensile si disdice quando vuoi, con effetto alla fine del mese già pagato. L&apos;annuale vale 12 mesi e si rinnova solo se lo chiedi tu.</li>
        <li>Se cambiamo i prezzi te lo diciamo almeno 30 giorni prima, e valgono solo dal rinnovo successivo.</li>
      </ul>

      <h2>Il preventivo lo decidi tu</h2>
      <ul>
        <li>
          PreventivoLampo propone, tu decidi: nessun preventivo arriva al cliente senza che tu l&apos;abbia aperto e approvato.
          Prima di approvare controlla voci, quantità e prezzi.
        </li>
        <li>I prezzi vengono solo dal tuo listino. Le voci che non ci sono restano «da prezzare» e il prezzo lo metti tu.</li>
        <li>
          Il calcolo dell&apos;IVA segue le risposte che dai e le regole dell&apos;Agenzia delle Entrate, ma non è consulenza
          fiscale: per i casi particolari resta il tuo commercialista.
        </li>
        <li>Il rapporto con il cliente, i prezzi e i lavori restano tuoi: PreventivoLampo non è parte del contratto fra te e lui.</li>
      </ul>

      <h2>I tuoi dati restano tuoi</h2>
      <ul>
        <li>Listino, preventivi e dati dell&apos;impresa sono tuoi. Su richiesta ti mandiamo il listino in Excel e i PDF dei preventivi.</li>
        <li>
          I dati dei tuoi clienti li trattiamo per tuo conto, secondo l&apos;accordo per il trattamento dei dati che firmiamo
          all&apos;avvio. Come trattiamo gli altri dati è scritto nella pagina Privacy.
        </li>
        <li>Non inserire dati sulla salute o altri dati particolari dei tuoi clienti: al preventivo non servono.</li>
      </ul>

      <h2>Cosa garantiamo e cosa no</h2>
      <ul>
        <li>
          Facciamo il possibile perché il servizio funzioni sempre e senza errori, ma la lettura del sopralluogo può sbagliare: per
          questo ogni bozza va controllata prima di approvarla.
        </li>
        <li>Possono esserci interruzioni per manutenzione o guasti dei fornitori; le grandi manutenzioni te le annunciamo prima.</li>
        <li>
          Nei limiti di legge, e salvo dolo o colpa grave, la nostra responsabilità non supera quanto ci hai pagato negli ultimi 12
          mesi. Durante il pilota gratuito il servizio è fornito così com&apos;è.
        </li>
      </ul>

      <h2>Uso corretto</h2>
      <p>
        Usa PreventivoLampo solo per i preventivi della tua impresa. Non condividere il tuo accesso con persone esterne e non usare
        il servizio per caricare testi offensivi o richieste in massa. Se queste regole non vengono rispettate possiamo sospendere
        l&apos;accesso, dopo averti avvisato.
      </p>

      <h2>Modifiche e legge applicabile</h2>
      <p>
        Se cambiamo queste condizioni te lo diciamo via email almeno 30 giorni prima. Valgono la legge italiana e, per le
        controversie, il foro di Monza. Per qualsiasi domanda scrivi a <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-cielo-scuro">{CONTACT_EMAIL}</a>.
      </p>
    </PaginaLegale>
  );
}
