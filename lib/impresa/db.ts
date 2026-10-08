import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Area imprese: i dati stanno su Supabase (tabelle pl_*). RLS chiusa e nessun permesso al browser:
// si passa solo dal server, con la chiave di servizio, e ogni query è filtrata per impresa.

export function configurato(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

let admin: SupabaseClient | null = null;
export function db(): SupabaseClient {
  if (!configurato()) throw new Error("Supabase non configurato (SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY)");
  admin ??= createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return admin;
}

// Client con la chiave pubblicabile: serve solo per mandare e verificare il codice via email.
export function pubblico(): SupabaseClient {
  if (!configurato()) throw new Error("Supabase non configurato");
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

// Errore del database → eccezione; il dettaglio resta nel log del server.
export function ok<T>(r: { data: T; error: { message: string } | null }, cosa: string): T {
  if (r.error) throw new Error(`${cosa}: ${r.error.message}`);
  return r.data;
}
