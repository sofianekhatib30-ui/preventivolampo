"use client";

import { useRouter } from "next/navigation";

export default function Esci({ className = "" }: { className?: string }) {
  const router = useRouter();
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
      Esci
    </button>
  );
}
