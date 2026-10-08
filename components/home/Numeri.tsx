// Le garanzie, in cifre. Ognuna è vera per costruzione o misurata:
// - «100% dei prezzi dal tuo listino»: il motore non può mettere un prezzo che non viene dal listino
//   (lib/motore, misure/2026-10-08.md: prezzi inventati 0);
// - «6 lingue»: le lingue del cliente in lib/preventivi/lingua.ts (LINGUE). Se cambiano, si cambia qui;
// - «13 s»: tempo medio per la bozza in misure/2026-10-08.md.
// Quando una di queste cambia, si cambia qui e nella tabella delle promesse della SPEC.

const CIFRE = [
  { cifra: "100%", cosa: "dei prezzi dal tuo listino", dettaglio: "Nessun prezzo inventato. Quello che manca resta da prezzare finché non lo decidi tu." },
  {
    cifra: "6 lingue",
    cosa: "per il tuo cliente",
    dettaglio: "Italiano, inglese, tedesco, francese, spagnolo e olandese. E tu racconti anche in rumeno, albanese o arabo.",
  },
  { cifra: "13 s", cosa: "per avere la bozza", dettaglio: "Dal racconto del sopralluogo alla bozza completa, con le domande su quello che manca." },
];

export function Numeri() {
  return (
    <section id="numeri" className="su-scuro margini flex flex-col gap-9 bg-ardesia py-14 text-fondo lg:gap-14 lg:py-28">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <h2 className="titolo-h2 m-0">Quello che ti garantiamo, ogni volta.</h2>
        <p className="testo-base m-0 max-w-[560px] text-scuro-testo">
          Il preventivo porta il tuo nome, quindi deve essere giusto. Per questo il sistema non tira mai a indovinare: quello che sa
          lo scrive, quello che non sa te lo chiede.
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
          Prima di arrivare al cliente, ogni preventivo passa da te. Le voci da controllare sono evidenziate, le misure che mancano te
          le chiede, e niente parte senza la tua approvazione.
        </p>
        <p className="m-0">
          Con il programma pilota lo mettiamo alla prova sui lavori veri di dieci artigiani di mestieri diversi. Quello che non va ce
          lo dicono, e lo sistemiamo.
        </p>
      </div>
    </section>
  );
}
