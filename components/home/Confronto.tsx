const COLONNE = ["Word o Excel, la sera", "Un chatbot qualsiasi", "PreventivoLampo"] as const;

const RIGHE: { tema: string; celle: [string, string, string] }[] = [
  {
    tema: "I prezzi",
    celle: ["Li copi tu dal listino", "Li stima: il tuo listino non lo conosce", "Solo dal tuo listino. Quello che manca resta da prezzare"],
  },
  {
    tema: "Le misure che mancano",
    celle: ["Te ne accorgi quando scrivi", "Spesso le dà per buone", "Te le chiede prima di fare i conti"],
  },
  {
    tema: "IVA con beni significativi",
    celle: ["A mano, con il dubbio", "Dipende da come glielo chiedi", "10% e 22% ripartiti, con la dicitura"],
  },
  {
    tema: "Il documento",
    celle: ["Da impaginare ogni volta", "Testo da copiare altrove", "PDF con il tuo logo, pronto da mandare"],
  },
  {
    tema: "Il sì del cliente",
    celle: ["Un messaggio, se va bene", "Non c'è", "Accettazione online: nome, data, ora e copia del PDF"],
  },
  {
    tema: "Dove lo fai",
    celle: ["Al computer, dopo cena", "Al telefono, poi lo rifai", "Dal telefono, appena finito il sopralluogo"],
  },
];

// Sopra 1024 px una tabella vera; sotto, una scheda per tema.
export function Confronto() {
  return (
    <section aria-labelledby="confronto" className="margini flex flex-col gap-6 pb-14 lg:gap-10 lg:pb-28">
      <h2 id="confronto" className="titolo-h2 m-0 max-w-[900px]">
        Tre modi di fare lo stesso preventivo.
      </h2>

      <div className="hidden overflow-hidden rounded-[20px] border-2 border-ardesia text-[17px] lg:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ardesia text-left font-bold text-fondo">
              <td className="w-[clamp(200px,18vw,260px)] px-6 py-[18px]" />
              <th scope="col" className="px-6 py-[18px]">{COLONNE[0]}</th>
              <th scope="col" className="px-6 py-[18px]">{COLONNE[1]}</th>
              <th scope="col" className="bg-lime px-6 py-[18px] text-inchiostro">{COLONNE[2]}</th>
            </tr>
          </thead>
          <tbody>
            {RIGHE.map((riga) => (
              <tr key={riga.tema} className="border-t border-linea">
                <th scope="row" className="px-6 py-[18px] text-left align-top font-bold">{riga.tema}</th>
                <td className="px-6 py-[18px] align-top text-testo-2">{riga.celle[0]}</td>
                <td className="px-6 py-[18px] align-top text-testo-2">{riga.celle[1]}</td>
                <td className="bg-superficie px-6 py-[18px] align-top font-semibold">{riga.celle[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul tabIndex={0} aria-label="Confronto per tema" className="m-0 -mx-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] flex list-none snap-x snap-mandatory gap-3 overflow-x-auto px-[clamp(1.25rem,-1.071rem+9.524vw,7.5rem)] pb-2 lg:hidden">
        {RIGHE.map((riga) => (
          <li key={riga.tema} className="w-[84%] max-w-[380px] shrink-0 snap-start overflow-hidden rounded-[18px] border-2 border-ardesia bg-fondo">
            <h3 className="m-0 bg-ardesia px-4 py-3 text-lg font-bold text-fondo">{riga.tema}</h3>
            <dl className="m-0 text-base">
              {COLONNE.map((col, i) => (
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
        <span className="lg:hidden">Scorri per gli altri confronti. </span>«Chatbot qualsiasi»: un assistente generico usato senza il tuo listino, come fanno in tanti oggi.
      </p>
    </section>
  );
}
