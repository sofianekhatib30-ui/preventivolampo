// npm run readme — copia nel README la tabella dei risultati dell'ultima misura (misure/AAAA-MM-GG.md),
// fra i segnaposto <!-- misura:inizio --> e <!-- misura:fine -->. I numeri non si ricopiano a mano.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const ultima = readdirSync("misure").filter((f) => /^\d{4}-\d{2}-\d{2}[a-z]?\.md$/.test(f)).sort().at(-1);
if (!ultima) throw new Error("Nessuna misura: esegui prima npm run misura");
const report = readFileSync(`misure/${ultima}`, "utf8");
const intestazione = report.split("\n").find((l) => l.startsWith("Generato da")) ?? "";
const tabella = report.slice(report.indexOf("| Misura |"), report.indexOf("\n\nNote sul metodo"));
const blocco = `<!-- misura:inizio -->\nDa [\`misure/${ultima}\`](misure/${ultima}). ${intestazione}\n\n${tabella}\n<!-- misura:fine -->`;
const readme = readFileSync("README.md", "utf8");
const nuovo = readme.replace(/<!-- misura:inizio -->[\s\S]*<!-- misura:fine -->/, blocco);
if (nuovo === readme && !readme.includes(blocco)) throw new Error("Segnaposto non trovati nel README");
writeFileSync("README.md", nuovo);
console.log(`README aggiornato da misure/${ultima}`);

// Prima e dopo: la prima misura, l'ultima e il banco di verifica (casi nuovi mai visti dal motore),
// fra <!-- confronto:inizio --> e <!-- confronto:fine -->. Anche qui i numeri vengono dai report.
function valori(file: string): Map<string, string> {
  const m = new Map<string, string>();
  const testo = readFileSync(`misure/${file}`, "utf8");
  for (const riga of testo.slice(testo.indexOf("| Misura |"), testo.indexOf("\n\nNote sul metodo")).split("\n").slice(2)) {
    const [, nome, valore] = riga.split("|").map((x) => x.trim());
    if (nome) m.set(nome.replace(/\*/g, ""), valore.replace(/\*/g, ""));
  }
  return m;
}
const misure = readdirSync("misure").filter((f) => /^\d{4}-\d{2}-\d{2}[a-z]?\.md$/.test(f)).sort();
const prima = misure[0];
const verifica = readdirSync("misure").filter((f) => /^\d{4}-\d{2}-\d{2}[a-z]?-verifica\.md$/.test(f)).sort().at(-1);
const aggiornato = readFileSync("README.md", "utf8");
if (prima && prima !== ultima && aggiornato.includes("<!-- confronto:inizio -->")) {
  const a = valori(prima);
  const b = valori(ultima);
  const v = verifica ? valori(verifica) : new Map<string, string>();
  const chiavi = [
    "Righe giuste senza correzioni (voce, quantità e unità)",
    "Voci di listino abbinate correttamente",
    "Voci «da prezzare» riconosciute come tali",
    "Abbinamenti sbagliati con prezzo di listino (l'errore pericoloso)",
    "Prezzi inventati",
    "IVA corretta al centesimo (casi calcolabili senza l'artigiano)",
    "Righe in più rispetto all'atteso",
  ];
  const corto = (s = "—") => s.replace(/;.*$/, "");
  const righe = chiavi.map((k) => `| ${k} | ${corto(a.get(k))} | ${corto(b.get(k))} | ${corto(v.get(k))} |`).join("\n");
  const confronto = `<!-- confronto:inizio -->\n| Misura | Prima ([\`${prima}\`](misure/${prima})) | Dopo ([\`${ultima}\`](misure/${ultima})) | Verifica, 6 casi nuovi${verifica ? ` ([\`${verifica}\`](misure/${verifica}))` : ""} |\n|---|---|---|---|\n${righe}\n<!-- confronto:fine -->`;
  writeFileSync("README.md", aggiornato.replace(/<!-- confronto:inizio -->[\s\S]*<!-- confronto:fine -->/, confronto));
  console.log("Confronto prima/dopo aggiornato");
}
