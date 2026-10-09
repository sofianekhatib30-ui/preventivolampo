"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type Dizionario, it } from "./it";
import type { LinguaSito } from "./lingue";

// Il dizionario della lingua scelta, per i componenti che girano nel browser.
// pubblica: la pagina ha un indirizzo per lingua (/ro/…), e cambiare lingua vuol dire cambiare indirizzo.
// Senza provider (test) vale l'italiano.
type Valore = { lingua: LinguaSito; d: Dizionario; pubblica: boolean };
const Contesto = createContext<Valore>({ lingua: "it", d: it, pubblica: false });

export function LinguaProvider({ lingua, d, pubblica = false, children }: { lingua: LinguaSito; d: Dizionario; pubblica?: boolean; children: ReactNode }) {
  return <Contesto.Provider value={{ lingua, d, pubblica }}>{children}</Contesto.Provider>;
}

export function useLingua() {
  return useContext(Contesto);
}
