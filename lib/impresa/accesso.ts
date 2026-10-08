import { z } from "zod";
import { Rifiuto } from "@/lib/preventivi/rifiuto";
import { db, pubblico } from "./db";

// Accesso senza password: l'artigiano scrive la sua email e riceve un codice di 6 cifre.
// L'utente si crea dal server (conferma già fatta: il codice dimostra che l'email è sua).

export const Email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email())
  .refine((e) => e.length <= 160);

export function emailValida(dato: unknown): string {
  const r = Email.safeParse(dato);
  if (!r.success) throw new Rifiuto("Scrivi un indirizzo email valido.", 400);
  return r.data;
}

export async function inviaCodice(dato: unknown): Promise<string> {
  const email = emailValida(dato);
  const creato = await db().auth.admin.createUser({ email, email_confirm: true, app_metadata: { app: "preventivolampo" } });
  if (creato.error && creato.error.code !== "email_exists" && !/already/i.test(creato.error.message)) {
    throw new Error(`creazione utente: ${creato.error.message}`);
  }
  const { error } = await pubblico().auth.signInWithOtp({ email, options: { shouldCreateUser: false } });
  if (error) {
    if (error.status === 429 || /rate|seconds/i.test(error.message)) throw new Rifiuto("Hai appena chiesto un codice: aspetta un minuto e riprova.", 429);
    throw new Error(`invio codice: ${error.message}`);
  }
  return email;
}

export async function verificaCodice(datoEmail: unknown, datoCodice: unknown): Promise<{ userId: string; email: string }> {
  const email = emailValida(datoEmail);
  const codice = typeof datoCodice === "string" ? datoCodice.replace(/\s/g, "") : "";
  if (!/^\d{6,8}$/.test(codice)) throw new Rifiuto("Il codice è di 6 cifre: controlla l'email.", 400);
  const { data, error } = await pubblico().auth.verifyOtp({ email, token: codice, type: "email" });
  if (error || !data.user) throw new Rifiuto("Codice sbagliato o scaduto. Chiedine uno nuovo.", 401);
  // La sessione di Supabase non serve: la chiudo subito, resta solo il cookie dell'area.
  if (data.session) await db().auth.admin.signOut(data.session.access_token).catch(() => {});
  return { userId: data.user.id, email };
}
