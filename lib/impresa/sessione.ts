import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { db, ok } from "./db";

// Sessione dell'area imprese: un cookie httpOnly firmato dal server (id utente, email, scadenza).
// Il browser non riceve mai i token di Supabase: tutto passa dal server.

export const COOKIE = "pl_sessione";
const DURATA_S = 30 * 24 * 3600;

export type Sessione = { userId: string; email: string; scade: number };

function chiave(): Buffer {
  const base = process.env.SESSIONE_SEGRETO || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base) throw new Error("Manca la chiave per firmare le sessioni");
  return createHmac("sha256", base).update("preventivolampo:sessione:v1").digest();
}

const firma = (dati: string) => createHmac("sha256", chiave()).update(dati).digest("base64url");

export function creaToken(userId: string, email: string, adesso = Date.now()): string {
  const dati = Buffer.from(JSON.stringify({ u: userId, e: email, x: Math.floor(adesso / 1000) + DURATA_S })).toString("base64url");
  return `${dati}.${firma(dati)}`;
}

export function leggiToken(token: string | undefined, adesso = Date.now()): Sessione | null {
  if (!token || token.length > 1000) return null;
  const [dati, f] = token.split(".");
  if (!dati || !f) return null;
  const atteso = Buffer.from(firma(dati));
  const dato = Buffer.from(f);
  if (atteso.length !== dato.length || !timingSafeEqual(atteso, dato)) return null;
  try {
    const j = JSON.parse(Buffer.from(dati, "base64url").toString("utf8")) as { u?: unknown; e?: unknown; x?: unknown };
    if (typeof j.u !== "string" || typeof j.e !== "string" || typeof j.x !== "number") return null;
    if (j.x * 1000 < adesso) return null;
    return { userId: j.u, email: j.e, scade: j.x };
  } catch {
    return null;
  }
}

export async function apriSessione(userId: string, email: string): Promise<void> {
  (await cookies()).set(COOKIE, creaToken(userId, email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURATA_S,
  });
}

export async function chiudiSessione(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function sessione(): Promise<Sessione | null> {
  return leggiToken((await cookies()).get(COOKIE)?.value);
}

export type Membro = { sessione: Sessione; impresaId: string; ruolo: "titolare" | "collaboratore" };

// Chi è collegato e di quale impresa fa parte. null se non è collegato o non ha ancora un'impresa.
export async function membro(): Promise<Membro | null> {
  const s = await sessione();
  if (!s) return null;
  const r = ok(await db().from("pl_membri").select("impresa_id, ruolo").eq("user_id", s.userId).maybeSingle(), "membro");
  return r ? { sessione: s, impresaId: r.impresa_id as string, ruolo: r.ruolo as Membro["ruolo"] } : null;
}

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
