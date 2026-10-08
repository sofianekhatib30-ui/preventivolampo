import type { Metadata } from "next";
import { PaginaLegale } from "@/components/PaginaLegale";
import { CONTACT_EMAIL } from "@/lib/sito";

export const metadata: Metadata = { title: "Privacy · PreventivoLampo" };

const link = "font-semibold text-cielo-scuro";

export default function Page() {
  return (
    <PaginaLegale titolo="Privacy" aggiornata="9 ottobre 2026">
      <p>
        Questa pagina spiega quali dati personali tratta PreventivoLampo, perché, dove finiscono e per quanto tempo restano.
      </p>

      <h2>Chi tratta i dati</h2>
      <p>
        Titolare del trattamento è Sofiane Khatib, K Digital Solution, Monza (MB). Per qualsiasi richiesta sui tuoi dati scrivi a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className={link}>
          {CONTACT_EMAIL}
        </a>
        .
      </p>
      <p>
        Per i dati dei clienti di un artigiano (nomi, indirizzi dei cantieri, preventivi) il titolare è l&apos;artigiano: noi li
        trattiamo per suo conto, come responsabile del trattamento, secondo l&apos;accordo che firmiamo con lui.
      </p>

      <h2>Quali dati, perché e per quanto</h2>
      <h3>Se ti candidi al programma pilota</h3>
      <ul>
        <li>Nome, mestiere, comune, cellulare e, se lo indichi, quanti preventivi fai a settimana.</li>
        <li>Li usiamo solo per richiamarti e capire se il pilota fa per te (base giuridica: la tua richiesta e il tuo consenso).</li>
        <li>Se non entri nel pilota li cancelliamo entro 12 mesi; puoi chiederci di farlo prima in qualunque momento.</li>
      </ul>
      <h3>Se usi l&apos;area artigiani</h3>
      <ul>
        <li>
          Email di accesso, dati dell&apos;impresa che inserisci (ragione sociale, partita IVA, indirizzo, telefono, IBAN se lo
          indichi), logo, listino e preventivi.
        </li>
        <li>
          Se carichi il listino da PDF o foto, o da vecchi preventivi, l&apos;intelligenza artificiale ne legge solo le voci di
          prezzo: i nomi dei clienti non vengono trascritti e il file non viene conservato.
        </li>
        <li>Servono per fornirti il servizio (base giuridica: il contratto, anche durante il pilota gratuito).</li>
        <li>
          Restano finché usi il servizio. Quando smetti li cancelliamo entro 30 giorni, salvo quello che la legge ci obbliga a
          conservare (per esempio le fatture, 10 anni).
        </li>
      </ul>
      <h3>Se sei il cliente di un artigiano e apri il suo preventivo</h3>
      <ul>
        <li>Quando accetti o rifiuti un preventivo registriamo il nome che scrivi, data e ora, indirizzo IP e l&apos;impronta del PDF.</li>
        <li>Servono all&apos;artigiano come prova dell&apos;accettazione. Li conserviamo per suo conto, finché lui usa il servizio.</li>
        <li>Per vedere, correggere o cancellare questi dati puoi rivolgerti all&apos;artigiano o a noi: gli giriamo la richiesta.</li>
      </ul>
      <h3>Se provi PreventivoLampo con un esempio o su WhatsApp</h3>
      <ul>
        <li>Il testo che scrivi, la bozza che ne nasce e, su WhatsApp, il numero da cui scrivi.</li>
        <li>
          Le bozze di prova si cancellano da sole dopo 7 giorni; su WhatsApp la bozza in attesa della tua risposta resta al massimo
          un&apos;ora.
        </li>
        <li>Per le prove non scrivere dati di persone reali: bastano lavori inventati.</li>
        <li>Per limitare gli abusi conserviamo un&apos;impronta (hash) dell&apos;indirizzo IP, non l&apos;indirizzo in chiaro.</li>
      </ul>

      <h2>A chi li affidiamo</h2>
      <p>Usiamo questi fornitori, ciascuno solo per la sua parte:</p>
      <ul>
        <li>Supabase: database, accesso all&apos;area e archivio dei PDF, in Irlanda (UE).</li>
        <li>Vercel: il sito e le sue funzioni, a Francoforte (UE).</li>
        <li>Anthropic (Claude): legge il testo del sopralluogo e prepara la bozza, e traduce le voci del preventivo quando il cliente parla un&apos;altra lingua, negli Stati Uniti.</li>
        <li>Twilio e WhatsApp (Meta): ricevono e mandano i messaggi WhatsApp.</li>
        <li>n8n: collega i messaggi WhatsApp a PreventivoLampo.</li>
        <li>Resend: manda le email con il codice di accesso.</li>
      </ul>
      <p>
        Quando i dati vanno fuori dall&apos;Unione europea, ci basiamo sulle garanzie previste dal GDPR: la certificazione EU-US
        Data Privacy Framework o le clausole contrattuali standard della Commissione europea. Non vendiamo i dati e non li usiamo
        per pubblicità né per addestrare modelli di intelligenza artificiale.
      </p>

      <h2>I tuoi diritti</h2>
      <p>
        Puoi chiederci di vedere i tuoi dati, correggerli, cancellarli, limitarne l&apos;uso, opporti al trattamento o riceverli in
        un formato leggibile, e ritirare il consenso quando vuoi. Scrivi all&apos;indirizzo qui sopra: rispondiamo entro 30 giorni.
        Puoi anche presentare reclamo al Garante per la protezione dei dati personali (garanteprivacy.it).
      </p>
    </PaginaLegale>
  );
}
