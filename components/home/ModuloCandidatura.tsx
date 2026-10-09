"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Ricco } from "@/components/Ricco";
import { useLingua } from "@/lib/i18n/client";
import { fmt } from "@/lib/i18n/testo";
import {
  FIELD_ORDER,
  formDataToInput,
  HONEYPOT_FIELD,
  MAX_LENGTH,
  STARTED_AT_FIELD,
  TRADES,
  validateCandidatura,
  WEEKLY_VOLUMES,
  type CandidaturaField,
  type FieldErrors,
} from "@/lib/candidatura/schema";

// Modulo di candidatura. Senza JavaScript è un form HTML che fa POST a /api/candidatura
// e riceve una pagina; con JavaScript valida con lo stesso schema del server e invia
// senza ricaricare.

const ID: Record<CandidaturaField, string> = {
  nome: "c-nome",
  mestiere: "c-mestiere",
  comune: "c-comune",
  telefono: "c-tel",
  volume: "c-volume",
  privacy: "c-privacy",
};

const campo =
  "h-[50px] w-full rounded-campo border-[1.5px] border-campo bg-superficie px-3.5 text-base text-inchiostro lg:h-[52px] lg:px-4 lg:text-[17px] aria-[invalid=true]:border-2 aria-[invalid=true]:border-inchiostro";
const etichetta = "text-sm font-bold lg:text-[15px]";

type Stato =
  | { tipo: "compilazione" }
  | { tipo: "invio" }
  | { tipo: "inviata"; nome: string };

