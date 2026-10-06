import type { MetadataRoute } from "next";
import { INDEXABLE } from "@/lib/sito";

// I bot che generano le anteprime dei link (LinkedIn, Slack, WhatsApp, Facebook, X) possono
// leggere la pagina: servono a mostrare titolo e immagine quando il link viene condiviso.
// I motori di ricerca restano fuori finché la home non è in produzione, coerente con il
// noindex dei metadata. Quando INDEXABLE diventa true, aggiungere qui la sitemap.
const ANTEPRIME = ["LinkedInBot", "Slackbot-LinkExpanding", "WhatsApp", "facebookexternalhit", "Twitterbot"];

export default function robots(): MetadataRoute.Robots {
  if (!INDEXABLE) {
    return {
      rules: [
        { userAgent: ANTEPRIME, allow: "/", disallow: "/api/" },
        { userAgent: "*", disallow: "/" },
      ],
    };
  }
  return { rules: { userAgent: "*", allow: "/" } };
}
