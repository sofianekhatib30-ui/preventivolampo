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
