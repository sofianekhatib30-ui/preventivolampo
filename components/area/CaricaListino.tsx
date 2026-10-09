"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLingua } from "@/lib/i18n/client";

// Le foto del telefono pesano anche 5-10 MB: prima di mandarle le riduco nel browser
// (lato lungo 2000 px, JPEG), così passano il limite di 4,5 MB e l'AI le legge bene lo stesso.
async function riduci(f: File): Promise<File> {
  if (!f.type.startsWith("image/") || f.size < 700_000) return f;
  try {
    const img = await createImageBitmap(f);
    const scala = Math.min(1, 2000 / Math.max(img.width, img.height));
    const tela = document.createElement("canvas");
    tela.width = Math.round(img.width * scala);
    tela.height = Math.round(img.height * scala);
    tela.getContext("2d")!.drawImage(img, 0, 0, tela.width, tela.height);
    const blob = await new Promise<Blob | null>((ok) => tela.toBlob(ok, "image/jpeg", 0.85));
    return blob ? new File([blob], f.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : f;
  } catch {
    return f;
  }
}

// Carico il listino: il server lo legge e prepara le righe da controllare.
export default function CaricaListino() {
  const router = useRouter();
  const C = useLingua().d.area.caricaListino;
  const [invio, setInvio] = useState(false);
  const [errore, setErrore] = useState("");
  const [trascina, setTrascina] = useState(false);

  async function carica(scelti: File[]) {
    if (!scelti.length) return;
    setInvio(true);
    setErrore("");
    const form = new FormData();
    for (const f of await Promise.all(scelti.map(riduci))) form.append("file", f);
    const res = await fetch("/api/area/import", { method: "POST", body: form });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setInvio(false);
      return setErrore(body.errore ?? C.errore);
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
          carica(Array.from(e.dataTransfer.files ?? []));
        }}
        className={`flex min-h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed px-6 text-center ${
          trascina ? "border-ardesia bg-fondo-2" : "border-linea-2 bg-superficie"
        }`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-10 text-testo-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h6" />
        </svg>
        <span className="text-[18px] font-bold">{invio ? C.leggo : C.scegli}</span>
        <span className="text-[15px] text-testo-3">{C.formati}</span>
        {invio && <span className="text-[15px] text-testo-3">{C.attesa}</span>}
      </label>
      <input
        id="file-listino"
        type="file"
        className="sr-only"
        disabled={invio}
        multiple
        accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.pdf,application/pdf,image/*"
        onChange={(e) => {
          carica(Array.from(e.target.files ?? []));
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
