// Il marchio di K Digital Solution (stanghetta sabbia e freccia d'oro su fondo inchiostro), lo stesso
// che Attestiamo mostra accanto al suo nome: gli strumenti di KDS si riconoscono dal marchio comune.
export function MarchioKds({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="14" fill="#2A1018" />
      <g transform="translate(10 10) scale(0.44)">
        <rect x="14" y="10" width="15" height="80" rx="1.5" fill="#F2E4D0" />
        <path d="M82 10 L42 50 L82 90" fill="none" stroke="#C6A15B" strokeWidth="15" strokeMiterlimit="8" />
      </g>
    </svg>
  );
}
