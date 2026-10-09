import { Archivo, Inter } from "next/font/google";

// Caratteri del sito, scaricati al momento della build e serviti dal nostro dominio:
// nessuna richiesta a domini terzi dal browser.

// Archivo variabile: pesi 100–900 più l'asse wdth (62–125) per i titoli stretti.
export const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-archivo",
});

// Inter per cifre, importi ed etichette: cifre tabellari, leggibile anche piccola.
export const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const classiCaratteri = `${archivo.variable} ${inter.variable} antialiased`;
