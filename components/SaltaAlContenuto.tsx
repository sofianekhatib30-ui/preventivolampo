// Primo elemento della pagina: visibile solo quando riceve il focus.
export function SaltaAlContenuto() {
  return (
    <a
      href="#contenuto"
      className="sr-only z-50 no-underline rounded-full bg-lime px-5 py-3 font-bold text-inchiostro focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Salta al contenuto
    </a>
  );
}
