// npm run readme — copia nel README la tabella dei risultati dell'ultima misura (misure/AAAA-MM-GG.md),
// fra i segnaposto <!-- misura:inizio --> e <!-- misura:fine -->. I numeri non si ricopiano a mano.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";

const ultima = readdirSync("misure").filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort().at(-1);
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
