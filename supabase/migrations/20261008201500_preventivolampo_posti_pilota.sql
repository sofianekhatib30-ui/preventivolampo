-- Programma pilota: 10 posti. Un'impresa occupa un posto solo quando Sofiane la accetta nel pilota
-- (pilota_dal valorizzato a mano), non quando si registra: le registrazioni di prova non contano.
-- La home mostra «posti liberi» = 10 meno le imprese con pilota_dal non nullo.
alter table public.pl_imprese add column if not exists pilota_dal timestamptz;

comment on column public.pl_imprese.pilota_dal is
  'Data di ingresso nel programma pilota (null = non nel pilota). Si imposta a mano quando l''artigiano viene accettato.';
