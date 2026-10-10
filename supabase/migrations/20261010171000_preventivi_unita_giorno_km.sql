-- Preventivi per tutti i mestieri (10/10/2026): due unità in più, giornate e chilometri
-- (noleggi, trasferte, servizi a giornata). Le altre restano quelle di prima.
alter table public.pl_voci drop constraint if exists pl_voci_unita_check;
alter table public.pl_voci add constraint pl_voci_unita_check check (unita in ('m2', 'm', 'm3', 'cad', 'h', '100kg', 'kg', 'l', 'corpo', 'giorno', 'km'));
