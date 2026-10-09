"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLingua } from "@/lib/i18n/client";

export default function EliminaBozza({ id }: { id: string }) {
  const router = useRouter();
  const E = useLingua().d.area.eliminaBozza;
  const [conferma, setConferma] = useState(false);
  const [invio, setInvio] = useState(false);
  if (!conferma)
    return (
      <button type="button" onClick={() => setConferma(true)} className="min-h-11 text-[15px] font-semibold text-testo-3 underline">
        {E.elimina}
      </button>
    );
  return (
    <span className="flex flex-wrap items-center gap-3">
      <span className="text-[15px] text-testo-2">{E.conferma}</span>
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
        {E.si}
      </button>
      <button type="button" onClick={() => setConferma(false)} className="min-h-11 text-[15px] font-semibold text-testo-3 underline">
        {E.no}
      </button>
    </span>
  );
}
