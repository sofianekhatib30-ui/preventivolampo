// Testi del modulo di candidatura.
// CONFERMA viene dalla SPEC («Il modulo di candidatura»). Gli altri sono formulazioni
// minime e neutre, da far riscrivere ad Araldo (elencate nella consegna).

export function testoConferma(nome: string): string {
  return `Grazie, ${nome}. Ti richiamiamo entro due giorni lavorativi.`;
}

export const MESSAGGI = {
  invioInCorso: "Invio in corso…",
  troppoRapido: "Invio troppo rapido. Attendi qualche secondo e riprova.",
  troppiInvii: "Troppi invii da questa connessione. Riprova fra un'ora.",
  errore: "Invio non riuscito. Riprova fra poco o scrivici a studio@kdigitalsolution.it.",
  campiDaCorreggere: "Controlla i campi segnati.",
  titoloInviata: "Candidatura inviata",
  titoloNonInviata: "Candidatura non inviata",
  tornaAlModulo: "Torna al modulo",
  tornaAllaHome: "Torna alla home",
} as const;
