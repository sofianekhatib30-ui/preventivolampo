import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_LINGUA, linguaValida, percorso, togliLingua } from "@/lib/i18n/lingue";

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

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
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
