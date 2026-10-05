import { mkdir, mkdtemp, readdir, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { GET } from "@/app/api/pulizia/route";

// La demo non tiene i dati per sempre: dopo 7 giorni senza modifiche si cancellano.
let dir: string;
beforeAll(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "pulizia-"));
  process.env.PREVENTIVI_DIR = path.join(dir, "preventivi");
});
afterAll(async () => {
  delete process.env.PREVENTIVI_DIR;
  delete process.env.CRON_SECRET;
  await rm(dir, { recursive: true, force: true });
});

async function file(rel: string, giorniFa: number) {
  const p = path.join(dir, rel);
  await mkdir(path.dirname(p), { recursive: true });
  await writeFile(p, "{}");
  const t = new Date(Date.now() - giorniFa * 86_400_000);
  await utimes(p, t, t);
}

describe("pulizia notturna", () => {
  it("cancella i dati più vecchi di 7 giorni e lascia gli altri", async () => {
    await file("preventivi/vecchio.json", 9);
    await file("preventivi/nuovo.json", 1);
    await file("token/vecchio.json", 8);
    await file("limiti/vecchio.json", 30);
    const res = await GET(new Request("http://localhost/api/pulizia"));
    expect(await res.json()).toEqual({ cancellati: 3 });
    expect(await readdir(path.join(dir, "preventivi"))).toEqual(["nuovo.json"]);
  });

  it("con CRON_SECRET pretende l'header di Vercel", async () => {
    process.env.CRON_SECRET = "segreto-di-prova";
    expect((await GET(new Request("http://localhost/api/pulizia"))).status).toBe(401);
    const ok = await GET(new Request("http://localhost/api/pulizia", { headers: { authorization: "Bearer segreto-di-prova" } }));
    expect(ok.status).toBe(200);
  });
});
