"use client";

import { useRouter } from "next/navigation";
import { useLingua } from "@/lib/i18n/client";

export default function Esci({ className = "" }: { className?: string }) {
  const router = useRouter();
  const { d } = useLingua();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await fetch("/api/area/esci", { method: "POST" }).catch(() => {});
        router.replace("/accedi");
        router.refresh();
      }}
    >
      {d.area.testata.esci}
    </button>
  );
}
