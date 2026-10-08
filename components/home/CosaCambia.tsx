import type { ReactNode } from "react";
import { SoloDesktop, SoloMobile } from "./Varianti";

const card =
  "flex flex-col gap-3 rounded-[20px] border border-linea bg-superficie p-6 lg:gap-[18px] lg:rounded-card lg:p-10";
const titoloCard = "m-0 text-[28px] leading-none font-extrabold [font-stretch:75%] lg:text-[34px]";
const testoCard = "testo-base m-0 text-testo-2";

function Card({ titolo, children, className = "" }: { titolo: string; children: ReactNode; className?: string }) {
  return (
    <article className={`${card} ${className}`}>
      <h3 className={titoloCard}>{titolo}</h3>
      {children}
    </article>
  );
}

export function CosaCambia() {
  return (
    <section id="perche" className="margini flex flex-col gap-6 py-14 lg:gap-14 lg:py-28">
      <div className="flex max-w-[860px] flex-col gap-2 lg:gap-4">
        <h2 className="titolo-h2 m-0 mb-2 lg:mb-0">
          Trascrivere un vocale lo sanno fare in tanti. Noi ci occupiamo di quello che ti fa perdere
          soldi.
        </h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card titolo="Il tuo listino, com'è">
          <p className={testoCard}>
            Carichi il listino che hai: Excel, PDF, la foto del foglio scritto a mano o qualche
            preventivo vecchio. Il sistema legge voci, unità di misura e prezzi, e tu controlli e
            confermi. Nessun prezzo entra senza che tu l&apos;abbia visto. Se ti blocchi, ti aiutiamo noi.
          </p>
          <TabellaListino />
        </Card>

        <Card titolo="Nessun prezzo inventato">
          <p className={testoCard}>
            <SoloDesktop>
              Diverse app, quando non trovano una voce, la stimano con «prezzi di mercato». Noi no: se
              non è nel tuo listino la segniamo da prezzare, e il prezzo lo metti tu. Un preventivo
              sbagliato al ribasso è un lavoro in perdita.
            </SoloDesktop>
            <SoloMobile>
              Se una voce non è nel tuo listino la segniamo da prezzare, e il prezzo lo metti tu. Mai
              stime «di mercato».
            </SoloMobile>
          </p>
          <ul className="m-0 mt-auto flex list-none flex-col gap-2.5 p-0 font-mono text-[12.5px] lg:text-sm">
            <li className="hidden justify-between gap-3 rounded-campo border border-linea px-4 py-3 lg:flex">
              <span>Rimozione vasca · 1 cad.</span>
              <span className="whitespace-nowrap text-lime-scuro">dal listino ✓</span>
            </li>
            <li className="flex justify-between gap-3 rounded-[10px] border-2 border-ambra-bordo bg-ambra px-3 py-2.5 font-semibold text-ambra-testo lg:rounded-campo lg:px-4 lg:py-3">
              <span>
                Box doccia su misura<SoloDesktop> · 1 cad.</SoloDesktop>
              </span>
              <span className="whitespace-nowrap">da prezzare</span>
            </li>
            <li className="hidden justify-between gap-3 rounded-campo border border-linea px-4 py-3 lg:flex">
              <span>Tinteggiatura soffitto · 6 m²</span>
              <span className="whitespace-nowrap text-lime-scuro">dal listino ✓</span>
            </li>
          </ul>
        </Card>

        <article
          className={`${card} lg:col-span-2 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-10`}
        >
          <div className="flex flex-col gap-3 lg:col-start-1 lg:row-start-1 lg:gap-[18px]">
            <h3 className={titoloCard}>L&apos;IVA edile fatta bene, da sola</h3>
            <p className={`${testoCard} hidden lg:block`}>
              Manutenzione su un&apos;abitazione? Il 10% vale per il lavoro, ma i beni significativi
              — sanitari, rubinetteria, infissi, caldaie — ci rientrano solo fino al valore del resto
              dell&apos;intervento. La parte che eccede va al 22%.
            </p>
            <p className={`${testoCard} hidden lg:block`}>
              Ti facciamo tre domande — tipo di immobile, tipo di lavoro, chi compra i materiali — e
              sul PDF l&apos;IVA 10% e 22% esce ripartita giusta, con la dicitura.
            </p>
            <p className={`${testoCard} lg:hidden`}>
              Il 10% sui lavori in casa, ma i beni significativi — sanitari, rubinetteria, infissi,
              caldaie — ci rientrano solo fino al valore del resto. La parte che eccede va al 22%.
              Tre domande, e sul PDF l&apos;IVA 10% e 22% esce ripartita giusta.
            </p>
          </div>
          <Scontrino />
          <p className="m-0 text-[13px] leading-normal text-testo-3 lg:col-start-1 lg:row-start-2 lg:self-end lg:text-sm">
            Esempio tratto dalla guida dell&apos;Agenzia delle Entrate. Per i casi particolari resta
            sempre il tuo commercialista.
          </p>
        </article>

        <Card titolo="Un aiuto vero, da una persona">
          <p className={testoCard}>
            <SoloDesktop>
              Logo, dati, condizioni di pagamento, acconti, esclusioni: li imposti tu in pochi minuti.
              Se ti blocchi, ci scrivi o ci chiami e ti risponde una persona, non un bot. E il primo
              preventivo lo mandi tu, dal furgone.
            </SoloDesktop>
            <SoloMobile>
              Logo, dati, pagamenti, acconti, esclusioni: li imposti tu in pochi minuti. Se ti blocchi,
              ti risponde una persona, non un bot.
            </SoloMobile>
          </p>
        </Card>

        <Card titolo="L'ultima parola è sempre tua">
          <p className={testoCard}>
            <SoloDesktop>Il sistema propone, tu decidi. </SoloDesktop>
            Nessun preventivo arriva al cliente senza che tu l&apos;abbia aperto e approvato. Le voci
            nuove che prezzi entrano nel tuo listino<SoloDesktop>, per la volta dopo</SoloDesktop>.
          </p>
        </Card>
      </div>
    </section>
  );
}

