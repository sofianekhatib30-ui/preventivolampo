import type { VoceMotore } from "@/lib/listino/schema";
import type { Preventivo } from "./modello";

// Di chi è il preventivo: della demo pubblica (impresa inventata, archivio su file o Blob)
// o di un'impresa vera registrata (Supabase). Il servizio lavora uguale sui due.

export type Logo = { bytes: Uint8Array; tipo: "image/png" | "image/jpeg" };

export type Azienda = {
  name: string;
  address: string;
  vatNumber: string;
  phone: string;
  email: string;
  quoteValidityDays: number;
  // Solo per la demo: «impresa inventata, documento dimostrativo».
  avviso: string | null;
  iban: string | null;
  condizioniPagamento: string | null;
  logo: () => Promise<Logo | null>;
};

export type Evento = { tipo: "creato" | "modificato" | "approvato" | "visto" | "accettato" | "rifiutato"; dati?: Record<string, unknown> };

export interface Contesto {
  tipo: "demo" | "impresa";
  // Chi è l'impresa, per il motore («un'impresa edile di Monza che fa bagni e cucine»).
  descrizione?: string;
  azienda(): Promise<Azienda>;
  voci(): Promise<VoceMotore[]>;
  leggi(id: string): Promise<Preventivo | null>;
  // Il primo salvataggio assegna il numero definitivo; i successivi aggiornano.
  crea(p: Preventivo): Promise<Preventivo>;
  salva(p: Preventivo, evento?: Evento): Promise<void>;
  // Righe prezzate a mano e spuntate «aggiungi al listino»: diventano proposte da confermare.
  impara(p: Preventivo, righe: Preventivo["righe"]): Promise<void>;
}
