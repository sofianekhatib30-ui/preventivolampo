import type { ReactNode } from "react";
import { Header } from "@/components/home/Header";
import { SaltaAlContenuto } from "@/components/SaltaAlContenuto";
import type { Contenuti } from "@/lib/contenuti";
import type { Dizionario } from "@/lib/i18n/it";
import type { LinguaSito } from "@/lib/i18n/lingue";
import { Piede } from "./Piede";

// Struttura comune delle pagine pubbliche: salta al contenuto, testata, contenuto, mappa del sito.
export function Guscio({ d, c, lingua, children }: { d: Dizionario; c: Contenuti; lingua: LinguaSito; children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SaltaAlContenuto testo={d.comune.saltaAlContenuto} />
      <Header d={d} c={c} lingua={lingua} />
      <main id="contenuto" tabIndex={-1} className="flex flex-col outline-none">
        {children}
      </main>
      <Piede d={d} c={c} lingua={lingua} />
    </div>
  );
}
