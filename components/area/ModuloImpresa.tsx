"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MESTIERI } from "@/lib/impresa/schema";

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
      setEsito({ tipo: "errore", testo: body.errore ?? "Non sono riuscito a salvare. Riprova." });
      return;
    }
    if (modo === "nuova") {
      router.replace(body.vai ?? "/area/listino");
      router.refresh();
    } else {
      setEsito({ tipo: "ok", testo: "Dati salvati. I prossimi PDF useranno questi." });
      router.refresh();
    }
  }

  return (
    <form onSubmit={salva} className="mt-6 space-y-8" noValidate>
      <fieldset className="space-y-4">
        <legend className="text-xl font-extrabold">Chi siete</legend>
        <Campo nome="ragione_sociale" etichetta="Ragione sociale" valore={v.ragione_sociale} cambia={set("ragione_sociale")} autoComplete="organization" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo nome="piva" etichetta="Partita IVA" valore={v.piva} cambia={set("piva")} inputMode="numeric" required />
          <Campo nome="cf" etichetta="Codice fiscale (se diverso)" valore={v.cf} cambia={set("cf")} autoCapitalize="characters" />
        </div>
        <Campo nome="indirizzo" etichetta="Sede (via, numero, città)" valore={v.indirizzo} cambia={set("indirizzo")} autoComplete="street-address" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo nome="telefono" etichetta="Telefono" valore={v.telefono} cambia={set("telefono")} type="tel" autoComplete="tel" required />
          <Campo nome="email" etichetta="Email sul preventivo" valore={v.email} cambia={set("email")} type="email" autoComplete="email" required />
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-xl font-extrabold">Che lavori fate</legend>
        <p className="mt-1 text-[15px] text-testo-3">Aiuta a leggere meglio i vostri sopralluoghi.</p>
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
                {m}
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xl font-extrabold">Sul preventivo</legend>
        <Campo
          nome="validita_giorni"
          etichetta="Validità del preventivo (giorni)"
          valore={v.validita_giorni}
          cambia={set("validita_giorni")}
          inputMode="numeric"
          nota="Dopo questi giorni il cliente non può più accettarlo dal link."
        />
        <Campo nome="condizioni_pagamento" etichetta="Condizioni di pagamento" valore={v.condizioni_pagamento} cambia={set("condizioni_pagamento")} placeholder="Es. 30% all'accettazione, saldo a fine lavori" />
        <Campo nome="iban" etichetta="IBAN per i bonifici" valore={v.iban} cambia={set("iban")} autoCapitalize="characters" />
      </fieldset>

      {esito && (
        <p role={esito.tipo === "errore" ? "alert" : "status"} className={`text-[16px] font-semibold ${esito.tipo === "errore" ? "text-errore" : "text-successo"}`}>
          {esito.testo}
        </p>
      )}
      <button type="submit" disabled={invio} className="bottone bottone-azione min-h-14 w-full text-[18px] disabled:opacity-50 sm:w-auto">
        {invio ? "Salvo…" : modo === "nuova" ? "Registra l'impresa" : "Salva i dati"}
      </button>
    </form>
  );
}
