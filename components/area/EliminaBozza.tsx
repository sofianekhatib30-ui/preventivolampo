"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EliminaBozza({ id }: { id: string }) {
  const router = useRouter();
  const [conferma, setConferma] = useState(false);
  const [invio, setInvio] = useState(false);
  if (!conferma)
    return (
      <button type="button" onClick={() => setConferma(true)} className="min-h-11 text-[15px] font-semibold text-testo-3 underline">
        Elimina questa bozza
      </button>
    );
  return (
    <span className="flex flex-wrap items-center gap-3">
      <span className="text-[15px] text-testo-2">Eliminarla per sempre?</span>
      <button
        type="button"
        disabled={invio}
        onClick={async () => {
          setInvio(true);
          const res = await fetch(`/api/area/preventivi/${id}`, { method: "DELETE" });
          if (res.ok) {
            router.replace("/area");
            router.refresh();
          } else setInvio(false);
        }}
        className="min-h-11 text-[15px] font-bold text-errore underline"
      >
        Sì, elimina
      </button>
      <button type="button" onClick={() => setConferma(false)} className="min-h-11 text-[15px] font-semibold text-testo-3 underline">
        No
      </button>
    </span>
  );
}
