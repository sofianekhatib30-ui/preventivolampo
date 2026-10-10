import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import { configurato } from "./db";
import { ACCOUNT, clienteSessione, haCookieSessione } from "./cookie-sessione";

// Sessione dell'area: dal 10/10/2026 Preventivi è un modulo di K Digital Solution e usa
// l'account unico. La sessione è il cookie condiviso `kds-sessione` sul dominio
// .kdigitalsolution.it (formato di @supabase/ssr), scritto dall'account e letto da tutti
// gli strumenti. Chi entra, e con quale impresa, lo decide il nucleo: membro attivo
// dell'organizzazione con il modulo «preventivi» (funzione preventivi.mia_impresa).
// Il token lo rinnova proxy.ts, che può scrivere i cookie; qui si legge soltanto.

export { ACCOUNT, COOKIE, DOMINIO, ORIGINE_APP, clienteSessione, dominioCookie, haCookieSessione, opzioniCookie } from "./cookie-sessione";
export type { CookieDaPosare } from "./cookie-sessione";

export type Sessione = { userId: string; email: string; token: string };

// Chi è collegato. getUser() chiede al server di Supabase se la sessione è ancora valida
// (una sessione chiusa altrove, per esempio con «Esci» dall'account, qui non vale più).
export const sessione = cache(async (): Promise<Sessione | null> => {
  if (!configurato()) return null;
  const jar = await cookies();
  if (!haCookieSessione(jar.getAll().map((c) => c.name))) return null;
  const sb = clienteSessione(() => jar.getAll(), null, (await headers()).get("host"));
  const { data: u } = await sb.auth.getUser();
  if (!u.user) return null;
  const { data: s } = await sb.auth.getSession();
  if (!s.session) return null;
  return { userId: u.user.id, email: u.user.email ?? "", token: s.session.access_token };
});

export type Contesto = {
  sessione: Sessione;
  orgId: string | null;
  orgNome: string | null;
  orgPiva: string | null;
  ruoloOrg: string | null;
  lettura: boolean;
  scrittura: boolean;
  statoModulo: string | null;
  impresaId: string | null;
};

// Organizzazione attiva, permessi sul modulo e impresa collegata: li dice il nucleo, con il token della persona.
export const contesto = cache(async (): Promise<Contesto | null> => {
  const s = await sessione();
  if (!s) return null;
  const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${s.token}` } },
  });
  const { data, error } = await sb.schema("preventivi").rpc("mia_impresa");
  if (error) throw new Error(`contesto: ${error.message}`);
  return contestoDa(s, data);
});

export function contestoDa(s: Sessione, data: unknown): Contesto {
  const d = (data && typeof data === "object" ? data : {}) as Record<string, unknown>;
  const testo = (v: unknown) => (typeof v === "string" && v ? v : null);
  return {
    sessione: s,
    orgId: testo(d.org_id),
    orgNome: testo(d.org_nome),
    orgPiva: testo(d.org_piva),
    ruoloOrg: testo(d.ruolo),
    lettura: d.lettura === true,
    scrittura: d.scrittura === true,
    statoModulo: testo(d.stato_modulo),
    impresaId: testo(d.impresa_id),
  };
}

export type Membro = {
  sessione: Sessione;
  impresaId: string;
  orgId: string;
  // titolare e admin dell'organizzazione cambiano i dati dell'impresa; gli altri membri no.
  ruolo: "titolare" | "collaboratore";
  // false con il modulo sospeso o scaduto: si legge ma non si scrive.
  scrittura: boolean;
};

export function membroDa(c: Contesto | null): Membro | null {
  if (!c || !c.orgId || !c.impresaId || !c.lettura) return null;
  return {
    sessione: c.sessione,
    impresaId: c.impresaId,
    orgId: c.orgId,
    ruolo: c.ruoloOrg === "titolare" || c.ruoloOrg === "admin" ? "titolare" : "collaboratore",
    scrittura: c.scrittura,
  };
}

// Chi è collegato e di quale impresa fa parte. null se non è collegato, non ha il modulo o non ha ancora un'impresa.
export async function membro(): Promise<Membro | null> {
  return membroDa(await contesto());
}

// Dove si accede e dove si esce: la pagina unica dell'account.
export function urlAccesso(torna: string): string {
  return `${ACCOUNT}/accedi?torna=${encodeURIComponent(torna)}`;
}
export const URL_USCITA = `${ACCOUNT}/esci`;

// Le richieste che cambiano dati arrivano solo dalle pagine del sito (oltre al cookie SameSite=Lax).
export function stessaOrigine(request: Request): boolean {
  const origine = request.headers.get("origin");
  if (!origine) return request.headers.get("sec-fetch-site") !== "cross-site";
  try {
    return new URL(origine).host === new URL(request.url).host || new URL(origine).host === request.headers.get("host");
  } catch {
    return false;
  }
}