export function ModuloCandidatura() {
  const { lingua, d } = useLingua();
  const T = d.candidatura.modulo;
  // Gli errori dei campi arrivano in italiano dallo schema condiviso: nelle altre lingue si mostra il testo del campo.
  const msg = (f: CandidaturaField, testo?: string) => (testo ? (lingua === "it" ? testo : T.errori[f]) : undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);
  const confermaRef = useRef<HTMLParagraphElement>(null);
  const [stato, setStato] = useState<Stato>({ tipo: "compilazione" });
  const [errori, setErrori] = useState<FieldErrors>({});
  const [erroreGenerale, setErroreGenerale] = useState<string | null>(null);

  useEffect(() => {
    // Con JavaScript la validazione la fa lo schema condiviso, con messaggi accessibili.
    if (formRef.current) formRef.current.noValidate = true;
    // Momento di inizio compilazione, per il tempo minimo controllato dal server.
    if (startedRef.current) startedRef.current.value = String(Date.now());
  }, []);

  useEffect(() => {
    if (stato.tipo === "inviata") confermaRef.current?.focus();
  }, [stato]);

  function mostraErrori(nuovi: FieldErrors) {
    setErrori(nuovi);
    const primo = FIELD_ORDER.find((f) => nuovi[f]);
    if (primo) document.getElementById(ID[primo])?.focus();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stato.tipo === "invio") return;
    setErroreGenerale(null);
    const form = event.currentTarget;
    const data = new FormData(form);

    const locale = validateCandidatura(formDataToInput(data));
    if (!locale.ok) {
      mostraErrori(locale.errors);
      return;
    }
    setErrori({});
    setStato({ tipo: "invio" });

    try {
      const risposta = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      const corpo: unknown = await risposta.json().catch(() => null);
      if (risposta.ok && isRecord(corpo) && corpo.ok === true) {
        setStato({ tipo: "inviata", nome: typeof corpo.nome === "string" ? corpo.nome : "" });
        return;
      }
      setStato({ tipo: "compilazione" });
      if (isRecord(corpo) && isRecord(corpo.errori)) {
        mostraErrori(corpo.errori as FieldErrors);
      } else {
        setErroreGenerale(
          isRecord(corpo) && typeof corpo.messaggio === "string" && lingua === "it" ? corpo.messaggio : T.errore,
        );
      }
    } catch {
      setStato({ tipo: "compilazione" });
      setErroreGenerale(T.errore);
    }
  }

  function pulisci(field: CandidaturaField) {
    if (errori[field]) setErrori((prev) => ({ ...prev, [field]: undefined }));
  }

  const riquadro =
    "flex flex-col gap-3.5 rounded-[20px] border-2 border-inchiostro bg-superficie p-5 lg:gap-[18px] lg:rounded-card lg:p-9";

  if (stato.tipo === "inviata") {
    return (
      <div className={riquadro}>
        <p
          ref={confermaRef}
          tabIndex={-1}
          role="status"
          className="m-0 text-2xl font-extrabold leading-tight [font-stretch:80%] lg:text-[28px]"
        >
          {fmt(T.conferma, { nome: stato.nome })}
        </p>
      </div>
    );
  }

  const invio = stato.tipo === "invio";
  const attr = (field: CandidaturaField) => ({
    id: ID[field],
    name: field,
    "aria-invalid": errori[field] ? true : undefined,
    "aria-describedby": errori[field] ? `${ID[field]}-errore` : undefined,
    onChange: () => pulisci(field),
  });

  return (
    <form
      ref={formRef}
      action="/api/candidatura"
      method="post"
      aria-label={T.etichetta}
      onSubmit={onSubmit}
      className={riquadro}
    >
      <Campo field="nome" label={T.nome} errore={msg("nome", errori.nome)}>
        <input
          {...attr("nome")}
          type="text"
          autoComplete="name"
          required
          maxLength={MAX_LENGTH.name}
          className={campo}
        />
      </Campo>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Campo field="mestiere" label={T.mestiere} errore={msg("mestiere", errori.mestiere)}>
          <select {...attr("mestiere")} required defaultValue="" className={`${campo} px-2.5 lg:px-3`}>
            <option value="">{T.scegli}</option>
            {TRADES.map((m) => (
              <option key={m} value={m}>
                {T.mestieri[m] ?? m}
              </option>
            ))}
          </select>
        </Campo>
        <Campo field="comune" label={T.comune} errore={msg("comune", errori.comune)}>
          <input
            {...attr("comune")}
            type="text"
            autoComplete="address-level2"
            required
            maxLength={MAX_LENGTH.town}
            className={campo}
          />
        </Campo>
      </div>
      <div className="grid gap-3.5 sm:grid-cols-2">
        <Campo field="telefono" label={T.cellulare} errore={msg("telefono", errori.telefono)}>
          <input
            {...attr("telefono")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            required
            maxLength={MAX_LENGTH.phone}
            className={campo}
          />
        </Campo>
        <Campo field="volume" label={T.volume} errore={msg("volume", errori.volume)}>
          <select {...attr("volume")} defaultValue="" className={`${campo} px-2.5 lg:px-3`}>
            <option value="">{T.scegli}</option>
            {WEEKLY_VOLUMES.map((v) => (
              <option key={v} value={v}>
                {T.volumi[v] ?? v}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2.5 lg:gap-3">
          <input
            {...attr("privacy")}
            type="checkbox"
            required
            className="mt-px size-[22px] shrink-0 accent-inchiostro lg:mt-0.5"
          />
          <label htmlFor={ID.privacy} className="text-sm leading-[1.45] text-testo-2 lg:text-[15px]">
            <Ricco testo={T.privacy} lingua={lingua} />
          </label>
        </div>
        <Errore field="privacy" testo={msg("privacy", errori.privacy)} />
      </div>

      {/* Difese: campo esca invisibile alle persone e momento di inizio compilazione */}
      <div aria-hidden="true" className="pointer-events-none absolute start-0 top-0 h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]">
        <label htmlFor="c-sito-web">Lascia vuoto questo campo</label>
        <input id="c-sito-web" type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </div>
      <input ref={startedRef} type="hidden" name={STARTED_AT_FIELD} defaultValue="" />

      {erroreGenerale && (
        <p role="alert" className="m-0 rounded-campo border-2 border-inchiostro px-4 py-3 font-semibold">
          {erroreGenerale}
        </p>
      )}

      <button
        type="submit"
        disabled={invio}
        aria-disabled={invio}
        className="h-14 rounded-full bg-inchiostro text-[17px] font-extrabold text-fondo disabled:cursor-wait disabled:opacity-80 lg:h-[60px] lg:text-lg"
      >
        {invio ? T.invio : T.invia}
      </button>
      <p aria-live="polite" className="sr-only">
        {invio ? T.invio : ""}
      </p>
    </form>
  );
}

function Campo({
  field,
  label,
  errore,
  children,
}: {
  field: CandidaturaField;
  label: string;
  errore?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={ID[field]} className={etichetta}>
        {label}
      </label>
      {children}
      <Errore field={field} testo={errore} />
    </div>
  );
}

function Errore({ field, testo }: { field: CandidaturaField; testo?: string }) {
  if (!testo) return null;
  return (
    <p id={`${ID[field]}-errore`} className="m-0 flex items-start gap-1.5 text-sm font-semibold">
      <span aria-hidden="true">!</span>
      {testo}
    </p>
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
