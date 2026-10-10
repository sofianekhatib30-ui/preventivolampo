-- Preventivi (ex PreventivoLampo) agganciato al nucleo KDS. 10/10/2026.
-- Le tabelle pl_* restano dove sono (regola 12 del nucleo): si aggiunge il legame con
-- l'organizzazione, il cliente in anagrafica e il regime IVA dell'impresa.
-- L'accesso non passa piu' da pl_membri: chi entra e' chi e' membro dell'organizzazione
-- con il modulo 'preventivi' (privato.org_lettura / org_scrittura).

-- 1. Un'impresa per organizzazione.
create unique index if not exists pl_imprese_org_unica on public.pl_imprese (org_id) where org_id is not null;

-- 2. Regime IVA dell'impresa: 'edile' = regole dell'IVA edile (domande su abitazione, intervento,
--    beni significativi); 'ordinario' = aliquota fissa dell'impresa (iva_predefinita), nessuna domanda.
alter table public.pl_imprese add column if not exists regime_iva text not null default 'edile';
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'pl_imprese_regime_iva_check') then
    alter table public.pl_imprese add constraint pl_imprese_regime_iva_check check (regime_iva in ('edile', 'ordinario'));
  end if;
end $$;

-- 3. Il cliente del preventivo nell'anagrafica unica.
alter table public.pl_preventivi add column if not exists contatto_id uuid references nucleo.contatti(id) on delete set null;
create index if not exists pl_preventivi_contatto_idx on public.pl_preventivi (contatto_id) where contatto_id is not null;

-- 4. Chi sono e cosa posso fare, letto con il token della persona (non con la chiave di servizio):
--    organizzazione attiva, ruolo, lettura/scrittura del modulo, impresa collegata.
create or replace function preventivi.mia_impresa()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_org uuid;
  v_ruolo text;
  v_imp uuid;
begin
  if v_uid is null then return null; end if;
  select p.org_attiva_id into v_org from nucleo.profili p where p.id = v_uid;
  -- l'organizzazione attiva deve essere una delle mie; altrimenti la prima in cui ho il modulo
  if v_org is null or v_org not in (select privato.mie_org()) then
    select l.o into v_org from privato.org_lettura('preventivi') as l(o) limit 1;
  end if;
  if v_org is null then
    return jsonb_build_object('utente', v_uid, 'org_id', null);
  end if;
  select m.ruolo::text into v_ruolo from nucleo.membri m where m.org_id = v_org and m.utente_id = v_uid and m.stato = 'attivo';
  select i.id into v_imp from public.pl_imprese i where i.org_id = v_org;
  return jsonb_build_object(
    'utente', v_uid,
    'org_id', v_org,
    'org_nome', (select o.nome from nucleo.organizzazioni o where o.id = v_org),
    'org_piva', (select o.partita_iva from nucleo.organizzazioni o where o.id = v_org),
    'ruolo', v_ruolo,
    'lettura', v_org in (select privato.org_lettura('preventivi')),
    'scrittura', v_org in (select privato.org_scrittura('preventivi')),
    'stato_modulo', privato.stato_modulo(v_org, 'preventivi'),
    'impresa_id', v_imp
  );
end $$;
revoke execute on function preventivi.mia_impresa() from public, anon;
grant execute on function preventivi.mia_impresa() to authenticated, naivy_cliente;

-- 5. Il cliente di un preventivo entra in anagrafica (o si ritrova, per nome, nella stessa
--    organizzazione). Solo dal server dell'app, con la chiave di servizio.
create or replace function preventivi.collega_cliente(p_preventivo text)
returns uuid language plpgsql volatile security definer set search_path = '' as $$
declare
  v_org uuid; v_nome text; v_ind text; v_cont uuid; v_imp uuid;
begin
  select i.org_id, p.impresa_id, nullif(btrim(coalesce(p.documento #>> '{cliente,name}', p.cliente_nome, '')), ''),
         nullif(btrim(coalesce(p.documento #>> '{cliente,address}', '')), ''), p.contatto_id
    into v_org, v_imp, v_nome, v_ind, v_cont
    from public.pl_preventivi p join public.pl_imprese i on i.id = p.impresa_id
   where p.id = p_preventivo;
  if v_org is null or v_nome is null then return v_cont; end if;
  if v_cont is null then
    select c.id into v_cont from nucleo.contatti c
     where c.org_id = v_org and c.eliminato_il is null and c.unito_in is null
       and lower(c.nome_visualizzato) = lower(v_nome)
     order by c.creato_il limit 1;
  end if;
  if v_cont is null then
    insert into nucleo.contatti (org_id, tipo, denominazione, indirizzo, fonte)
    values (v_org, 'persona', left(v_nome, 160),
            case when v_ind is null then '{}'::jsonb else jsonb_build_object('testo', left(v_ind, 200)) end,
            'preventivi')
    returning id into v_cont;
  end if;
  update public.pl_preventivi set contatto_id = v_cont where id = p_preventivo and contatto_id is distinct from v_cont;
  return v_cont;
end $$;
revoke execute on function preventivi.collega_cliente(text) from public, anon, authenticated, naivy_cliente;
grant execute on function preventivi.collega_cliente(text) to service_role;

-- 6. Per la scheda cliente nell'account: i preventivi di un contatto, letti con il token della persona.
create or replace function preventivi.di_contatto(p_contatto uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(jsonb_build_object(
           'id', p.id, 'numero', p.numero, 'stato', p.stato, 'totale_cents', p.totale_cents,
           'creato_il', p.creato_il) order by p.creato_il desc), '[]'::jsonb)
    from public.pl_preventivi p
    join public.pl_imprese i on i.id = p.impresa_id
    join nucleo.contatti c on c.id = p_contatto
   where p.contatto_id = p_contatto
     and i.org_id = c.org_id
     and c.org_id in (select privato.org_lettura('preventivi'));
$$;
revoke execute on function preventivi.di_contatto(uuid) from public, anon;
grant execute on function preventivi.di_contatto(uuid) to authenticated, naivy_cliente;

-- 7. Dogfooding: l'impresa di prova di Sofiane va sull'organizzazione dello studio.
update public.pl_imprese set org_id = 'fade2949-658a-4076-9df5-2cc3c0508b34'
 where ragione_sociale = 'Edil Prova srl' and org_id is null
   and not exists (select 1 from public.pl_imprese x where x.org_id = 'fade2949-658a-4076-9df5-2cc3c0508b34');

-- 8. Catalogo: il modulo si apre dal nuovo indirizzo.
update nucleo.moduli set nome = 'Preventivi', url_app = 'https://preventivi.kdigitalsolution.it/area' where id = 'preventivi';
