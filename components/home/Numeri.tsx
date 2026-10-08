// I numeri del motore, con il metodo accanto. Vengono da misure/2026-10-08.md e
// misure/2026-10-08-verifica.md (generati da `npm run misura`, non scritti a mano):
// quando una nuova misura li cambia, si cambiano qui e nella tabella delle promesse della SPEC.

const CIFRE = [
  { cifra: "99,4%", cosa: "righe giuste senza correzioni", dettaglio: "158 su 159: voce, quantità e unità" },
  { cifra: "0", cosa: "prezzi inventati", dettaglio: "ogni prezzo viene dal listino, o resta da prezzare" },
  { cifra: "26/26", cosa: "righe giuste su sopralluoghi nuovi", dettaglio: "26 su 26, su sopralluoghi scritti dopo e mai visti prima" },
  { cifra: "13 s", cosa: "in media per la bozza", dettaglio: "dal testo del sopralluogo alla bozza completa" },
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
      <dl className="m-0 grid gap-px overflow-hidden rounded-[20px] bg-scuro-linea sm:grid-cols-2 xl:grid-cols-4">
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
          I mestieri provati sono cinque: muratore, imbianchino, idraulico, elettricista e piastrellista. Le domande su quello che
          mancava sono state fatte tutte, e nessuna di troppo. Il regime IVA è risultato giusto in tutti i casi in cui il racconto
          bastava a stabilirlo; negli altri non ha deciso da solo: ha lasciato la scelta all&apos;artigiano.
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
