import type { Dizionario } from "@/lib/i18n/it";

// Sopra 1024 px una tabella vera; sotto, una scheda per tema.
export function Confronto({ d }: { d: Dizionario }) {
  const C = d.confronto;
  return (
    <section aria-labelledby="confronto" className="margini flex flex-col gap-6 pb-14 lg:gap-10 lg:pb-28">
      <h2 id="confronto" className="titolo-h2 m-0 max-w-[900px]">
        {C.titolo}
      </h2>

      <div className="hidden overflow-hidden rounded-[20px] border-2 border-ardesia text-[17px] lg:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ardesia text-start font-bold text-fondo">
              <td className="w-[clamp(200px,18vw,260px)] px-6 py-[18px]" />
              <th scope="col" className="px-6 py-[18px] text-start">{C.colonne[0]}</th>
              <th scope="col" className="px-6 py-[18px] text-start">{C.colonne[1]}</th>
              <th scope="col" className="bg-lime px-6 py-[18px] text-start text-inchiostro">{C.colonne[2]}</th>
            </tr>
          </thead>
          <tbody>
            {C.righe.map((riga) => (
              <tr key={riga.tema} className="border-t border-linea">
                <th scope="row" className="px-6 py-[18px] text-start align-top font-bold">{riga.tema}</th>
                <td className="px-6 py-[18px] align-top text-testo-2">{riga.celle[0]}</td>
                <td className="px-6 py-[18px] align-top text-testo-2">{riga.celle[1]}</td>
                <td className="bg-superficie px-6 py-[18px] align-top font-semibold">{riga.celle[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul
        tabIndex={0}
        aria-label={C.etichettaLista}
        className="m-0 -mx-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] flex list-none snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] pb-2 lg:hidden"
      >
        {C.righe.map((riga) => (
          <li key={riga.tema} className="w-[84%] max-w-[380px] shrink-0 snap-start overflow-hidden rounded-[18px] border-2 border-ardesia bg-fondo">
            <h3 className="m-0 bg-ardesia px-4 py-3 text-lg font-bold text-fondo">{riga.tema}</h3>
            <dl className="m-0 text-base">
              {C.colonne.map((col, i) => (
                <div key={col} className={`px-4 py-3 ${i > 0 ? "border-t border-linea" : ""} ${i === 2 ? "bg-superficie" : ""}`}>
                  <dt className="text-sm font-semibold text-testo-3">
                    {i === 2 ? <span className="rounded bg-lime px-1.5 py-0.5 text-inchiostro">{col}</span> : col}
                  </dt>
                  <dd className={`m-0 ${i === 2 ? "font-semibold" : "text-testo-2"}`}>{riga.celle[i]}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <p className="m-0 text-[14px] text-testo-3">
        <span className="lg:hidden">{C.scorri} </span>
        {C.nota}
      </p>
    </section>
  );
}
