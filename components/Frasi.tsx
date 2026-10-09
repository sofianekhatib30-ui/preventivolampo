// Un titolo fatto di più frasi va a capo fra una frase e l'altra, mai a metà parola:
// ogni frase è un blocco a sé, e dentro la frase le righe si bilanciano (text-wrap: balance).
export function Frasi({ testo }: { testo: string }) {
  const frasi = testo.split(/(?<=[.!?؟])\s+/).filter(Boolean);
  if (frasi.length < 2) return <>{testo}</>;
  return (
    <>
      {frasi.map((f, i) => (
        <span key={i} className="block">
          {f}
        </span>
      ))}
    </>
  );
}
