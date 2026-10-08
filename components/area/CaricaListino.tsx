"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

// Carico il file: il server lo legge e prepara le righe da controllare.
export default function CaricaListino() {
  const router = useRouter();
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");
  const [trascina, setTrascina] = useState(false);

  async function carica(f: File) {
    setInvio(true);
    setErrore("");
    const form = new FormData();
    form.set("file", f);
    const res = await fetch("/api/area/import", { method: "POST", body: form });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setInvio(false);
      return setErrore(body.errore ?? "Non sono riuscito a leggere il file.");
    }
    router.push(body.vai);
  }

  return (
    <div className="mt-6">
      <label
        htmlFor="file-listino"
        onDragOver={(e) => {
          e.preventDefault();
          setTrascina(true);
        }}
        onDragLeave={() => setTrascina(false)}
        onDrop={(e) => {
          e.preventDefault();
          setTrascina(false);
          const f = e.dataTransfer.files?.[0];
          if (f) carica(f);
        }}
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 text-center ${
          trascina ? "border-ardesia bg-fondo-2" : "border-linea-2 bg-superficie"
        }`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-10 text-testo-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
        <span className="text-[18px] font-bold">{invio ? "Leggo il file…" : "Scegli il file del listino"}</span>
        <span className="text-[15px] text-testo-3">Excel (.xlsx) o CSV, fino a 5 MB</span>
      </label>
      <input
        id="file-listino"
        type="file"
        className="sr-only"
        disabled={invio}
        accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) carica(f);
          e.target.value = "";
        }}
      />
      {errore && (
        <p role="alert" className="mt-3 text-[16px] font-semibold text-errore">
          {errore}
        </p>
      )}
    </div>
  );
}
