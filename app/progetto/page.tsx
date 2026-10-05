import type { Metadata } from "next";
import Link from "next/link";
import { TestataApp } from "@/components/TestataApp";
import { CHIAVI, reportMisure, valori } from "@/lib/misure";
import { REPO_URL } from "@/lib/sito";

export const metadata: Metadata = {
  title: "Caso di studio — PreventivoLampo",
  description: "Come funziona PreventivoLampo: dal vocale del sopralluogo al preventivo, con i prezzi solo dal listino. Numeri misurati su 36 casi.",
};

// Il caso di studio: per chi valuta il progetto. Problema, motore, numeri (letti dai report), scelte, limiti.

const PASSI: { chi: "Claude" | "Codice" | "Artigiano"; titolo: string; testo: string }[] = [
  { chi: "Claude", titolo: "Estrazione", testo: "Dal racconto del sopralluogo a un JSON a schema fisso: cliente, lavorazioni, quantità calcolate dalle misure dette, esclusioni, contesto IVA. Un'uscita fuori schema è un errore, non una bozza." },
  { chi: "Codice", titolo: "Candidati", testo: "Per ogni riga il codice sceglie al massimo 8 voci del listino: parole della voce, sinonimi di cantiere, unità di misura. Niente AI in questo passaggio." },
  { chi: "Claude", titolo: "Scelta", testo: "Il modello sceglie una voce solo fra i candidati, con una confidenza. Non vede prezzi e non può proporne." },
  { chi: "Codice", titolo: "Regole", testo: "Sotto soglia o fuori dai candidati: «da prezzare». Materiale del cliente su una voce «fornitura e posa»: «solo posa», da prezzare. Misura mancante o unità diversa: una domanda. Stessa voce due volte: una riga sola. Regime IVA dalle tre risposte." },
  { chi: "Artigiano", titolo: "Revisione e approvazione", testo: "Dal telefono controlla riga per riga, con accanto la frase che ha detto. Solo dopo la sua approvazione nascono il PDF e il link con cui il cliente accetta." },
];

const SCELTE: { titolo: string; testo: string }[] = [
  { titolo: "Il prezzo non esce mai dal modello", testo: "Viene dal listino dell'impresa o lo scrive l'artigiano. Le app che stimano «prezzi di mercato» sbagliano al ribasso, e un preventivo al ribasso è un lavoro in perdita." },
  { titolo: "Meglio una domanda che una stima", testo: "Se la misura non è detta, la bozza chiede. Il banco conta anche le domande in più, perché anche chiedere troppo è un costo." },
  { titolo: "L'errore pericoloso si conta a parte", testo: "Un abbinamento sbagliato con un prezzo vero sembra giusto. Per questo è una riga a sé nel report, ed è quella che ho fatto scendere di più." },
  { titolo: "L'IVA edile sta nel codice", testo: "22%, 10% e 10% con beni significativi (DM 29/12/1999), con la ripartizione dell'Agenzia delle Entrate. Il modello raccoglie le risposte; il calcolo è deterministico e testato." },
];

