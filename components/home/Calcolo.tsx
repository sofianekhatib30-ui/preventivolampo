"use client";

import { useId, useState } from "react";
import { useLingua } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/testo";

// «Quanto ti costano oggi i preventivi»: i numeri li mette chi legge. Non promettiamo quanto
// tempo restituisce PreventivoLampo: quello si misura con il pilota, sui lavori veri.

const SETTIMANE_AL_MESE = 4.33;
const CANONE = 19.9;

function virgola(n: number, decimali = 0): string {
  return n.toFixed(decimali).replace(".", ",");
}

export function Calcolo() {
  const { d } = useLingua();
  const C = d.calcolo;
  const [preventivi, setPreventivi] = useState(5);
  const [minuti, setMinuti] = useState(45);
  const idP = useId();
  const idM = useId();

  const ore = (preventivi * minuti * SETTIMANE_AL_MESE) / 60;
  const allOra = CANONE / ore;

  return (
    <section aria-labelledby="calcolo-titolo" className="margini pb-14 lg:pb-28">
      <div className="grid gap-8 rounded-[24px] border-2 border-ardesia bg-superficie p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:rounded-[32px] lg:p-12">
        <div className="flex flex-col gap-7">
          <h2 id="calcolo-titolo" className="titolo-confronto m-0">
            {C.titolo}
          </h2>
          <Cursore
            id={idP}
            etichetta={C.preventivi}
            valore={preventivi}
            min={1}
            max={20}
            passo={1}
            mostra={String(preventivi)}
            onCambia={setPreventivi}
          />
          <Cursore
            id={idM}
            etichetta={C.minuti}
            valore={minuti}
            min={10}
            max={120}
            passo={5}
            mostra={fmt(C.min, { n: minuti })}
            onCambia={setMinuti}
          />
        </div>
        <div className="flex flex-col justify-center gap-4 rounded-[18px] bg-fondo p-6 lg:p-9">
          <p className="m-0 text-[17px] text-testo-2 lg:text-lg">{C.passi}</p>
          <p className="m-0 font-sans text-[72px] leading-[0.9] [font-weight:900] [font-stretch:62%] lg:text-[104px]">
            {fmt(C.ore, { n: virgola(ore) })}
          </p>
          <p className="m-0 text-[17px] leading-normal text-testo-2 lg:text-lg">
            {C.costa} <strong className="text-inchiostro">{fmt(C.allOra, { n: virgola(allOra, 2) })}</strong>
          </p>
          <p className="m-0 text-[14px] leading-normal text-testo-3">
            {C.nota}
          </p>
        </div>
      </div>
    </section>
  );
}

function Cursore({
  id,
  etichetta,
  valore,
  min,
  max,
  passo,
  mostra,
  onCambia,
}: {
  id: string;
  etichetta: string;
  valore: number;
  min: number;
  max: number;
  passo: number;
  mostra: string;
  onCambia: (n: number) => void;
}) {
  const pieno = `${((valore - min) / (max - min)) * 100}%`;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[16px] font-semibold lg:text-[17px]">
          {etichetta}
        </label>
        <span className="whitespace-nowrap font-mono text-[20px] font-bold">{mostra}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={passo}
        value={valore}
        onChange={(e) => onCambia(Number(e.target.value))}
        className="cursore"
        style={{ ["--pieno" as string]: pieno }}
      />
    </div>
  );
}
