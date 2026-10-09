// Forma dei contenuti delle pagine indicizzabili (mestieri, funzioni, guide…).
// I testi italiani stanno in lib/contenuti/it/, le altre lingue sono generate da
// scripts/traduci-dizionario.ts in lib/contenuti/<lingua>.json.
// Segni ammessi nei testi: **grassetto**, [testo](indirizzo), {segnaposto}. Mai la lineetta lunga.
// Le chiavi elencate in CHIAVI_FISSE non si traducono: sono parole che restano in italiano
// anche sulla pagina in un'altra lingua (il racconto dell'esempio, i nomi delle voci del preventivo).

export const CHIAVI_FISSE = ["dettatura", "voce", "unita", "termine", "url"] as const;

export type Punto = { titolo: string; testo: string };
export type Domanda = { d: string; r: string };

export type PaginaMestiere = {
  meta: {
    /** titolo della scheda del browser e del risultato di ricerca, senza il nome del sito: al massimo 50 caratteri */
    titolo: string;
    /** descrizione per i risultati di ricerca: fra 120 e 155 caratteri */
    descrizione: string;
  };
  /** nome del mestiere, come nel menu: «Elettricista» */
  nome: string;
  /** una riga per l'elenco dei mestieri, specifica del mestiere (cosa ci trovi) */
  riga: string;
  h1: string;
  sottotitolo: string;
  esempio: {
    titolo: string;
    intro: string;
    /** di che lavoro si tratta, breve: «Soggiorno e camera, appartamento» */
    lavoro: string;
    /** il racconto dell'artigiano, in italiano parlato. Non si traduce. Lavoro e nomi inventati */
    dettatura: string;
  };
  voci: {
    titolo: string;
    intro: string;
    /** voce e unità restano in italiano (sono le parole del preventivo), la nota si traduce. Almeno 10 righe */
    righe: { voce: string; unita: string; nota: string }[];
  };
  prezzare: { titolo: string; intro: string; punti: Punto[] };
  documenti: { titolo: string; intro: string; punti: Punto[]; avvertenza: string };
  straniero: { titolo: string; testo: string };
  domande: { titolo: string; voci: Domanda[] };
};

/** Una sezione di testo: paragrafi e, se servono, punti con titolo. */
export type Sezione = { titolo: string; paragrafi: string[]; punti?: Punto[] };

/** Pagine /funzioni/<id>: una capacità del prodotto spiegata per esteso. */
export type PaginaFunzione = {
  meta: { titolo: string; descrizione: string };
  /** nome breve per menu ed elenchi: «Preventivo da vocale» */
  nome: string;
  /** una riga per gli elenchi */
  riga: string;
  h1: string;
  sottotitolo: string;
  sezioni: Sezione[];
  domande: { titolo: string; voci: Domanda[] };
};

/** Pagine /guide/<id>: come si fa, per l'artigiano. Con fonti verificabili. */
export type PaginaGuida = {
  meta: { titolo: string; descrizione: string };
  nome: string;
  riga: string;
  h1: string;
  intro: string;
  /** i punti da portarsi via, 3-5 frasi brevi */
  inBreve: string[];
  sezioni: Sezione[];
  domande: { titolo: string; voci: Domanda[] };
  /** fonti ufficiali o autorevoli; l'indirizzo non si traduce */
  fonti: { nome: string; url: string }[];
  avvertenza: string;
};

/** Il glossario, su una pagina sola. Il termine resta in italiano in ogni lingua. */
export type PaginaGlossario = {
  meta: { titolo: string; descrizione: string };
  h1: string;
  intro: string;
  termini: { termine: string; definizione: string }[];
};
