"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Ricco } from "@/components/Ricco";
import { useLingua } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/testo";

const campo = "mt-1 block min-h-14 w-full rounded-campo border border-linea-2 bg-superficie px-4 text-[19px]";

// Accesso in due passi: email, poi il codice arrivato per email. Niente password da ricordare.
export default function Accesso() {
  const router = useRouter();
  const { d } = useLingua();
  const A = d.accesso;
  const [passo, setPasso] = useState<"email" | "codice">("email");
  const [email, setEmail] = useState("");
  const [codice, setCodice] = useState("");
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");
  const [nuovoTra, setNuovoTra] = useState(0);
  const campoCodice = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (passo === "codice") campoCodice.current?.focus();
  }, [passo]);

  useEffect(() => {
    if (nuovoTra <= 0) return;
    const t = window.setTimeout(() => setNuovoTra((n) => n - 1), 1000);
    return () => window.clearTimeout(t);
  }, [nuovoTra]);

  async function chiama(url: string, dati: object) {
    setInvio(true);
    setErrore("");
    try {
      const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(dati) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.errore ?? A.errore);
      return body as { vai?: string };
    } catch (e) {
      setErrore(e instanceof Error ? e.message : A.errore);
      return null;
    } finally {
      setInvio(false);
    }
  }

  async function mandaCodice(e?: React.FormEvent) {
    e?.preventDefault();
    if (await chiama("/api/area/codice", { email })) {
      setPasso("codice");
      setCodice("");
      setNuovoTra(60);
    }
  }

  async function entra(e: React.FormEvent) {
    e.preventDefault();
    const r = await chiama("/api/area/entra", { email, codice });
    if (r?.vai) {
      router.replace(r.vai);
      router.refresh();
    }
  }

  return passo === "email" ? (
    <form onSubmit={mandaCodice} className="mt-8" noValidate>
      <label className="block text-[16px] font-semibold text-testo-2">
        {A.email}
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={campo}
          aria-describedby={errore ? "errore-accesso" : undefined}
        />
      </label>
      {errore && (
        <p id="errore-accesso" role="alert" className="mt-3 text-[16px] font-semibold text-errore">
          {errore}
        </p>
      )}
      <button type="submit" disabled={invio || !email.includes("@")} className="bottone bottone-azione mt-5 min-h-14 w-full text-[18px] disabled:opacity-50">
        {invio ? A.invioCodice : A.mandaCodice}
      </button>
      <p className="mt-4 text-[15px] leading-relaxed text-testo-3">
        {A.spiegazione}
      </p>
    </form>
  ) : (
    <form onSubmit={entra} className="mt-8" noValidate>
      <p className="text-[17px] text-testo-2">
        <Ricco testo={fmt(A.scritto, { email })} classeGrassetto="text-inchiostro" />
      </p>
      <label className="mt-5 block text-[16px] font-semibold text-testo-2">
        {A.codice}
        <input
          ref={campoCodice}
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={8}
          value={codice}
          onChange={(e) => setCodice(e.target.value.replace(/\D/g, ""))}
          className={`${campo} font-mono text-[28px] tracking-[0.3em]`}
          aria-describedby={errore ? "errore-accesso" : undefined}
        />
      </label>
      {errore && (
        <p id="errore-accesso" role="alert" className="mt-3 text-[16px] font-semibold text-errore">
          {errore}
        </p>
      )}
      <button type="submit" disabled={invio || codice.length < 6} className="bottone bottone-azione mt-5 min-h-14 w-full text-[18px] disabled:opacity-50">
        {invio ? A.controllo : A.accedi}
      </button>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
        <button type="button" disabled={invio || nuovoTra > 0} onClick={() => mandaCodice()} className="min-h-11 text-[15px] font-semibold text-cielo-scuro underline disabled:text-testo-3 disabled:no-underline">
          {nuovoTra > 0 ? fmt(A.nuovoTra, { n: nuovoTra }) : A.nuovo}
        </button>
        <button type="button" onClick={() => setPasso("email")} className="min-h-11 text-[15px] font-semibold text-testo-3 underline">
          {A.cambiaEmail}
        </button>
      </div>
    </form>
  );
}
