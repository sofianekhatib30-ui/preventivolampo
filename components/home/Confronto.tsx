const COLONNE = ["Le app di preventivi fai da te", "PreventivoLampo"] as const;

const RIGHE: { tema: string; faiDaTe: string; noi: string }[] = [
  { tema: "Il listino", faiDaTe: "Lo inserisci tu, voce per voce", noi: "Lo carichiamo noi, tu confermi" },
  {
    tema: "Le voci che mancano",
    faiDaTe: "Spesso stimate dall'AI",
    noi: "Segnate da prezzare, mai inventate",
  },
  {
    tema: "IVA con beni significativi",
    faiDaTe: "Da ripartire a mano",
    noi: "Ripartita in automatico, con dicitura",
  },
  { tema: "Chi ti aiuta", faiDaTe: "Una chat di assistenza", noi: "Una persona, a Monza" },
];

// Sopra 1024 px una tabella vera; sotto, una lista di coppie (SPEC, sezione «Confronto»).
export function Confronto() {
  return (
    <section
      aria-labelledby="confronto"
      className="margini flex flex-col gap-6 pb-14 lg:gap-8 lg:pb-28"
    >
      <h2 id="confronto" className="titolo-confronto m-0">
        Fai da te o fatto per te
      </h2>

      <div className="hidden overflow-hidden rounded-[20px] border-2 border-ardesia text-[17px] lg:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ardesia text-left font-bold text-fondo">
              <td className="w-[clamp(220px,21vw,300px)] px-6 py-[18px]" />
              <th scope="col" className="px-6 py-[18px]">
                {COLONNE[0]}
              </th>
              <th scope="col" className="bg-lime px-6 py-[18px] text-inchiostro">
                {COLONNE[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {RIGHE.map((riga) => (
              <tr key={riga.tema} className="border-t border-linea">
                <th scope="row" className="px-6 py-[18px] text-left font-bold">
                  {riga.tema}
                </th>
                <td className="px-6 py-[18px] text-testo-2">{riga.faiDaTe}</td>
                <td className="bg-superficie px-6 py-[18px]">{riga.noi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 p-0 lg:hidden">
        {RIGHE.map((riga) => (
          <li key={riga.tema} className="overflow-hidden rounded-[18px] border-2 border-ardesia">
            <h3 className="m-0 bg-ardesia px-4 py-3 text-lg font-bold text-fondo">{riga.tema}</h3>
            <dl className="m-0 text-base">
              <div className="px-4 py-3">
                <dt className="text-sm font-semibold text-testo-3">{COLONNE[0]}</dt>
                <dd className="m-0 text-testo-2">{riga.faiDaTe}</dd>
              </div>
              <div className="border-t border-linea bg-superficie px-4 py-3">
                <dt className="text-sm font-semibold">
                  <span className="rounded bg-lime px-1.5 py-0.5 text-inchiostro">{COLONNE[1]}</span>
                </dt>
                <dd className="m-0">{riga.noi}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
