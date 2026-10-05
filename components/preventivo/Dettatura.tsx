"use client";

import { useRef, useState, useSyncExternalStore } from "react";

// Dettatura con il riconoscimento vocale del browser (Web Speech API, italiano): niente chiavi,
// niente audio sul nostro server. Dove il browser non lo supporta, il pulsante non compare.
type Riconoscimento = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};
type Costruttore = new () => Riconoscimento;

function costruttore(): Costruttore | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { SpeechRecognition?: Costruttore; webkitSpeechRecognition?: Costruttore };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export default function Dettatura({ onTesto }: { onTesto: (pezzo: string) => void }) {
  const supportata = useSyncExternalStore(
    () => () => {},
    () => costruttore() !== null,
    () => false,
  );
  const [ascolto, setAscolto] = useState(false);
  const [provvisorio, setProvvisorio] = useState("");
  const [errore, setErrore] = useState("");
  const rec = useRef<Riconoscimento | null>(null);

  if (!supportata) return null;

  function avvia() {
    const C = costruttore();
    if (!C) return;
    const r = new C();
    r.lang = "it-IT";
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e) => {
      let parziale = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const ris = e.results[i];
        if (ris.isFinal) onTesto(ris[0].transcript.trim());
        else parziale += ris[0].transcript;
      }
      setProvvisorio(parziale);
    };
    r.onerror = (e) => setErrore(e.error === "not-allowed" ? "Il browser non ha il permesso di usare il microfono." : "La dettatura si è interrotta. Riprova.");
    r.onend = () => {
      setAscolto(false);
      setProvvisorio("");
    };
    setErrore("");
    rec.current = r;
    r.start();
    setAscolto(true);
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => (ascolto ? rec.current?.stop() : avvia())}
        aria-pressed={ascolto}
        className={`bottone min-h-12 border-2 text-[16px] ${ascolto ? "border-errore bg-superficie text-errore" : "border-ardesia"}`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="9" y="3" width="6" height="11" rx="3" fill={ascolto ? "currentColor" : "none"} />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
        {ascolto ? "Sto ascoltando: tocca per fermare" : "Detta il sopralluogo"}
      </button>
      {provvisorio && <p className="mt-2 text-[15px] italic text-testo-3">{provvisorio}…</p>}
      {errore && <p className="mt-2 text-[15px] text-errore">{errore}</p>}
      <p className="mt-1.5 text-sm text-testo-3">Usa il riconoscimento vocale del browser: a questo sito arriva solo il testo.</p>
    </div>
  );
}
