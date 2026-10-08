-- L'id dell'utente dalla sua email: serve al server di PreventivoLampo per marcare l'email
-- del codice (firma PreventivoLampo invece di K Digital Solution). Solo service_role.
create or replace function public.pl_utente_da_email(p_email text)
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select u.id from auth.users u where lower(u.email) = lower(p_email) limit 1;
$$;
revoke all on function public.pl_utente_da_email(text) from public, anon, authenticated;
grant execute on function public.pl_utente_da_email(text) to service_role;
