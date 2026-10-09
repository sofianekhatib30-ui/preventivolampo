"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dizionario } from "@/lib/i18n/it";
import { useLingua } from "@/lib/i18n/client";
import { MESTIERI } from "@/lib/impresa/schema";

// Il valore salvato è il nome italiano del mestiere; l'etichetta viene dal dizionario. La mappa è completa
// per costruzione: un mestiere nuovo in MESTIERI senza la sua voce qui non compila.
const CHIAVE_MESTIERE: Record<(typeof MESTIERI)[number], keyof Dizionario["area"]["modulo"]["mestieri"]> = {
  "Impresa edile": "impresaEdile",
  Muratore: "muratore",
  Idraulico: "idraulico",
  Elettricista: "elettricista",
  Imbianchino: "imbianchino",
  Piastrellista: "piastrellista",
  Cartongessista: "cartongessista",
  Serramentista: "serramentista",
  Termoidraulico: "termoidraulico",
  Giardiniere: "giardiniere",
};

export type ValoriImpresa = {
  ragione_sociale: string;
  piva: string;
  cf: string;
  indirizzo: string;
  telefono: string;
  email: string;
  iban: string;
  condizioni_pagamento: string;
  validita_giorni: string;
  mestieri: string[];
};

const campo = "mt-1 block min-h-12 w-full rounded-campo border border-linea-2 bg-superficie px-3 text-[17px] font-normal text-inchiostro";
const etichetta = "block text-[15px] font-semibold text-testo-2";

function Campo({
  nome,
  etichetta: testo,
  valore,
  cambia,
  nota,
  ...resto
}: { nome: keyof ValoriImpresa; etichetta: string; valore: string; cambia: (v: string) => void; nota?: string } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <label className={etichetta}>
      {testo}
      <input name={nome} value={valore} onChange={(e) => cambia(e.target.value)} className={campo} {...resto} />
      {nota && <span className="mt-1 block text-[14px] font-normal text-testo-3">{nota}</span>}
    </label>
  );
}

// Registrazione (modo «nuova») e modifica dei dati dell'impresa: sono quelli che finiscono sul PDF.
export default function ModuloImpresa({ iniziali, modo }: { iniziali: ValoriImpresa; modo: "nuova" | "modifica" }) {
  const router = useRouter();
  const M = useLingua().d.area.modulo;
  const [v, setV] = useState(iniziali);
  const [invio, setInvio] = useState(false);
  const [esito, setEsito] = useState<{ tipo: "ok" | "errore"; testo: string } | null>(null);
  const set = (k: keyof ValoriImpresa) => (x: string) => setV((p) => ({ ...p, [k]: x }));

  async function salva(e: React.FormEvent) {
    e.preventDefault();
    setInvio(true);
    setEsito(null);
    const res = await fetch("/api/area/impresa", {
      method: modo === "nuova" ? "POST" : "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(v),
    });
    const body = await res.json().catch(() => ({}));
    setInvio(false);
    if (!res.ok) {
      setEsito({ tipo: "errore", testo: body.errore ?? M.errore });
      return;
    }
    if (modo === "nuova") {
      router.replace(body.vai ?? "/area/listino");
      router.refresh();
    } else {
      setEsito({ tipo: "ok", testo: M.salvati });
      router.refresh();
    }
  }

  return (
    <form onSubmit={salva} className="mt-6 space-y-8" noValidate>
      <fieldset className="space-y-4">
        <legend className="text-xl font-extrabold">{M.chiSiete}</legend>
        <Campo nome="ragione_sociale" etichetta={M.ragioneSociale} valore={v.ragione_sociale} cambia={set("ragione_sociale")} autoComplete="organization" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo nome="piva" etichetta={M.piva} valore={v.piva} cambia={set("piva")} inputMode="numeric" required />
          <Campo nome="cf" etichetta={M.cf} valore={v.cf} cambia={set("cf")} autoCapitalize="characters" />
        </div>
        <Campo nome="indirizzo" etichetta={M.indirizzo} valore={v.indirizzo} cambia={set("indirizzo")} autoComplete="street-address" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo nome="telefono" etichetta={M.telefono} valore={v.telefono} cambia={set("telefono")} type="tel" autoComplete="tel" required />
          <Campo nome="email" etichetta={M.email} valore={v.email} cambia={set("email")} type="email" autoComplete="email" required />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-extrabold">{M.cheLavori}</legend>
        <p className="mt-1 text-[15px] text-testo-3">{M.cheLavoriNota}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {MESTIERI.map((m) => {
            const scelto = v.mestieri.includes(m);
            return (
              <label key={m} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-[16px] font-semibold ${scelto ? "border-ardesia bg-ardesia text-fondo" : "border-linea-2 bg-superficie"}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={scelto}
                  onChange={() => setV((p) => ({ ...p, mestieri: scelto ? p.mestieri.filter((x) => x !== m) : [...p.mestieri, m] }))}
                />
                {M.mestieri[CHIAVE_MESTIERE[m]]}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xl font-extrabold">{M.sulPreventivo}</legend>
        <Campo
          nome="validita_giorni"
          etichetta={M.validita}
          valore={v.validita_giorni}
          cambia={set("validita_giorni")}
          inputMode="numeric"
          nota={M.validitaNota}
        />
        <Campo nome="condizioni_pagamento" etichetta={M.condizioni} valore={v.condizioni_pagamento} cambia={set("condizioni_pagamento")} placeholder={M.condizioniEsempio} />
        <Campo nome="iban" etichetta={M.iban} valore={v.iban} cambia={set("iban")} autoCapitalize="characters" />
      </fieldset>

      {esito && (
        <p role={esito.tipo === "errore" ? "alert" : "status"} className={`text-[16px] font-semibold ${esito.tipo === "errore" ? "text-errore" : "text-successo"}`}>
          {esito.testo}
        </p>
      )}
      <button type="submit" disabled={invio} className="bottone bottone-azione min-h-14 w-full text-[18px] disabled:opacity-50 sm:w-auto">
        {invio ? M.salvo : modo === "nuova" ? M.registra : M.salva}
      </button>
    </form>
  );
}
