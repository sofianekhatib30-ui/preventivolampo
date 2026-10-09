"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useLingua } from "@/lib/i18n/client";

// Logo dell'impresa: va sul PDF e sulla pagina del cliente. PNG o JPG fino a 1 MB.
export default function CaricaLogo({ presente }: { presente: boolean }) {
  const router = useRouter();
  const L = useLingua().d.area.logo;
  const file = useRef<HTMLInputElement>(null);
  const [versione, setVersione] = useState(0);
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");

  async function carica(f: File) {
    setInvio(true);
    setErrore("");
    const form = new FormData();
    form.set("logo", f);
    const res = await fetch("/api/area/impresa/logo", { method: "POST", body: form });
    setInvio(false);
    if (!res.ok) setErrore((await res.json().catch(() => ({}))).errore ?? L.errore);
    else {
      setVersione((x) => x + 1);
      router.refresh();
    }
  }

  async function togli() {
    setInvio(true);
    await fetch("/api/area/impresa/logo", { method: "DELETE" });
    setInvio(false);
    router.refresh();
  }

  return (
    <section aria-labelledby="titolo-logo" className="mt-6 rounded-card bg-superficie p-5 ring-1 ring-linea">
      <h2 id="titolo-logo" className="text-xl font-extrabold">
        {L.titolo}
      </h2>
      <div className="mt-3 flex flex-wrap items-center gap-4">
        <div className="flex h-20 w-40 items-center justify-center rounded-campo border border-dashed border-linea-2 bg-fondo">
          {presente ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/area/impresa/logo?v=${versione}`} alt={L.attuale} className="max-h-16 max-w-36 object-contain" />
          ) : (
            <span className="text-[14px] text-testo-3">{L.nessuno}</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={file}
            type="file"
            accept="image/png,image/jpeg"
            className="sr-only"
            id="file-logo"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) carica(f);
              e.target.value = "";
            }}
          />
          <label htmlFor="file-logo" className="bottone min-h-12 cursor-pointer border-2 border-ardesia text-[16px]">
            {invio ? L.carico : presente ? L.cambia : L.carica}
          </label>
          {presente && (
            <button type="button" onClick={togli} disabled={invio} className="min-h-12 px-2 text-[15px] font-semibold text-testo-3 underline">
              {L.togli}
            </button>
          )}
        </div>
      </div>
      <p className="mt-2 text-[14px] text-testo-3">{L.nota}</p>
      {errore && (
        <p role="alert" className="mt-2 text-[15px] font-semibold text-errore">
          {errore}
        </p>
      )}
    </section>
  );
}
