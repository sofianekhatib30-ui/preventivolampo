// Limite di frequenza per IP: 5 invii all'ora (SPEC, «Il modulo di candidatura»).
// In memoria del processo: si azzera a ogni riavvio e non è condiviso fra istanze
// serverless. Basta per lo sviluppo e per un pilota a basso traffico; in produzione
// va spostato su un archivio condiviso (dichiarato nella consegna).

export const MAX_PER_WINDOW = 5;
export const WINDOW_MS = 60 * 60 * 1000;

export class LimitatoreFrequenza {
  private readonly hits = new Map<string, number[]>();

  constructor(
    private readonly max = MAX_PER_WINDOW,
    private readonly windowMs = WINDOW_MS,
  ) {}

  // Registra un tentativo e dice se è ammesso. Ogni tentativo conta, anche se poi fallisce.
  consenti(key: string, now: number): boolean {
    const recent = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (recent.length >= this.max) {
      this.hits.set(key, recent);
      return false;
    }
    recent.push(now);
    this.hits.set(key, recent);
    // Pulizia: evita che la mappa cresca senza limiti.
    if (this.hits.size > 10_000) {
      for (const [k, times] of this.hits) {
        if (times.every((t) => now - t >= this.windowMs)) this.hits.delete(k);
      }
    }
    return true;
  }

  azzera(): void {
    this.hits.clear();
  }
}

export const limitatoreCandidature = new LimitatoreFrequenza();

// IP del client dalle intestazioni del proxy. Resta in memoria, non finisce mai nei log.
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "sconosciuto";
}
