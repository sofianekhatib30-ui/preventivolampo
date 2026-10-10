-- Correzioni dopo la verifica di sicurezza del 10/10/2026 (Preventivi nel nucleo e anagrafica).

-- 1. preventivi.mia_impresa: la scelta di riserva dell'organizzazione è stabile (prima un limit 1 senza ordine).
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
  if v_org is null or v_org not in (select privato.mie_org()) then
    select l.o into v_org from privato.org_lettura('preventivi') as l(o)
      join nucleo.organizzazioni o on o.id = l.o order by o.creato_il, o.id limit 1;
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

-- 2. preventivi.collega_cliente com'è sul database dal 10/10 sera: l'indirizzo detto nel vocale va nel campo «via».
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
            case when v_ind is null then '{}'::jsonb else jsonb_build_object('via', left(v_ind, 200), 'paese', 'IT') end,
            'preventivi')
    returning id into v_cont;
  end if;
  update public.pl_preventivi set contatto_id = v_cont where id = p_preventivo and contatto_id is distinct from v_cont;
  return v_cont;
end $$;
revoke execute on function preventivi.collega_cliente(text) from public, anon, authenticated, naivy_cliente;
grant execute on function preventivi.collega_cliente(text) to service_role;

-- 3. Gli indirizzi che la barra comune apre (url degli strumenti e delle notifiche) sono solo https:
--    un «javascript:» scritto in una riga non diventa mai un link eseguibile.
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'moduli_url_app_https') then
    alter table nucleo.moduli add constraint moduli_url_app_https check (url_app is null or url_app ~ '^https://');
  end if;
  if not exists (select 1 from pg_constraint where conname = 'notifiche_url_https') then
    alter table nucleo.notifiche add constraint notifiche_url_https check (url is null or url ~ '^(https://|/[^/\\])');
  end if;
end $$;

-- 4. L'autore di una nota è chi la scrive, non quello che dice il browser.
create or replace function privato.autore_nota()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is not null then
    if tg_op = 'INSERT' then new.autore_id := auth.uid();
    else new.autore_id := old.autore_id;
    end if;
  end if;
  return new;
end $$;
create or replace trigger note_autore before insert or update on nucleo.note
  for each row execute function privato.autore_nota();
