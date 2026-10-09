"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dettatura from "@/components/preventivo/Dettatura";
import { useLingua } from "@/lib/i18n/client";

// Il sopralluogo raccontato (scritto o dettato) diventa una bozza con i prezzi del listino dell'impresa.
export default function NuovoPreventivo() {
  const router = useRouter();
  const N = useLingua().d.area.nuovo;
  const FASI = N.fasi;
  const [testo, setTesto] = useState("");
  const [invio, setInvio] = useState(false);
  const [fase, setFase] = useState(0);
  const [errore, setErrore] = useState("");

  useEffect(() => {
    if (!invio) return;
    const t = window.setInterval(() => setFase((f) => Math.min(f + 1, FASI.length - 1)), 4500);
    return () => window.clearInterval(t);
  }, [invio, FASI.length]);

  async function invia(e: React.FormEvent) {
    e.preventDefault();
    setFase(0);
    setInvio(true);
    setErrore("");
    try {
      const res = await fetch("/api/area/preventivi", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ testo }) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.errore ?? N.errore);
      router.push(body.revisione);
    } catch (err) {
      setErrore(err instanceof Error ? err.message : N.errore);
      setInvio(false);
    }
  }

  const corto = testo.trim().length < 30;
  return (
    <form className="mt-6 space-y-4" onSubmit={invia}>
      <label className="block">
        <span className="text-[17px] font-semibold">{N.racconta}</span>
        <textarea
          required
          minLength={30}
          maxLength={6000}
          rows={10}
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder={N.segnaposto}
          className="mt-2 block w-full rounded-campo border border-linea-2 bg-superficie px-3 py-3 text-[17px] leading-relaxed"
        />
      </label>
      <Dettatura onTesto={(pezzo) => setTesto((t) => (t ? `${t.trimEnd()} ${pezzo}` : pezzo))} />
      <button type="submit" disabled={invio || corto} className="bottone bottone-azione min-h-14 w-full text-[18px] disabled:opacity-50 sm:w-auto">
        {invio ? N.attesa : N.prepara}
      </button>
      {invio && (
        <ol aria-live="polite" className="space-y-1.5 rounded-campo bg-ardesia p-4 text-[16px] text-scuro-testo">
          {FASI.slice(0, fase + 1).map((f, i) => (
            <li key={f} className={i === fase ? "font-semibold text-fondo" : ""}>
              <span aria-hidden="true" className={i === fase ? "text-lime" : "text-scuro-nota"}>
                {i === fase ? "● " : "✓ "}
              </span>
              {f}
            </li>
          ))}
        </ol>
      )}
      {errore && (
        <p role="alert" className="rounded-campo border-l-4 border-errore bg-superficie px-4 py-3 font-semibold text-errore">
          {errore}
        </p>
      )}
    </form>
  );
}
