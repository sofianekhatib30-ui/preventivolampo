-- Candidature al programma pilota dalla home. Prima finivano su un file locale, che su Vercel
-- non sopravvive: ora stanno qui. Come le altre pl_*: RLS attiva senza policy, niente permessi
-- ad anon/authenticated, scrive e legge solo il server con la chiave di servizio.
create table if not exists public.pl_candidature (
  id uuid primary key default gen_random_uuid(),
  ricevuta_il timestamptz not null default now(),
  nome text not null check (char_length(nome) between 1 and 100),
  mestiere text not null check (char_length(mestiere) between 1 and 60),
  comune text not null check (char_length(comune) between 1 and 80),
  telefono text not null check (telefono ~ '^\+393[0-9]{8,9}$'),
  volume text check (volume is null or char_length(volume) <= 20),
  stato text not null default 'nuova' check (stato in ('nuova', 'richiamata', 'accettata', 'scartata'))
);

alter table public.pl_candidature enable row level security;
revoke all on public.pl_candidature from anon, authenticated;
grant select, insert, update, delete on public.pl_candidature to service_role;
