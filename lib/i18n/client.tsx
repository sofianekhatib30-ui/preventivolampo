"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Dizionario, it } from "./it";
import type { LinguaSito } from "./lingue";

// Il dizionario della lingua scelta, per i componenti che girano nel browser.
// Senza provider (test) vale l'italiano.
const Contesto = createContext<{ lingua: LinguaSito; d: Dizionario }>({ lingua: "it", d: it });

export function LinguaProvider({ lingua, d, children }: { lingua: LinguaSito; d: Dizionario; children: ReactNode }) {
  return <Contesto.Provider value={{ lingua, d }}>{children}</Contesto.Provider>;
}

export function useLingua() {
  return useContext(Contesto);
}
