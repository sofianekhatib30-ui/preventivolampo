// Un no motivato: messaggio per chi usa l'app e stato HTTP per la route.
export class Rifiuto extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}
