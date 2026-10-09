import { Frasi } from "@/components/Frasi";
import type { ReactNode } from "react";
import type { Dizionario } from "@/lib/i18n/it";

const card = "flex flex-col gap-3 rounded-[20px] border border-linea bg-superficie p-6 lg:gap-[18px] lg:rounded-card lg:p-10";
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

export function CosaCambia({ d }: { d: Dizionario }) {
  const C = d.cosa;
  return (
    <section id="perche" className="margini flex flex-col gap-6 py-14 lg:gap-14 lg:py-28">
      <div className="flex max-w-[860px] flex-col gap-2 lg:gap-4">
        <h2 className="titolo-h2 m-0 mb-2 lg:mb-0"><Frasi testo={C.titolo} /></h2>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card titolo={C.listinoTitolo}>
          <p className={testoCard}>{C.listinoTesto}</p>
          <TabellaListino C={C} />
        </Card>

        <Card titolo={C.prezzoTitolo}>
          <p className={testoCard}>{C.prezzoTesto}</p>
          <ul lang="it" dir="ltr" className="m-0 mt-auto flex list-none flex-col gap-2.5 p-0 font-mono text-[12.5px] lg:text-sm">
            <li className="hidden justify-between gap-3 rounded-campo border border-linea px-4 py-3 lg:flex">
              <span>Rimozione vasca · 1 cad.</span>
              <span className="whitespace-nowrap text-lime-scuro">{C.dalListino}</span>
            </li>
            <li className="flex justify-between gap-3 rounded-[10px] border-2 border-ambra-bordo bg-ambra px-3 py-2.5 font-semibold text-ambra-testo lg:rounded-campo lg:px-4 lg:py-3">
              <span>Box doccia su misura · 1 cad.</span>
              <span className="whitespace-nowrap">{d.demo.daPrezzare}</span>
            </li>
            <li className="hidden justify-between gap-3 rounded-campo border border-linea px-4 py-3 lg:flex">
              <span>Tinteggiatura soffitto · 6 m²</span>
              <span className="whitespace-nowrap text-lime-scuro">{C.dalListino}</span>
            </li>
          </ul>
        </Card>

        <article className={`${card} lg:col-span-2 lg:grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-10`}>
          <div className="flex flex-col gap-3 lg:col-start-1 lg:row-start-1 lg:gap-[18px]">
            <h3 className={titoloCard}>{C.ivaTitolo}</h3>
            <p className={testoCard}>{C.ivaTesto1}</p>
            <p className={testoCard}>{C.ivaTesto2}</p>
          </div>
          <Scontrino S={C.scontrino} />
          <p className="m-0 text-[13px] leading-normal text-testo-3 lg:col-start-1 lg:row-start-2 lg:self-end lg:text-sm">{C.ivaNota}</p>
        </article>

        <article className={`${card} lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-x-10`}>
          <div className="flex flex-col gap-3 lg:gap-[18px]">
            <h3 className={titoloCard}>{C.lingueTitolo}</h3>
            <p className={testoCard}>{C.lingueTesto}</p>
          </div>
          <ol className="m-0 mt-4 flex list-none flex-col gap-2 p-0 font-mono text-[13px] lg:mt-0 lg:text-sm">
            <li lang="ro" dir="ltr" className="rounded-campo bg-bolla-mia px-4 py-3">
              «Scot faianța veche din baie, doisprezece metri.»
            </li>
            <li className="rounded-campo border border-linea px-4 py-3">
              <span lang="it" className="font-semibold">
                Rimozione rivestimento in piastrelle · 12 mq
              </span>
              <span className="block text-testo-3">{C.lingueDalListino}</span>
            </li>
            <li className="rounded-campo border border-linea px-4 py-3">
              <span lang="de">Entfernung des Fliesenbelags</span>
              <span className="block text-testo-3">{C.lingueAlCliente}</span>
            </li>
          </ol>
        </article>

        <Card titolo={C.aiutoTitolo}>
          <p className={testoCard}>{C.aiutoTesto}</p>
        </Card>

        <Card titolo={C.ultimaTitolo}>
          <p className={testoCard}>{C.ultimaTesto}</p>
        </Card>
      </div>
    </section>
  );
}

function TabellaListino({ C }: { C: Dizionario["cosa"] }) {
  const T = C.tabella;
  const righe = [
    ["Posa gres a parete", "m²", T.prestazione],
    ["Miscelatore doccia", "cad.", T.beneSign],
    ["Smaltimento macerie", "viaggio", T.prestazione],
  ];
  return (
    <div className="mt-auto hidden overflow-hidden rounded-campo border border-linea lg:block">
      <table className="w-full border-collapse font-mono text-sm">
        <caption className="sr-only">{T.didascalia}</caption>
        <thead className="bg-fondo">
          <tr>
            <th scope="col" className="px-4 py-2.5 text-start font-semibold">{T.voce}</th>
            <th scope="col" className="w-20 px-3 py-2.5 text-start font-semibold">{T.unita}</th>
            <th scope="col" className="w-[110px] px-4 py-2.5 text-end font-semibold">{T.tipoIva}</th>
          </tr>
        </thead>
        <tbody>
          {righe.map(([voce, unita, tipo]) => (
            <tr key={voce} className="border-t border-riga">
              <td lang="it" className="px-4 py-2.5">{voce}</td>
              <td lang="it" className="px-3 py-2.5">{unita}</td>
              <td className="px-4 py-2.5 text-end">{tipo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Scontrino di esempio con ruoli ARIA di tabella: righe flessibili, così a 390 px ogni riga tiene la sua larghezza.
function Scontrino({ S }: { S: Dizionario["cosa"]["scontrino"] }) {
  return (
    <div
      role="table"
      aria-label={S.etichetta}
      className="flex flex-col gap-[7px] rounded-campo border border-dashed border-linea-2 bg-scontrino p-4 font-mono text-[12.5px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:gap-2.5 lg:rounded-[14px] lg:p-7 lg:text-[15px]"
    >
      <div className="hidden pb-1.5 font-semibold lg:block">{S.titolo}</div>
      <RigaScontrino voce={S.manodopera} importo="4.000,00" />
      <RigaScontrino voce={S.beni} importo="6.000,00" />
      <div aria-hidden="true" className="border-t border-dashed border-linea-2 lg:my-1.5" />
      <RigaScontrino voce={S.imp10} importo="8.000,00" />
      <RigaScontrino voce={S.imp22} importo="2.000,00" />
      <RigaScontrino voce={S.iva} importo="800,00 + 440,00" className="text-testo-2" />
      <div aria-hidden="true" className="border-t-2 border-ardesia lg:my-1.5" />
      <RigaScontrino
        voce={S.totale}
        importo={<span className="rounded bg-ardesia px-[5px] text-fondo lg:px-1.5">11.240,00 €</span>}
        className="text-sm font-semibold lg:text-[17px]"
      />
    </div>
  );
}

function RigaScontrino({ voce, importo, className = "" }: { voce: ReactNode; importo: ReactNode; className?: string }) {
  return (
    <div role="row" className={`flex justify-between gap-3 ${className}`}>
      <span role="cell">{voce}</span>
      <span role="cell" dir="ltr" className="whitespace-nowrap text-end">
        {importo}
      </span>
    </div>
  );
}
