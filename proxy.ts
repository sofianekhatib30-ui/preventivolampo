import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_LINGUA, linguaValida, percorso, togliLingua } from "@/lib/i18n/lingue";
import { ORIGINE_APP, clienteSessione, haCookieSessione, type CookieDaPosare } from "@/lib/impresa/cookie-sessione";

// Indirizzi per lingua delle pagine pubbliche (app/(sito)/[lang]):
// - italiano senza prefisso: «/prezzi» si serve internamente da «/it/prezzi», senza redirect;
// - «/it/…» non esiste come indirizzo: redirect permanente alla versione senza prefisso;
// - «/ro/…» e le altre lingue si servono così come sono, e se manca la preferenza la si ricorda;
// - chi ha scelto un'altra lingua e apre una pagina italiana va alla sua lingua (302, solo con il cookie:
//   i motori di ricerca non hanno cookie e vedono sempre la pagina chiesta).
// L'area dell'artigiano, la pagina del cliente e le API restano fuori: lì la lingua viene dal cookie.

const FUORI = ["/api", "/area", "/accedi", "/prova", "/revisione", "/accetta", "/progetto", "/apple-icon", "/icon"];
const UN_ANNO = 60 * 60 * 24 * 365;

export type Decisione = { tipo: "passa" } | { tipo: "riscrivi"; a: string } | { tipo: "redirect"; a: string; stato: 301 | 302 } | { tipo: "ricorda"; lingua: string };

export function decidi(pathname: string, cookie: string | undefined): Decisione {
  if (FUORI.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return { tipo: "passa" };
  const { lingua, resto } = togliLingua(pathname);
  // Le immagini di anteprima hanno l'indirizzo interno (/it/…/opengraph-image): si servono così.
  if (lingua === "it") return /\/opengraph-image/.test(resto) ? { tipo: "passa" } : { tipo: "redirect", a: resto, stato: 301 };
  if (lingua) return cookie ? { tipo: "passa" } : { tipo: "ricorda", lingua };
  const scelta = cookie ? linguaValida(cookie) : "it";
  if (scelta !== "it") return { tipo: "redirect", a: percorso(scelta, pathname), stato: 302 };
  return { tipo: "riscrivi", a: pathname === "/" ? "/it" : `/it${pathname}` };
}

// L'area di Preventivi vive su preventivi.kdigitalsolution.it: solo lì il browser manda il cookie della
// sessione unica di K Digital Solution. Dagli indirizzi di anteprima le pagine dell'area vanno al dominio.
const AREA = ["/area", "/api/area", "/accedi"];
export const eArea = (pathname: string) => AREA.some((p) => pathname === p || pathname.startsWith(`${p}/`));

const ANTEPRIMA = /\.vercel\.app$/i;
export function versoDominio(host: string | null, pathname: string): boolean {
  return ANTEPRIMA.test(host ?? "") && !pathname.startsWith("/api/");
}

// Il token di accesso dura un'ora: qui, prima della pagina, si rinnova se serve e si riscrive il cookie
// (le pagine possono solo leggerlo). Senza cookie di sessione non si chiama nessuno.
async function rinnovaSessione(request: NextRequest): Promise<NextResponse> {
  let res = NextResponse.next({ request });
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) return res;
  if (!haCookieSessione(request.cookies.getAll().map((c) => c.name))) return res;
  const sb = clienteSessione(
    () => request.cookies.getAll(),
    (lista: CookieDaPosare[]) => {
      lista.forEach(({ name, value }) => request.cookies.set(name, value));
      res = NextResponse.next({ request });
      lista.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
    },
    request.headers.get("host"),
  );
  try {
    await sb.auth.getClaims();
  } catch (e) {
    console.error(`[sessione] rinnovo non riuscito: ${e instanceof Error ? e.message : e}`);
  }
  return res;
}

export async function proxy(request: NextRequest) {
  const url = request.nextUrl;
  if (eArea(url.pathname)) {
    if (versoDominio(request.headers.get("host"), url.pathname)) return NextResponse.redirect(`${ORIGINE_APP}${url.pathname}${url.search}`, 302);
    return rinnovaSessione(request);
  }
  const d = decidi(url.pathname, request.cookies.get(COOKIE_LINGUA)?.value);
  if (d.tipo === "passa") return NextResponse.next();
  if (d.tipo === "redirect") {
    const a = url.clone();
    a.pathname = d.a;
    return NextResponse.redirect(a, d.stato);
  }
  if (d.tipo === "riscrivi") {
    const a = url.clone();
    a.pathname = d.a;
    return NextResponse.rewrite(a);
  }
  const res = NextResponse.next();
  res.cookies.set(COOKIE_LINGUA, d.lingua, { path: "/", maxAge: UN_ANNO, sameSite: "lax" });
  return res;
}

// Fuori: file statici, immagini, icone, robots, sitemap (tutto ciò che ha un punto nell'ultimo pezzo).
export const config = {
  matcher: ["/((?!_next/|_vercel/|.*\\.[a-zA-Z0-9]+$).*)"],
};