function TabellaListino() {
  const righe = [
    ["Posa gres a parete", "m²", "prestazione"],
    ["Miscelatore doccia", "cad.", "bene sign."],
    ["Smaltimento macerie", "viaggio", "prestazione"],
  ];
  return (
    <div className="mt-auto hidden overflow-hidden rounded-campo border border-linea lg:block">
      <table className="w-full border-collapse font-mono text-sm">
        <caption className="sr-only">Esempio di listino</caption>
        <thead className="bg-fondo">
          <tr>
            <th scope="col" className="px-4 py-2.5 text-left font-semibold">Voce</th>
            <th scope="col" className="w-20 px-3 py-2.5 text-left font-semibold">Unità</th>
            <th scope="col" className="w-[110px] px-4 py-2.5 text-right font-semibold">Tipo IVA</th>
          </tr>
        </thead>
        <tbody>
          {righe.map(([voce, unita, tipo]) => (
            <tr key={voce} className="border-t border-riga">
              <td className="px-4 py-2.5">{voce}</td>
              <td className="px-3 py-2.5">{unita}</td>
              <td className="px-4 py-2.5 text-right">{tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Scontrino di esempio con ruoli ARIA di tabella (come nel riferimento): righe flessibili,
// così a 390 px ogni riga tiene la sua larghezza invece di dividere colonne comuni.
function Scontrino() {
  return (
    <div
      role="table"
      aria-label="Esempio di ripartizione IVA"
      className="flex flex-col gap-[7px] rounded-campo border border-dashed border-linea-2 bg-scontrino p-4 font-mono text-[12.5px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:gap-2.5 lg:rounded-[14px] lg:p-7 lg:text-[15px]"
    >
      <div className="hidden pb-1.5 font-semibold lg:block">Manutenzione straordinaria · abitazione</div>
      <RigaScontrino voce={<>Manodopera e <SoloDesktop>altri </SoloDesktop>materiali</>} importo="4.000,00" />
      <RigaScontrino voce="Beni significativi" importo="6.000,00" />
      <div aria-hidden="true" className="border-t border-dashed border-linea-2 lg:my-1.5" />
      <RigaScontrino voce="Imponibile al 10%" importo="8.000,00" />
      <RigaScontrino voce="Imponibile al 22%" importo="2.000,00" />
      <RigaScontrino
        voce={<>IVA<SoloDesktop> 10% + IVA 22%</SoloDesktop></>}
        importo="800,00 + 440,00"
        className="text-testo-2"
      />
      <div aria-hidden="true" className="border-t-2 border-ardesia lg:my-1.5" />
      <RigaScontrino
        voce="Totale"
        importo={<span className="rounded bg-ardesia px-[5px] text-fondo lg:px-1.5">11.240,00 €</span>}
        className="text-sm font-semibold lg:text-[17px]"
      />
    </div>
  );
}

function RigaScontrino({
  voce,
  importo,
  className = "",
}: {
  voce: ReactNode;
  importo: ReactNode;
  className?: string;
}) {
  return (
    <div role="row" className={`flex justify-between gap-3 ${className}`}>
      <span role="cell">{voce}</span>
      <span role="cell" className="whitespace-nowrap text-right">
        {importo}
      </span>
    </div>
  );
}
