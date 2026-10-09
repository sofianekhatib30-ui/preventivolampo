// Albero dei contenuti italiani delle pagine indicizzabili: la fonte delle traduzioni
// (lib/contenuti/<lingua>.json, generate da scripts/traduci-dizionario.ts contenuti).
import type { PaginaFunzione, PaginaGlossario, PaginaGuida, PaginaMestiere } from "../tipi";
import { accettazioneOnline } from "./funzioni/accettazione-online";
import { listinoPrezzi } from "./funzioni/listino-prezzi";
import { preventivoDaVocale } from "./funzioni/preventivo-da-vocale";
import { preventivoInLinguaDelCliente } from "./funzioni/preventivo-in-lingua-del-cliente";
import { glossario } from "./glossario";
import { comeFareUnPreventivo } from "./guide/come-fare-un-preventivo";
import { ivaPreventivoLavoriCasa } from "./guide/iva-preventivo-lavori-casa";
import { preventivoACorpoOAMisura } from "./guide/preventivo-a-corpo-o-a-misura";
import { preventivoClienteStraniero } from "./guide/preventivo-cliente-straniero";
import { recessoPreventivoAccettatoACasa } from "./guide/recesso-preventivo-accettato-a-casa";
import { cartongessista } from "./mestieri/cartongessista";
import { elettricista } from "./mestieri/elettricista";
import { fabbro } from "./mestieri/fabbro";
import { falegname } from "./mestieri/falegname";
import { giardiniere } from "./mestieri/giardiniere";
import { idraulico } from "./mestieri/idraulico";
import { imbianchino } from "./mestieri/imbianchino";
import { impresa } from "./mestieri/impresa";
import { muratore } from "./mestieri/muratore";
import { piastrellista } from "./mestieri/piastrellista";
import { serramentista } from "./mestieri/serramentista";
import { termoidraulico } from "./mestieri/termoidraulico";
import { pagine, ui } from "./pagine";

type Largo<T> = T extends string ? string : T extends readonly (infer U)[] ? Largo<U>[] : { [K in keyof T]: Largo<T[K]> };

export const contenutiIt = {
  mestieri: {
    elettricista,
    idraulico,
    imbianchino,
    piastrellista,
    muratore,
    impresa,
    termoidraulico,
    cartongessista,
    serramentista,
    falegname,
    fabbro,
    giardiniere,
  } satisfies Record<string, PaginaMestiere>,
  funzioni: {
    "preventivo-da-vocale": preventivoDaVocale,
    "preventivo-in-lingua-del-cliente": preventivoInLinguaDelCliente,
    "accettazione-online": accettazioneOnline,
    "listino-prezzi": listinoPrezzi,
  } satisfies Record<string, PaginaFunzione>,
  guide: {
    "come-fare-un-preventivo": comeFareUnPreventivo,
    "preventivo-a-corpo-o-a-misura": preventivoACorpoOAMisura,
    "iva-preventivo-lavori-casa": ivaPreventivoLavoriCasa,
    "preventivo-cliente-straniero": preventivoClienteStraniero,
    "recesso-preventivo-accettato-a-casa": recessoPreventivoAccettatoACasa,
  } satisfies Record<string, PaginaGuida>,
  glossario: glossario satisfies PaginaGlossario,
  pagine,
  ui,
};

export type Contenuti = Largo<typeof contenutiIt>;
