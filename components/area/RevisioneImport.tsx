"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { centesimi, euro, PER_UNITA, UNITA } from "@/components/preventivo/formato";
import type { Campo, Mappatura, RigaImport } from "@/lib/impresa/importa";

const NOMI: Record<Campo, string> = {
  nome: "Descrizione della voce",
  prezzo: "Prezzo",
  unita: "Unità di misura",
  codice: "Codice",
  descrizione: "Descrizione lunga",
  categoria: "Categoria",
};
const ORDINE: Campo[] = ["nome", "prezzo", "unita", "codice", "descrizione", "categoria"];
const piccolo = "block min-h-11 w-full rounded-campo border border-linea-2 bg-superficie px-2 text-[16px]";
const PAGINA = 80;

type Stato = RigaImport & { prezzoTesto: string; aperta: boolean };

export default function RevisioneImport({
  id,
  nomeFile,
  metodo,
  mappa,
  colonne,
  esempi,
  righe: iniziali,
}: {
  id: string;
  nomeFile: string;
  metodo: string;
  mappa: Mappatura;
  colonne: string[];
  esempi: string[][];
  righe: RigaImport[];
}) {
  const router = useRouter();
  const [righe, setRighe] = useState<Stato[]>(() =>
    iniziali.map((r) => ({ ...r, prezzoTesto: r.prezzo_cents === null ? "" : (r.prezzo_cents / 100).toFixed(2).replace(".", ","), aperta: false })),
  );
  const [scelta, setScelta] = useState<Record<Campo, string>>(
    () => Object.fromEntries(ORDINE.map((c) => [c, mappa[c] === undefined ? "" : String(mappa[c])])) as Record<Campo, string>,
  );
  const [soloDubbi, setSoloDubbi] = useState(iniziali.some((r) => r.problemi.length > 0));
  const [quante, setQuante] = useState(PAGINA);
  const [invio, setInvio] = useState<"" | "colonne" | "conferma" | "annulla">("");
  const [errore, setErrore] = useState("");

  const valida = (r: Stato) => !r.includi || (r.unita !== null && centesimi(r.prezzoTesto) !== null && r.nome.trim().length >= 2 && r.codice.trim().length > 0);
  const daSistemare = righe.filter((r) => !valida(r)).length;
  const incluse = righe.filter((r) => r.includi).length;
  const visibili = useMemo(() => righe.filter((r) => !soloDubbi || r.problemi.length > 0 || !valida(r)), [righe, soloDubbi]);

  const set = (n: number, patch: Partial<Stato>) => setRighe((rs) => rs.map((r) => (r.n === n ? { ...r, ...patch } : r)));

  async function chiama(metodo: string, corpo?: object) {
    const res = await fetch(`/api/area/import/${id}`, {
      method: metodo,
      headers: corpo ? { "content-type": "application/json" } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    const b = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(b.errore ?? "Qualcosa non va. Riprova.");
    return b as { vai?: string; inserite?: number };
  }

  async function cambiaColonne() {
    setInvio("colonne");
    setErrore("");
    try {
      await chiama("PUT", { mappa: Object.fromEntries(ORDINE.map((c) => [c, scelta[c] === "" ? null : Number(scelta[c])])) });
      window.location.reload();
    } catch (e) {
      setErrore((e as Error).message);
      setInvio("");
    }
  }

  async function conferma() {
    setInvio("conferma");
    setErrore("");
    try {
      const r = await chiama("POST", {
        righe: righe.map((x) => ({ n: x.n, includi: x.includi, codice: x.codice, nome: x.nome, unita: x.unita, prezzo_cents: centesimi(x.prezzoTesto) })),
      });
      router.push(`/area/listino?importate=${r.inserite ?? 0}`);
      router.refresh();
    } catch (e) {
      setErrore((e as Error).message);
      setInvio("");
    }
  }

  async function annulla() {
    setInvio("annulla");
    try {
      await chiama("DELETE");
    } finally {
      router.push("/area/listino");
    }
  }

  return (
    <div>
      {metodo === "lettura AI" && (
        <p className="mt-6 rounded-card bg-fondo-2 px-5 py-4 text-[16px] leading-relaxed text-testo-2 ring-1 ring-linea">
          Queste voci le ha lette l&apos;AI dal tuo PDF o dalle foto. <strong className="text-inchiostro">Controlla ogni prezzo</strong>{" "}
          prima di confermare: dove non era sicura trovi una nota.
        </p>
      )}
      <details className={`mt-6 rounded-card bg-superficie ring-1 ring-linea ${metodo === "lettura AI" ? "hidden" : ""}`} open={metodo !== "regole" && metodo !== "a mano"}>
        <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-3 px-5 text-[17px] font-bold">
          Colonne del file
          <span className="text-[14px] font-semibold text-testo-3">
            {metodo === "claude" ? "riconosciute dall'AI: controllale" : metodo === "a mano" ? "scelte da te" : "riconosciute dai titoli"}
          </span>
        </summary>
        <div className="border-t border-linea px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {ORDINE.map((c) => (
              <label key={c} className="block text-[15px] font-semibold text-testo-2">
                {NOMI[c]}
                <select className={`${piccolo} mt-1`} value={scelta[c]} onChange={(e) => setScelta((s) => ({ ...s, [c]: e.target.value }))}>
                  <option value="">{c === "nome" || c === "prezzo" ? "Scegli…" : "Nessuna"}</option>
                  {colonne.map((nome, i) => (
                    <option key={i} value={i}>
                      {nome}
                      {esempi[0]?.[i] ? ` (es. ${esempi[0][i].slice(0, 28)})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <button type="button" onClick={cambiaColonne} disabled={invio !== ""} className="bottone mt-4 min-h-12 border-2 border-ardesia text-[16px] disabled:opacity-50">
            {invio === "colonne" ? "Rileggo il file…" : "Rileggi con queste colonne"}
          </button>
          <p className="mt-2 text-[14px] text-testo-3">Rileggere il file annulla le correzioni fatte qui sotto.</p>
        </div>
      </details>

      <div className="sticky top-0 z-10 -mx-4 mt-6 border-b border-linea bg-fondo/95 px-4 py-3 backdrop-blur">
        <p className="text-[17px]">
          <strong>{incluse}</strong> voci da importare da <span className="font-semibold">{nomeFile}</span>
          {daSistemare > 0 && (
            <span className="ml-2 whitespace-nowrap rounded-full bg-ambra px-2.5 py-0.5 text-[15px] font-bold text-ambra-testo">{daSistemare} da sistemare</span>
          )}
        </p>
        <label className="mt-2 flex min-h-11 items-center gap-2.5 text-[16px]">
          <input type="checkbox" className="size-5 accent-[#343645]" checked={soloDubbi} onChange={(e) => setSoloDubbi(e.target.checked)} />
          Mostra solo le righe da controllare
        </label>
      </div>

      <ul className="mt-3 divide-y divide-linea overflow-hidden rounded-card bg-superficie ring-1 ring-linea">
        {visibili.slice(0, quante).map((r) => {
          const ok = valida(r);
          const modifica = r.aperta || !ok || r.problemi.length > 0;
          return (
            <li key={r.n} className={`px-4 py-3 sm:px-5 ${!r.includi ? "opacity-60" : ""}`}>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  aria-label={`Importa la riga ${r.n}`}
                  className="mt-1 size-6 shrink-0 accent-[#343645]"
                  checked={r.includi}
                  onChange={(e) => set(r.n, { includi: e.target.checked })}
                />
                <div className="min-w-0 flex-1">
                  {modifica ? (
                    <input aria-label="Descrizione" className={piccolo} value={r.nome} onChange={(e) => set(r.n, { nome: e.target.value })} />
                  ) : (
                    <p className="text-[16px] font-semibold leading-snug">{r.nome}</p>
                  )}
                  <p className="mt-0.5 font-mono text-[13px] text-testo-3">riga {r.n} del file{r.unitaLetta ? `, unità «${r.unitaLetta}»` : ""}</p>
                  {r.problemi.length > 0 && <p className="mt-1 text-[14px] font-semibold text-ambra-testo">{r.problemi.join("; ")}</p>}
                  {modifica ? (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <label className="text-[13px] font-semibold text-testo-3">
                        Prezzo €
                        <input
                          inputMode="decimal"
                          className={`${piccolo} font-mono ${centesimi(r.prezzoTesto) === null ? "border-2 border-ambra-bordo bg-ambra" : ""}`}
                          value={r.prezzoTesto}
                          onChange={(e) => set(r.n, { prezzoTesto: e.target.value })}
                        />
                      </label>
                      <label className="text-[13px] font-semibold text-testo-3">
                        Unità
                        <select
                          className={`${piccolo} ${r.unita === null ? "border-2 border-ambra-bordo bg-ambra" : ""}`}
                          value={r.unita ?? ""}
                          onChange={(e) => set(r.n, { unita: e.target.value || null })}
                        >
                          <option value="">—</option>
                          {Object.entries(UNITA).map(([k, v]) => (
                            <option key={k} value={k}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="text-[13px] font-semibold text-testo-3">
                        Codice
                        <input className={`${piccolo} font-mono`} value={r.codice} onChange={(e) => set(r.n, { codice: e.target.value })} />
                      </label>
                    </div>
                  ) : (
                    <p className="mt-1 flex flex-wrap items-baseline gap-x-3 font-mono text-[15px]">
                      <span className="font-semibold">{euro(centesimi(r.prezzoTesto) ?? 0)}</span>
                      <span className="text-testo-3">{PER_UNITA[r.unita!]}</span>
                      <span className="text-testo-3">{r.codice}</span>
                      <button type="button" onClick={() => set(r.n, { aperta: true })} className="min-h-11 font-sans text-[14px] font-semibold text-cielo-scuro underline">
                        Correggi
                      </button>
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        {visibili.length === 0 && <li className="px-5 py-8 text-center text-[17px] text-testo-3">Tutte le righe sono a posto.</li>}
      </ul>
      {visibili.length > quante && (
        <button type="button" onClick={() => setQuante((q) => q + PAGINA)} className="bottone mt-4 min-h-12 w-full border-2 border-linea-2 text-[16px]">
          Mostra altre righe ({visibili.length - quante})
        </button>
      )}

      {errore && (
        <p role="alert" className="mt-4 text-[16px] font-semibold text-errore">
          {errore}
        </p>
      )}
      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={conferma} disabled={invio !== "" || daSistemare > 0 || incluse === 0} className="bottone bottone-azione min-h-14 text-[18px] disabled:opacity-50">
          {invio === "conferma" ? "Importo…" : `Importa ${incluse} voci`}
        </button>
        <button type="button" onClick={annulla} disabled={invio !== ""} className="bottone min-h-14 border-2 border-linea-2 text-[16px]">
          Annulla l&apos;import
        </button>
      </div>
      {daSistemare > 0 && <p className="mt-2 text-[15px] text-testo-3">Sistema le righe evidenziate o togli la spunta per importare.</p>}
    </div>
  );
}
