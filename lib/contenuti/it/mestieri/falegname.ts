import type { PaginaMestiere } from "../../tipi";

export const falegname: PaginaMestiere = {
  meta: {
    titolo: "Preventivo falegname a voce, dal tuo listino",
    descrizione:
      "Il preventivo falegname nasce dal tuo racconto: armadi a muro, porte interne, scale e montaggi, con i prezzi del tuo listino. Il cliente accetta online.",
  },
  nome: "Falegname",
  riga: "Armadi a muro, librerie su misura, porte interne, scale, rivestimenti e montaggi.",
  h1: "Preventivo falegname: racconti il rilievo, la bozza esce col tuo listino",
  sottotitolo:
    "Armadi su misura, porte interne, scale e rivestimenti in legno. Finito il rilievo lo racconti come lo diresti in laboratorio: la bozza prende i prezzi solo dal tuo listino e ti chiede quello che non hai detto.",
  esempio: {
    titolo: "Dal rilievo alla bozza",
    intro:
      "Un armadio a muro, quattro porte, una scala da rivestire e una cucina da montare, segnati con il metro ancora in tasca. Accanto vedi l'armadio a metro quadro di fronte, i gradini contati a pezzo, il corrimano a metro, la cucina della cliente come solo montaggio e la domanda sulle mensole.",
    lavoro: "Camera, corridoio e scala interna, casa su due piani",
    dettatura:
      "Segno quello che abbiamo visto dalla signora Barbieri. In camera un armadio a muro nella nicchia, più o meno due e quaranta di larghezza per due e sessanta di altezza, ante scorrevoli in rovere e l'interno attrezzato. In corridoio cambio tre porte a battente, laccate bianche, e la quarta la faccio scorrevole a scomparsa, il controtelaio c'è già. La scala di legno la rivesto: sono quattordici gradini, pedata e alzata, e poi il corrimano, una quindicina di metri fra scala e soppalco. Sul soppalco una libreria su misura, tre metri per due e venti. In cucina vuole anche delle mensole in rovere, quante non l'ha ancora deciso. La cucina l'ha comprata lei, io la monto e taglio il top per lavello e fuochi. La tinteggiatura dopo i lavori non la faccio, la fa l'imbianchino.",
  },
  voci: {
    titolo: "Le voci tipiche di un preventivo da falegname",
    intro:
      "Metà del lavoro si fa in laboratorio e metà in casa: per questo le righe di un falegname mescolano metri quadri di fronte, pezzi, metri di corrimano e montaggi. Il prezzo per essenza e finitura è il tuo e arriva dal tuo listino; un'essenza che non hai a listino resta da prezzare.",
    righe: [
      { voce: "Armadio a muro su misura, ante a battente", unita: "m²", nota: "Si conta sul fronte, larghezza per altezza. Scrivi essenza o finitura delle ante: è lì che il cliente confronta." },
      { voce: "Armadio a muro su misura, ante scorrevoli", unita: "m²", nota: "Binari e guide fanno la differenza: scrivi se sono a vista o incassati e di che tipo." },
      { voce: "Attrezzatura interna armadio", unita: "cad", nota: "Cassettiere, ripiani, bastoni, scarpiere: ogni pezzo a parte, così il cliente toglie o aggiunge senza rifare tutto." },
      { voce: "Libreria su misura", unita: "m²", nota: "A metro quadro di fronte, con il numero di ripiani dentro la riga. Se cambia, cambia il conto." },
      { voce: "Porta interna a battente, fornitura e posa", unita: "cad", nota: "Con telaio, coprifili e ferramenta. Per l'IVA è un infisso interno: vedi più sotto." },
      { voce: "Porta scorrevole a scomparsa, sola anta", unita: "cad", nota: "Quando il controtelaio è già murato. Se va messo, è un'altra riga." },
      { voce: "Controtelaio per porta a scomparsa", unita: "cad", nota: "La muratura del controtelaio di solito non è tua: scrivi chi la fa." },
      { voce: "Posa porta interna fornita dal cliente", unita: "cad", nota: "Solo posa e regolazione. Il materiale è suo, e lo scrivi." },
      { voce: "Rivestimento gradino in legno, pedata e alzata", unita: "cad", nota: "A gradino, con l'essenza e lo spessore. I gradini a ventaglio meritano una voce a parte." },
      { voce: "Corrimano in legno", unita: "m", nota: "A metro, con i supporti a muro. Scrivi se le curve sono comprese." },
      { voce: "Rivestimento a parete in doghe di legno", unita: "m²", nota: "Boiserie e perline. Scrivi se il listello di supporto è compreso." },
      { voce: "Battiscopa in legno", unita: "m", nota: "Fornitura e posa, o solo posa se il battiscopa l'ha preso il cliente." },
      { voce: "Montaggio cucina componibile fornita dal cliente", unita: "m", nota: "A metro di composizione. Pensili, colonne e elettrodomestici da incasso: dillo nella riga." },
      { voce: "Taglio e posa piano di lavoro", unita: "cad", nota: "Con i fori per lavello e piano cottura. Se il top è in pietra, di solito il taglio non è tuo." },
      { voce: "Regolazione e riparazione ante e porte", unita: "h", nota: "Cerniere, guide, serrature: lavoro a ore, quando non sai in anticipo quanto ci vuole." },
      { voce: "Smontaggio e smaltimento mobili esistenti", unita: "corpo", nota: "Il cliente tende a darlo per compreso. Scrivilo, compreso o escluso." },
    ],
  },
  prezzare: {
    titolo: "Come si prezza un lavoro da falegname",
    intro:
      "Nel su misura il prezzo dipende da cose che il cliente non vede: il pannello, l'essenza, la ferramenta, le ore in laboratorio. Il preventivo deve fargliele vedere, altrimenti confronta il tuo armadio con quello di un mobilificio.",
    punti: [
      {
        titolo: "A metro quadro di fronte",
        testo:
          "Armadi e librerie si prezzano quasi sempre sulla superficie frontale, larghezza per altezza. Gli interni conviene tenerli fuori, pezzo per pezzo: il cliente vede cosa paga e, se vuole spendere meno, toglie una cassettiera invece di chiederti lo sconto.",
      },
      {
        titolo: "Le misure del sopralluogo",
        testo:
          "Le misure prese il primo giorno quasi mai sono quelle del taglio, soprattutto se pavimenti e intonaci non sono finiti. Scrivi che il prezzo si conferma con il rilievo definitivo, così una nicchia che cresce di qualche centimetro non diventa una discussione.",
      },
      {
        titolo: "Essenza e finitura",
        testo:
          "Massello, impiallacciato, laccato opaco o lucido: per il cliente è sempre «legno». Metti l'essenza e la finitura dentro la riga, e nel listino tieni voci separate. Il confronto con un altro preventivo diventa onesto.",
      },
      {
        titolo: "La ferramenta",
        testo:
          "Cerniere ammortizzate, guide a estrazione totale, sistemi per scorrevoli: cambiano il prezzo e la durata del mobile. Scrivi che tipo usi. Le maniglie, se le sceglie il cliente, mettile fra le esclusioni.",
      },
      {
        titolo: "Il mobile comprato dal cliente",
        testo:
          "Cucine prese all'ingrosso, porte ordinate su internet: la riga diventa solo montaggio. Scrivi che pezzi mancanti o rovinati del fornitore non sono tuoi, perché è la prima cosa che ti chiederanno di sistemare gratis.",
      },
      {
        titolo: "L'acconto sul su misura",
        testo:
          "Un pannello tagliato per quella nicchia non lo rivendi a nessuno. Scrivi nel preventivo quando chiedi l'acconto e quando parte il taglio: il cliente lo capisce, se lo legge prima.",
      },
    ],
  },
  documenti: {
    titolo: "IVA, norme e contratti da tenere presenti",
    intro:
      "Per il falegname le regole fiscali non sono quelle del muratore: una porta e un armadio, nello stesso lavoro, possono seguire strade diverse. Queste sono le cose che tornano più spesso.",
    punti: [
      {
        titolo: "Porte interne e beni significativi",
        testo:
          "Cambiare le porte di un'abitazione è manutenzione, al 10%, ma le porte interne sono infissi interni, che il DM 29/12/1999 mette fra i beni significativi: il 10% vale per la porta solo fino al valore del resto del lavoro, e la parte che supera va al 22%. In fattura il valore della porta va indicato a parte (circolare 15/E del 2018). Se la porta la produci tu, nel suo valore entrano materiali e manodopera di laboratorio, non quella di posa. Se nel listino la segni come bene significativo, la bozza ti chiede quel valore per ogni riga e con quel dato divide l'IVA.",
      },
      {
        titolo: "Mobili su misura e IVA",
        testo:
          "L'aliquota ridotta riguarda i lavori di manutenzione sulle abitazioni, non la vendita di beni finiti. Per armadi, librerie e cucine, anche su misura, non dare per scontato il 10%: fatti dire dal commercialista quale aliquota usare, e scrivila così nel listino.",
      },
      {
        titolo: "Inversione contabile",
        testo:
          "Con un cliente impresa, la sola posa di porte e infissi rientra nei lavori di completamento degli edifici, che vanno in inversione contabile. La circolare 14/E del 2015 però esclude la posa di arredi. E se vendi un bene con la posa come parte accessoria, è una cessione di beni e l'inversione contabile non si applica. Il sistema oggi non calcola l'inversione contabile: per la sola posa a un'impresa controlla il totale prima di mandarlo.",
      },
      {
        titolo: "Recesso e lavori su misura",
        testo:
          "Se il contratto con un privato si firma fuori dalla tua bottega, per esempio a casa sua, il cliente di regola può recedere. L'articolo 59 del Codice del consumo esclude però il recesso per la fornitura di beni confezionati su misura o chiaramente personalizzati. L'eccezione non vale se il contratto nasce da una tua visita che il cliente non aveva chiesto (art. 59, comma 1-bis). Se il tuo lavoro ci rientra, chiarisci con un consulente come scriverlo nel preventivo.",
      },
    ],
    avvertenza:
      "Sono indicazioni generali per aiutarti a scrivere un preventivo più chiaro. Sul tuo caso l'ultima parola spetta al commercialista o al consulente legale, anche perché regole e interpretazioni cambiano.",
  },
  straniero: {
    titolo: "Su misura per clienti stranieri",
    testo:
      "Chi arreda un appartamento per gli affitti brevi o una seconda casa vuole capire perché un armadio su misura costa più di uno del mobilificio, e lo vuole leggere nella sua lingua. Il preventivo può partire in inglese, tedesco, francese, spagnolo o olandese, con essenze, finiture e ferramenta tradotte, l'italiano che fa fede e il modulo di recesso nella sua lingua. Tu lo controlli in italiano.",
  },
  domande: {
    titolo: "Domande dai falegnami",
    voci: [
      {
        d: "L'armadio lo prezzo a metro quadro, gli interni a pezzo. Si può fare nella stessa bozza?",
        r: "Sì. Ogni riga ha la sua unità: il fronte a metro quadro, cassettiere e ripiani a numero. Se dici «due e quaranta per due e sessanta», il sistema rifà il conto nell'unità della voce che hai nel listino.",
      },
      {
        d: "Nel listino ho prezzi diversi per rovere, noce e laccato. Come sceglie?",
        r: "Tieni una voce per ogni essenza o finitura, e nel racconto dici quale. Se il sistema non trova la voce giusta non ne prende una a caso: la riga resta da prezzare, evidenziata, e il prezzo lo metti tu.",
      },
      {
        d: "Le porte interne le faccio io in laboratorio. Che valore metto per l'IVA?",
        r: "Il costo di produzione: materiali e ore di laboratorio, senza la posa e senza il tuo ricarico. È il dato che la bozza ti chiede per ogni porta segnata come bene significativo, e da lì divide fra 10% e 22%. L'avviso di verificare con il commercialista resta sempre.",
      },
      {
        d: "Un armadio su misura ha l'IVA al 10% come le porte?",
        r: "Non darlo per scontato: il 10% riguarda i lavori di manutenzione sulla casa, e un mobile su misura può essere trattato come una vendita di beni. Fatti dire dal commercialista l'aliquota giusta prima di mandare il preventivo.",
      },
      {
        d: "Il mio listino è scritto a mano su un quaderno del laboratorio.",
        r: "Va bene anche così: ne fai una foto e le voci vengono lette. Prima di usarle le controlli una per una, e correggi quelle lette male.",
      },
      {
        d: "Chiedo l'acconto prima di tagliare i pannelli. Dove lo scrivo?",
        r: "Nelle condizioni di pagamento, nei dati dell'impresa: compaiono su ogni PDF e il cliente le accetta insieme al preventivo. Scrivile brevi, con la percentuale e il momento in cui parte il taglio.",
      },
      {
        d: "La scala ha anche dei gradini a ventaglio. Li metto insieme agli altri?",
        r: "Meglio di no: un gradino a ventaglio costa più di uno dritto. Tieni due voci a listino e nel racconto di' quanti sono gli uni e gli altri, così escono su due righe separate.",
      },
    ],
  },
};