export default function Progetto() {
  const { prima, ultima, verifica } = reportMisure();
  const a = prima ? valori(prima) : new Map<string, string>();
  const b = ultima ? valori(ultima) : new Map<string, string>();
  const v = verifica ? valori(verifica) : new Map<string, string>();
  const corto = (s?: string) => (s ?? "—").replace(/;.*$/, "").replace(/ \(token reali.*$/, "");
  const righe: { k: string; etichetta: string; evidenza?: boolean }[] = [
    { k: CHIAVI.righe, etichetta: "Righe giuste senza correzioni" },
    { k: CHIAVI.listino, etichetta: "Voci di listino abbinate bene" },
    { k: CHIAVI.daPrezzare, etichetta: "Voci «da prezzare» riconosciute" },
    { k: CHIAVI.sbagliati, etichetta: "Abbinamenti sbagliati con un prezzo vero", evidenza: true },
    { k: CHIAVI.inventati, etichetta: "Prezzi inventati", evidenza: true },
    { k: CHIAVI.iva, etichetta: "IVA giusta al centesimo" },
    { k: CHIAVI.extra, etichetta: "Righe in più del necessario" },
  ];

  return (
    <>
      <TestataApp>
        <Link href="/prova" className="text-sm font-semibold text-scuro-testo">
          Prova la demo
        </Link>
      </TestataApp>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
        <p className="text-[15px] text-testo-3">Caso di studio · Sofiane Khatib · Monza, 2026</p>
        <h1 className="mt-2 text-[40px] font-black leading-[1.02] [font-stretch:76%] sm:text-[60px]">
          Dal vocale del sopralluogo al preventivo, senza prezzi inventati.
        </h1>
        <p className="mt-5 max-w-[62ch] text-[18px] leading-relaxed text-testo-2">
          L&apos;artigiano edile racconta il lavoro come a un collega. PreventivoLampo estrae le lavorazioni, le abbina al suo
          listino, segnala quello che manca e prepara la bozza da controllare dal telefono; dopo l&apos;approvazione genera il PDF
          con l&apos;IVA edile e un link con cui il cliente accetta. È un progetto dimostrativo: impresa, listino e clienti sono
          inventati, i numeri no.
        </p>
        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <Link href="/prova" className="bottone bottone-azione min-h-14 text-[17px]">
            Prova con un esempio
          </Link>
          <a href={REPO_URL} className="bottone min-h-14 border-2 border-ardesia text-[17px]">
            Codice su GitHub
          </a>
          <Link href="/" className="bottone min-h-14 text-[17px] font-semibold text-cielo-scuro underline">
            La pagina di vendita
          </Link>
        </div>

        <section className="mt-16">
          <h2 className="text-[28px] font-black [font-stretch:80%] sm:text-[34px]">Il problema</h2>
          <p className="mt-3 max-w-[62ch] text-[17px] leading-relaxed text-testo-2">
            Dopo il sopralluogo il preventivo si scrive la sera, a mano o in Excel, e spesso parte giorni dopo. Le app che
            «fanno il preventivo con l&apos;AI» trascrivono bene, ma quando non trovano una voce la stimano. Per un artigiano il
            rischio vero non è la trascrizione: è il prezzo sbagliato che sembra giusto, e l&apos;IVA edile ripartita male.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-[28px] font-black [font-stretch:80%] sm:text-[34px]">Come funziona: l&apos;AI propone, il codice controlla</h2>
          <ol className="mt-6 space-y-3">
            {PASSI.map((p, i) => (
              <li key={p.titolo} className="flex gap-4 rounded-card bg-superficie p-5 ring-1 ring-linea">
                <span className="font-mono text-[20px] font-semibold text-lime-scuro">{i + 1}</span>
                <div>
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-[19px] font-extrabold">{p.titolo}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[13px] font-semibold ${
                        p.chi === "Claude" ? "bg-ardesia text-fondo" : p.chi === "Codice" ? "bg-fondo-2 text-inchiostro" : "bg-lime text-inchiostro"
                      }`}
                    >
                      {p.chi}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[16px] leading-relaxed text-testo-2">{p.testo}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="text-[28px] font-black [font-stretch:80%] sm:text-[34px]">I numeri, misurati</h2>
          <p className="mt-3 max-w-[62ch] text-[17px] leading-relaxed text-testo-2">
            Un banco di 30 sopralluoghi inventati, con gli attesi scritti prima che il motore esistesse. Dopo la prima misura ho
            corretto tre regole guardando gli errori; rimisurare sugli stessi casi è ottimistico, quindi ho scritto 6 casi nuovi
            e li ho fatti girare una volta sola. Ogni numero viene da un report generato da un comando.
          </p>
          <div tabIndex={0} role="region" aria-label="Tabella dei numeri misurati" className="mt-6 overflow-x-auto rounded-card ring-1 ring-linea">
            <table className="w-full min-w-[560px] border-collapse bg-superficie text-left text-[15px]">
              <thead className="bg-ardesia text-fondo">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">Misura</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Prima</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Dopo</th>
                  <th scope="col" className="px-4 py-3 font-semibold">6 casi nuovi</th>
                </tr>
              </thead>
              <tbody>
                {righe.map((r) => (
                  <tr key={r.k} className={`border-t border-linea ${r.evidenza ? "bg-fondo" : ""}`}>
                    <th scope="row" className="px-4 py-3 font-semibold">
                      {r.etichetta}
                    </th>
                    <td className="px-4 py-3 font-mono text-testo-2">{corto(a.get(r.k))}</td>
                    <td className="px-4 py-3 font-mono font-semibold">{corto(b.get(r.k))}</td>
                    <td className="px-4 py-3 font-mono">{corto(v.get(r.k))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[15px] text-testo-3">
            Tempo medio {corto(b.get(CHIAVI.tempo))}, costo medio {corto(b.get(CHIAVI.costo))} a preventivo, con i token reali.
            I report completi, caso per caso, sono nella cartella <code className="font-mono">misure/</code> del repository.
          </p>
        </section>

        <section className="mt-14">
          <h2 className="text-[28px] font-black [font-stretch:80%] sm:text-[34px]">Le scelte che contano</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {SCELTE.map((s) => (
              <article key={s.titolo} className="rounded-card bg-superficie p-5 ring-1 ring-linea">
                <h3 className="text-[19px] font-extrabold leading-snug">{s.titolo}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-testo-2">{s.testo}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="text-[28px] font-black [font-stretch:80%] sm:text-[34px]">Cosa non fa ancora</h2>
          <ul className="mt-4 max-w-[62ch] list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-testo-2">
            <li>Il canale WhatsApp e la trascrizione degli audio non sono collegati: la demo parte dal testo, o dalla dettatura del browser.</li>
            <li>L&apos;IVA al centesimo è il punto più debole: dipende da righe e quantità tutte giuste, e quando una sbaglia sbaglia anche lei.</li>
            <li>Il banco è piccolo e scritto da me con un agente AI: misura il motore su questo listino, non su qualunque artigiano.</li>
            <li>I prezzi vengono da un prezzario pubblico (Regione Lombardia 2026), non da un&apos;impresa vera.</li>
          </ul>
        </section>

        <section className="mt-14 rounded-card bg-ardesia p-6 text-fondo sm:p-8">
          <h2 className="text-[26px] font-black [font-stretch:80%]">Stack</h2>
          <p className="mt-2 text-[16px] leading-relaxed text-scuro-testo">
            Next.js 16 (App Router) e TypeScript, Claude API con uscite strutturate, zod, pdf-lib, Vitest (oltre 200 test, Claude
            sostituito da un finto), Vercel con Blob privato a Francoforte. Costruito con Claude Code e una squadra di agenti;
            architettura, regole e verifiche sono mie.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <Link href="/prova" className="bottone bottone-azione-scuro min-h-12 text-[16px]">
              Prova con un esempio
            </Link>
            <a href={REPO_URL} className="bottone min-h-12 border-2 border-cielo text-[16px] text-fondo hover:bg-cielo hover:text-inchiostro">
              Leggi il codice
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
