-- Preventivi: il fisco per lavoro e per riga (10/10/2026 sera, ricerca IVA e mestieri).
-- 1. Unità nuove: persona, intervento, mese, anno, pagina, copia, t, viaggio, ha, capo, kWp, kW, servizio.
-- 2. Aliquota propria di una voce di listino (null = la decide il preventivo: edilizia o mestiere).
-- 3. Profilo fiscale dell'impresa: regime (ordinario o forfettario), ritenuta d'acconto, rivalsa INPS.
--    regime_iva (edile/ordinario) resta per i preventivi di prima ma non decide più niente.
alter table public.pl_voci drop constraint if exists pl_voci_unita_check;
alter table public.pl_voci add constraint pl_voci_unita_check check (unita = any (array[
  'm2','m','m3','cad','h','100kg','kg','l','corpo','giorno','km',
  'persona','intervento','mese','anno','pagina','copia','t','viaggio','ha','capo','kWp','kW','servizio']));

alter table public.pl_voci add column if not exists aliquota text;
alter table public.pl_voci drop constraint if exists pl_voci_aliquota_check;
alter table public.pl_voci add constraint pl_voci_aliquota_check check (aliquota is null or aliquota = any (array['22','10','4','esente']));

alter table public.pl_imprese add column if not exists regime_fiscale text not null default 'ordinario';
alter table public.pl_imprese drop constraint if exists pl_imprese_regime_fiscale_check;
alter table public.pl_imprese add constraint pl_imprese_regime_fiscale_check check (regime_fiscale = any (array['ordinario','forfettario']));
alter table public.pl_imprese add column if not exists ritenuta boolean not null default false;
alter table public.pl_imprese add column if not exists rivalsa_inps boolean not null default false;
