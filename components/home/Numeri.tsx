// I numeri del motore, con il metodo accanto. Vengono da misure/2026-10-08.md e
// misure/2026-10-08-verifica.md (generati da `npm run misura`, non scritti a mano). Si pubblicano
// solo i 100% che reggono a ogni misura (l'IVA resta nel testo, per scelta di Sofiane del 9/10); la percentuale di voci giuste varia da una misura
// all'altra (97-99%) e sta nel testo, non in una cifra grande:
// quando una nuova misura li cambia, si cambiano qui e nella tabella delle promesse della SPEC.

const CIFRE = [
  { cifra: "100%", cosa: "dei prezzi dal tuo listino", dettaglio: "Zero prezzi inventati, in ogni prova. Quello che manca resta da prezzare" },
  { cifra: "100%", cosa: "preventivi nuovi senza niente da correggere", dettaglio: "6 sopralluoghi mai visti prima: tutte le 26 voci giuste" },
  { cifra: "13 s", cosa: "per avere la bozza", dettaglio: "Dal racconto del sopralluogo alla bozza completa" },
];

export function Numeri() {
  return (
    <section id="numeri" className="su-scuro margini flex flex-col gap-9 bg-ardesia py-14 text-fondo lg:gap-14 lg:py-28">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <h2 className="titolo-h2 m-0">Non ti diciamo che è preciso. Ti diciamo quanto, e come l&apos;abbiamo misurato.</h2>
        <p className="testo-base m-0 max-w-[560px] text-scuro-testo">
          Abbiamo scritto 36 sopralluoghi come li racconta un artigiano: misure a spanne, ripensamenti, il materiale che compra
          il cliente. Per ognuno, prima di provare, il preventivo giusto. Poi abbiamo confrontato riga per riga.
        </p>
      </div>
      <dl className="m-0 grid gap-px overflow-hidden rounded-[20px] bg-scuro-linea md:grid-cols-3">
        {CIFRE.map((c) => (
          <div key={c.cosa} className="flex flex-col gap-2 bg-ardesia-2 p-6 lg:p-8">
            <dt className="order-2 text-[18px] font-bold lg:text-[19px]">{c.cosa}</dt>
            <dd className="m-0 order-1 font-sans text-[64px] leading-[0.9] [font-weight:900] [font-stretch:62%] text-lime lg:text-[88px]">
              {c.cifra}
            </dd>
            <dd className="order-3 m-0 text-[15px] leading-normal text-scuro-nota">{c.dettaglio}</dd>
          </div>
        ))}
      </dl>
      <div className="grid gap-4 text-[15px] leading-[1.6] text-scuro-testo lg:grid-cols-2 lg:gap-16 lg:text-base">
        <p className="m-0">
          I mestieri provati sono cinque: muratore, imbianchino, idraulico, elettricista e piastrellista. Sui 30 sopralluoghi del
          banco principale, fra il 97 e il 99% delle voci esce giusto senza toccare niente; le altre le vedi e le sistemi tu
          prima di approvare. Al cliente non arriva niente che tu non abbia visto.
        </p>
        <p className="m-0">
          È un campione piccolo, e lo diciamo: sopralluoghi scritti, non ancora registrati a voce, e lavori inventati. Con il
          programma pilota lo allarghiamo ai lavori veri e agli altri mestieri, e i nuovi numeri li pubblichiamo qui, anche se
          vengono peggio.
        </p>
      </div>
    </section>
  );
}
