import { cookies } from "next/headers";
import { DIZIONARI } from "./dizionari";
import { COOKIE_LINGUA, linguaValida, type LinguaSito } from "./lingue";

// La lingua dell'interfaccia per questa richiesta: dal cookie di preferenza, altrimenti italiano.
// Fuori da una richiesta (test, generazione statica) vale l'italiano.
export async function linguaRichiesta(): Promise<LinguaSito> {
  try {
    return linguaValida((await cookies()).get(COOKIE_LINGUA)?.value);
  } catch {
    return "it";
  }
}

export async function dizionario() {
  const lingua = await linguaRichiesta();
  return { lingua, d: DIZIONARI[lingua] };
}

export function dizionarioDi(lingua: LinguaSito) {
  return DIZIONARI[lingua];
}

// Le sole parti del dizionario che servono ai componenti del browser nelle pagine pubbliche
// (menu, selettore della lingua, demo, calcolo, modulo di candidatura): il resto non viaggia.
// test/dizionari.test.ts controlla che quei componenti non leggano altre sezioni.
export const SEZIONI_CLIENT_PUBBLICHE = ["comune", "nav", "demo", "calcolo", "candidatura"] as const;

export function dizionarioClientPubblico(lingua: LinguaSito) {
  const d = DIZIONARI[lingua];
  return Object.fromEntries(SEZIONI_CLIENT_PUBBLICHE.map((k) => [k, d[k]])) as unknown as typeof d;
}
