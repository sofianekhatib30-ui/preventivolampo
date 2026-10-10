import { createServerClient } from "@supabase/ssr";

// Il cookie di sessione condiviso da tutti gli strumenti di K Digital Solution, e l'unico punto che
// crea il client di sessione lato server. Niente next/headers qui: lo usa anche proxy.ts.

export const COOKIE = "kds-sessione";
export const ACCOUNT = "https://account.kdigitalsolution.it";
export const DOMINIO = "kdigitalsolution.it";
export const ORIGINE_APP = "https://preventivi.kdigitalsolution.it";
const DURATA_S = 30 * 24 * 3600;

export function dominioCookie(host: string | null | undefined): string | undefined {
  const h = String(host ?? "").toLowerCase().replace(/:\d+$/, "");
  return h === DOMINIO || h.endsWith(`.${DOMINIO}`) ? `.${DOMINIO}` : undefined;
}

// Le opzioni con cui il cookie esce verso il browser: sempre le stesse dell'account.
export function opzioniCookie(proposte: Record<string, unknown> | undefined, host: string | null | undefined) {
  const cancella = proposte?.maxAge === 0;
  return {
    ...(proposte ?? {}),
    httpOnly: false,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: cancella ? 0 : DURATA_S,
    domain: dominioCookie(host),
  };
}

type CookieLetto = { name: string; value: string };
export type CookieDaPosare = { name: string; value: string; options: ReturnType<typeof opzioniCookie> };

// L'unico punto che crea il client di sessione. `scrivi` riceve i cookie già induriti.
export function clienteSessione(leggi: () => CookieLetto[], scrivi: ((c: CookieDaPosare[]) => void) | null, host: string | null) {
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookieOptions: { ...opzioniCookie({}, host), name: COOKIE },
    cookies: {
      getAll: leggi,
      setAll(lista) {
        if (!scrivi) return;
        scrivi(lista.map(({ name, value, options }) => ({ name, value, options: opzioniCookie(options as Record<string, unknown>, host) })));
      },
    },
  });
}

export const haCookieSessione = (nomi: string[]) => nomi.some((n) => n === COOKIE || n.startsWith(`${COOKIE}.`));

