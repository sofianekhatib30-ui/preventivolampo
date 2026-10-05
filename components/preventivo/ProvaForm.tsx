"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Esempio = { id: string; titolo: string; testo: string };

export default function ProvaForm({ esempi, chiediCodice }: { esempi: Esempio[]; chiediCodice: boolean }) {
  const router = useRouter();
  const [testo, setTesto] = useState("");
  const [codice, setCodice] = useState("");
  const [stato, setStato] = useState<"pronto" | "invio" | "errore">("pronto");
  const [errore, setErrore] = useState("");

  async function invia(e: React.FormEvent) {
    e.preventDefault();
    setStato("invio");
    setErrore("");
    try {
      const res = await fetch("/api/elabora", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ testo, codice }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.errore ?? "Errore");
      router.push(body.revisione);
    } catch (err) {
      setErrore(err instanceof Error ? err.message : "Errore");
      setStato("errore");
    }
  }

  return (
    <form onSubmit={invia} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-semibold">Esempio dal banco di prova</span>
        <select
          className="mt-1 block w-full rounded-campo border border-linea-2 bg-superficie px-3 py-3"
          defaultValue=""
          onChange={(e) => setTesto(esempi.find((x) => x.id === e.target.value)?.testo ?? "")}
        >
          <option value="">— scegli un sopralluogo inventato —</option>
          {esempi.map((x) => (
            <option key={x.id} value={x.id}>
              {x.id} · {x.titolo}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Testo del vocale</span>
        <textarea
          required
          minLength={30}
          maxLength={6000}
          rows={10}
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Allora, sopralluogo dalla signora Rossi, via Roma 3 a Monza. Il bagno è due per uno e ottanta…"
          className="mt-1 block w-full rounded-campo border border-linea-2 bg-superficie px-3 py-3 leading-relaxed"
        />
      </label>
      {chiediCodice && (
        <label className="block">
          <span className="text-sm font-semibold">Codice d&apos;accesso</span>
          <span className="block text-sm text-testo-3">Ogni prova chiama l&apos;API di Claude: il codice evita che la demo venga consumata da bot.</span>
          <input
            required
            autoComplete="off"
            value={codice}
            onChange={(e) => setCodice(e.target.value)}
            className="mt-1 block w-full rounded-campo border border-linea-2 bg-superficie px-3 py-3 sm:w-64"
          />
        </label>
      )}
      <button
        type="submit"
        disabled={stato === "invio"}
        className="w-full rounded-campo bg-inchiostro px-5 py-4 font-bold text-fondo disabled:opacity-60 sm:w-auto"
      >
        {stato === "invio" ? "Sto leggendo il sopralluogo… (circa 20 secondi)" : "Prepara la bozza"}
      </button>
      {errore && (
        <p role="alert" className="rounded-campo bg-segnale px-4 py-3 font-semibold">
          {errore}
        </p>
      )}
    </form>
  );
}
