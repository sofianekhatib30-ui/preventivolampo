-- In questo progetto le tabelle nuove non danno permessi a nessuno: il server (service_role) li riceve qui.
grant select, insert, update, delete on public.pl_imprese, public.pl_membri, public.pl_voci, public.pl_import,
  public.pl_preventivi, public.pl_eventi, public.pl_da_prezzare to service_role;
grant usage, select on sequence public.pl_eventi_id_seq to service_role;
