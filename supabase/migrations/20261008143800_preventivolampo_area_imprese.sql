-- PreventivoLampo: area imprese. Accesso solo dal server (service_role); RLS attiva senza policy.
create table public.pl_imprese (
  id uuid primary key default gen_random_uuid(),
  ragione_sociale text not null check (length(ragione_sociale) between 2 and 160),
  piva text check (piva is null or piva ~ '^[0-9]{11}$'),
  cf text,
  indirizzo text,
  telefono text,
  email text,
  iban text,
  condizioni_pagamento text,
  validita_giorni int not null default 30 check (validita_giorni between 1 and 365),
  iva_predefinita int not null default 10 check (iva_predefinita in (4, 10, 22)),
  mestieri text[] not null default '{}',
  logo_path text,
  anno_numerazione int not null default extract(year from now())::int,
  numero_prossimo int not null default 1 check (numero_prossimo >= 1),
  stato text not null default 'prova' check (stato in ('prova', 'attiva', 'sospesa')),
  creata_il timestamptz not null default now(),
  aggiornata_il timestamptz not null default now()
);

create table public.pl_membri (
  impresa_id uuid not null references public.pl_imprese(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  ruolo text not null default 'titolare' check (ruolo in ('titolare', 'collaboratore')),
  creato_il timestamptz not null default now(),
  primary key (impresa_id, user_id)
);

create table public.pl_voci (
  id uuid primary key default gen_random_uuid(),
  impresa_id uuid not null references public.pl_imprese(id) on delete cascade,
  codice text not null check (codice ~ '^[A-Za-z0-9][A-Za-z0-9._/-]{0,23}$'),
  nome text not null check (length(nome) between 2 and 200),
  descrizione text,
  unita text not null check (unita in ('m2', 'm', 'm3', 'cad', 'h', '100kg', 'kg', 'l', 'corpo')),
  prezzo_cents int not null check (prezzo_cents >= 0 and prezzo_cents <= 100000000),
  categoria text,
  sinonimi text[] not null default '{}',
  bene_significativo boolean not null default false,
  fornibile_dal_cliente boolean not null default false,
  origine text not null default 'manuale' check (origine in ('manuale', 'import', 'appreso', 'demo')),
  attiva boolean not null default true,
  creata_il timestamptz not null default now(),
  aggiornata_il timestamptz not null default now(),
  unique (impresa_id, codice)
);
create index pl_voci_impresa_idx on public.pl_voci (impresa_id) where attiva;

create table public.pl_import (
  id uuid primary key default gen_random_uuid(),
  impresa_id uuid not null references public.pl_imprese(id) on delete cascade,
  nome_file text,
  mappatura jsonb,
  righe jsonb not null default '[]',
  stato text not null default 'da_rivedere' check (stato in ('da_rivedere', 'importato', 'annullato')),
  creato_il timestamptz not null default now()
);
create index pl_import_impresa_idx on public.pl_import (impresa_id);

create table public.pl_preventivi (
  id text primary key check (length(id) between 16 and 40),
  impresa_id uuid not null references public.pl_imprese(id) on delete cascade,
  numero text not null,
  stato text not null check (stato in ('bozza', 'approvato', 'accettato', 'rifiutato')),
  documento jsonb not null,
  token_accettazione text unique,
  cliente_nome text,
  totale_cents bigint not null default 0,
  creato_il timestamptz not null default now(),
  aggiornato_il timestamptz not null default now(),
  unique (impresa_id, numero)
);
create index pl_preventivi_impresa_idx on public.pl_preventivi (impresa_id, creato_il desc);

create table public.pl_eventi (
  id bigint generated always as identity primary key,
  impresa_id uuid not null references public.pl_imprese(id) on delete cascade,
  preventivo_id text references public.pl_preventivi(id) on delete cascade,
  tipo text not null,
  dati jsonb not null default '{}',
  il timestamptz not null default now()
);
create index pl_eventi_impresa_idx on public.pl_eventi (impresa_id, il desc);
create index pl_eventi_preventivo_idx on public.pl_eventi (preventivo_id);

create table public.pl_da_prezzare (
  id uuid primary key default gen_random_uuid(),
  impresa_id uuid not null references public.pl_imprese(id) on delete cascade,
  preventivo_id text references public.pl_preventivi(id) on delete set null,
  nome text not null,
  unita text,
  prezzo_cents int check (prezzo_cents is null or prezzo_cents >= 0),
  stato text not null default 'aperta' check (stato in ('aperta', 'aggiunta', 'scartata')),
  creata_il timestamptz not null default now()
);
create index pl_da_prezzare_impresa_idx on public.pl_da_prezzare (impresa_id, stato);
create index pl_da_prezzare_preventivo_idx on public.pl_da_prezzare (preventivo_id);

-- RLS attiva e nessuna policy: dal browser non si legge né si scrive nulla.
alter table public.pl_imprese enable row level security;
alter table public.pl_membri enable row level security;
alter table public.pl_voci enable row level security;
alter table public.pl_import enable row level security;
alter table public.pl_preventivi enable row level security;
alter table public.pl_eventi enable row level security;
alter table public.pl_da_prezzare enable row level security;
revoke all on public.pl_imprese, public.pl_membri, public.pl_voci, public.pl_import,
  public.pl_preventivi, public.pl_eventi, public.pl_da_prezzare from anon, authenticated;
revoke all on sequence public.pl_eventi_id_seq from anon, authenticated;

-- Numerazione atomica per impresa, azzerata a ogni anno nuovo: 2026-001, 2026-002, ...
create or replace function public.pl_prossimo_numero(p_impresa uuid)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  anno_ora int := extract(year from now() at time zone 'Europe/Rome')::int;
  n int;
begin
  update public.pl_imprese
     set numero_prossimo = case when anno_numerazione = anno_ora then numero_prossimo + 1 else 2 end,
         anno_numerazione = anno_ora
   where id = p_impresa
  returning numero_prossimo - 1 into n;
  if n is null then
    raise exception 'impresa inesistente';
  end if;
  return anno_ora::text || '-' || lpad(n::text, 3, '0');
end;
$$;
revoke all on function public.pl_prossimo_numero(uuid) from public, anon, authenticated;
grant execute on function public.pl_prossimo_numero(uuid) to service_role;

-- Loghi delle imprese: bucket privato, letto solo dal server.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('preventivolampo', 'preventivolampo', false, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
