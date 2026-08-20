import type {
  Status,
  Zug,
  Position,
  Brett,
  Feld,
  Farbe,
  UmwandlungsFigurArt,
  FigurMitPosition,
  Stellung,
} from "./types";
import {
  andereFarbe,
  feldFarbe,
  figurenMitPositionen,
  selbeFigur,
  selbePosition,
  selbeStellung,
} from "./utils.ts";

export { istKorrekterZug, istKorrekterZugOhneSchach, zugAnwenden, bauerUmwandeln, koenigsFeld, istSchach };

function istKorrekterZug(zug: Zug, status: Status) {
  if (status.istBeendet !== false) return false;
  // man darf nur mit der farbe fahren die dran ist
  if (status.amZug !== zug.figur.farbe) return false;

  // nur korrekte zuege je nach figur
  if (!istKorrekterZugOhneSchach(zug, status)) return false;

  // man darf nicht so fahren, dass man danach im schach steht
  let amZug = status.amZug;
  status = zugAnwendenOhneSchach(zug, status);
  if (istSchach(amZug, status)) return false;
  return true;
}

function istKorrekterZugOhneSchach(zug: Zug, status: Status): boolean {
  let { brett } = status;
  // man darf seine eigene figur nicht schlagen
  // dies verhindert auch gar nicht zu fahren!
  if (zug.figur.farbe === zielFeld(zug, brett)?.farbe) return false;

  // das start-feld muss die angegebene figur enthalten
  let startFeld = feld(zug.von, brett);
  if (!selbeFigur(startFeld, zug.figur)) return false;

  if (zug.figur.art === "bauer") return istKorrekterBauernZug(zug, status);
  if (zug.figur.art === "pferd") return istKorrekterPferdeZug(zug);
  if (zug.figur.art === "laeufer") return istKorrekterLaeuferzug(zug, status.brett);
  if (zug.figur.art === "turm") return istKorrekterTurmZug(zug, status.brett);
  if (zug.figur.art === "dame") return istKorrekterDameZug(zug, status.brett);
  if (zug.figur.art === "koenig") return istKorrekterKoenigZug(zug, status);
  return true;
}

function zugAnwenden(zug: Zug, status: Status): Status {
  let schlaegt = feld(zug.nach, status.brett) !== undefined;
  status = zugAnwendenOhneSchach(zug, status);
  if (zug.figur.art !== "bauer" && !schlaegt) {
    status.zuegeRegel++;
  } else {
    status.zuegeRegel = 0;
  }
  console.log(status.zuegeRegel);
  status.istSchach = istSchach(status.amZug, status);
  status.istBeendet = istBeendetCheck(status);
  if (zug.figur.art == "koenig") {
    if (zug.figur.farbe == "w") {
      status.rochade.weisseRochade.linkeRochade = undefined;
      status.rochade.weisseRochade.rechteRochade = undefined;
    } else {
      status.rochade.schwarzeRochade.linkeRochade = undefined;
      status.rochade.schwarzeRochade.rechteRochade = undefined;
    }
  }
  if (selbePosition(zug.von, { reihe: 0, spalte: 0 }) || selbePosition(zug.nach, { reihe: 0, spalte: 0 })) {
    status.rochade.schwarzeRochade.linkeRochade = undefined;
  }
  if (selbePosition(zug.von, { reihe: 0, spalte: 7 }) || selbePosition(zug.nach, { reihe: 0, spalte: 7 })) {
    status.rochade.schwarzeRochade.rechteRochade = undefined;
  }
  if (selbePosition(zug.von, { reihe: 7, spalte: 0 }) || selbePosition(zug.nach, { reihe: 7, spalte: 0 })) {
    status.rochade.weisseRochade.linkeRochade = undefined;
  }
  if (selbePosition(zug.von, { reihe: 7, spalte: 7 }) || selbePosition(zug.nach, { reihe: 7, spalte: 7 })) {
    status.rochade.weisseRochade.rechteRochade = undefined;
  }
  if (stellungZufuegen(status) == 3) {
    status.istBeendet = "gleiche-stellung";
  }
  return status;
}

function zugAnwendenOhneSchach(zug: Zug, status: Status): Status {
  status = structuredClone(status);
  let { weisseRochade, schwarzeRochade } = status.rochade;
  if (istKorrekteRochade(zug, status)) {
    if (zug.figur.art == "koenig") {
      if (weisseRochade.linkeRochade !== undefined && selbePosition(zug.nach, weisseRochade.linkeRochade)) {
        status.brett[7][0] = undefined;
        status.brett[7][3] = { art: "turm", farbe: "w" };
      }
      if (weisseRochade.rechteRochade !== undefined && selbePosition(zug.nach, weisseRochade.rechteRochade)) {
        status.brett[7][7] = undefined;
        status.brett[7][5] = { art: "turm", farbe: "w" };
      }
      if (
        schwarzeRochade.linkeRochade !== undefined &&
        selbePosition(zug.nach, schwarzeRochade.linkeRochade)
      ) {
        status.brett[0][0] = undefined;
        status.brett[0][3] = { art: "turm", farbe: "b" };
      }
      if (
        schwarzeRochade.rechteRochade !== undefined &&
        selbePosition(zug.nach, schwarzeRochade.rechteRochade)
      ) {
        status.brett[0][7] = undefined;
        status.brett[0][5] = { art: "turm", farbe: "b" };
      }
    }
  }
  if (zug.figur.art == "bauer") {
    if (zug.figur.farbe == "b" && zug.nach.reihe == 7) status.bauernUmwandlung = zug.nach;
    if (zug.figur.farbe == "w" && zug.nach.reihe == 0) status.bauernUmwandlung = zug.nach;
    if (raufRunterDistanz(zug) == 2)
      status.enpassant = { reihe: (zug.von.reihe + zug.nach.reihe) / 2, spalte: zug.von.spalte };
  }
  status.brett[zug.von.reihe]![zug.von.spalte] = undefined;
  status.brett[zug.nach.reihe]![zug.nach.spalte] = zug.figur;
  if (selbePosition(status.enpassant, zug.nach)) {
    if (zug.figur.farbe == "w") status.brett[zug.nach.reihe + 1]![zug.nach.spalte] = undefined;
    if (zug.figur.farbe == "b") status.brett[zug.nach.reihe - 1]![zug.nach.spalte] = undefined;
  }
  if (raufRunterDistanz(zug) !== 2 || zug.figur.art !== "bauer") {
    status.enpassant = false;
  }
  // wenn schwarz am zug, kommt weiss an den zug und umgekehrt
  if (status.amZug === "b") status.amZug = "w";
  else status.amZug = "b";
  // wenn nach dem
  return status;
}

function bauerUmwandeln(figur: UmwandlungsFigurArt, status: Status): Status {
  status = structuredClone(status);
  let { brett, bauernUmwandlung } = status;
  if (bauernUmwandlung === false) return status;
  let bauer = feld(bauernUmwandlung, brett);
  if (bauer === undefined) throw Error("invalider status: bauernumwandlung von leerem feld");
  setzeFeld(bauernUmwandlung, brett, { art: figur, farbe: bauer.farbe });
  status.bauernUmwandlung = false;
  status.istSchach = istSchach(status.amZug, status);
  status.istBeendet = istBeendetCheck(status);
  return status;
}

function istBeendetCheck(status: Status): Status["istBeendet"] {
  let schachmatt = istSchachmattOderPatt(status.amZug, status);
  if (schachmatt !== false) return schachmatt;
  if (istToteStellung(status)) return "tote-stellung";
  if (status.zuegeRegel == 50) return "50-zuege-regel";
  return false;
}

function istKorrekterBauernZug(zug: Zug, status: Status): boolean {
  let { brett } = status;
  if (zug.von.reihe - 1 == zug.nach.reihe) {
    if (zug.figur.farbe == "w") {
      if (zug.von.spalte === zug.nach.spalte) {
        if (brett[zug.von.reihe - 1]![zug.von.spalte] === undefined) return true;
      }
      if (linksRechtsDistanz(zug) === 1) {
        if (zielFeld(zug, brett) !== undefined) return true;
        if (selbePosition(status.enpassant, zug.nach)) return true;
      }
    }
  }
  if (zug.von.reihe + 1 == zug.nach.reihe) {
    if (zug.figur.farbe == "b") {
      if (zug.von.spalte === zug.nach.spalte) {
        if (brett[zug.von.reihe + 1]![zug.von.spalte] === undefined) return true;
      }
      if (linksRechtsDistanz(zug) === 1) {
        if (zielFeld(zug, brett) !== undefined) return true;
        if (selbePosition(status.enpassant, zug.nach)) return true;
      }
    }
  }
  if (
    zug.von.reihe + 2 == zug.nach.reihe &&
    zug.figur.farbe == "b" &&
    zug.von.reihe == 1 &&
    zug.von.spalte == zug.nach.spalte &&
    zielFeld(zug, brett) == undefined
  )
    return true;
  if (
    zug.von.reihe - 2 == zug.nach.reihe &&
    zug.figur.farbe == "w" &&
    zug.von.reihe == 6 &&
    zug.von.spalte == zug.nach.spalte &&
    zielFeld(zug, brett) == undefined
  )
    return true;
  return false;
}

function istKorrekterPferdeZug(zug: Zug): boolean {
  return (
    (raufRunterDistanz(zug) === 2 && linksRechtsDistanz(zug) === 1) ||
    (linksRechtsDistanz(zug) === 2 && raufRunterDistanz(zug) === 1)
  );
}

function raufRunterDistanz(zug: Zug) {
  return Math.abs(zug.von.reihe - zug.nach.reihe);
}

function linksRechtsDistanz(zug: Zug) {
  return Math.abs(zug.von.spalte - zug.nach.spalte);
}

function zielFeld(zug: Zug, brett: Brett): Feld {
  return feld(zug.nach, brett);
}

function feld(position: Position, brett: Brett): Feld {
  return brett[position.reihe]![position.spalte];
}

function setzeFeld(position: Position, brett: Brett, feld: Feld) {
  brett[position.reihe]![position.spalte] = feld;
}

function istKorrekterTurmZug(zug: Zug, brett: Brett): boolean {
  let bleibtReiheGleich = zug.von.reihe === zug.nach.reihe;
  let bleibtSpalteGleich = zug.von.spalte === zug.nach.spalte;
  if (!(bleibtReiheGleich || bleibtSpalteGleich)) return false;
  return schlaegtNichtDurchFigur(brett, zug);
}

function istKorrekterLaeuferzug(zug: Zug, brett: Brett) {
  if (linksRechtsDistanz(zug) !== raufRunterDistanz(zug)) return false;
  return schlaegtNichtDurchFigur(brett, zug);
}

function istKorrekterDameZug(zug: Zug, brett: Brett): boolean {
  return istKorrekterTurmZug(zug, brett) || istKorrekterLaeuferzug(zug, brett);
}

/** reihe und spalte sind -1, 0 oder 1 */
type Richtung = { reihe: number; spalte: number };

function findeRichtung(zug: Zug): Richtung {
  return {
    reihe: Math.sign(zug.nach.reihe - zug.von.reihe),
    spalte: Math.sign(zug.nach.spalte - zug.von.spalte),
  };
}

function schrittInRichtung(pos: Position, richtung: Richtung): Position {
  return { reihe: pos.reihe + richtung.reihe, spalte: pos.spalte + richtung.spalte };
}

function schlaegtNichtDurchFigur(brett: Brett, zug: Zug): boolean {
  let richtung = findeRichtung(zug);
  // wir gehen der reihe nach alle positionen zwischen start und zielfeld durch
  let pos = schrittInRichtung(zug.von, richtung);
  while (!selbePosition(pos, zug.nach)) {
    // wenn eine figur auf dem feld steht, faehrt die figur hindurch -> falsch
    if (feld(pos, brett) !== undefined) return false;
    pos = schrittInRichtung(pos, richtung);
  }
  return true;
}

function koenigsFeld(farbe: Farbe, brett: Brett): Position {
  let koenigMitPosition = figurenMitPositionen(farbe, brett).find(
    (figurMitPosition) => figurMitPosition.figur.art === "koenig",
  );
  let pos = koenigMitPosition?.pos;
  if (pos === undefined) throw Error("Kein Koenig vorhanden?!");
  return pos;
}

function istKorrekterKoenigZug(zug: Zug, status: Status): boolean {
  if (istKorrekteRochade(zug, status)) {
    return true;
  }
  return raufRunterDistanz(zug) < 2 && linksRechtsDistanz(zug) < 2;
}

function istSchachAufFeld(position: Position, farbe: Farbe, status: Status): boolean {
  let istSchach = false;
  figurenMitPositionen(andereFarbe(farbe), status.brett).forEach((figur) => {
    let zug: Zug = { figur: figur.figur, von: figur.pos, nach: position };
    let istKorrekt = istKorrekterZugOhneSchach(zug, status);
    if (istKorrekt) istSchach = true;
  });
  return istSchach;
}

function istSchach(farbe: Farbe, status: Status): boolean {
  let koenig = koenigsFeld(farbe, status.brett);
  return istSchachAufFeld(koenig, farbe, status);
}

function istSchachmattOderPatt(farbe: Farbe, status: Status): false | "schachmatt" | "patt" {
  let istSchachmattOderPatt: false | "schachmatt" | "patt" = "schachmatt";
  let moeglicherZug: Zug | undefined = undefined;
  figurenMitPositionen(farbe, status.brett).forEach((figur) => {
    if (!istSchachmattOderPatt) return;
    for (let reihe = 0; reihe < 8; reihe++) {
      for (let spalte = 0; spalte < 8; spalte++) {
        let zug: Zug = {
          figur: figur.figur,
          von: figur.pos,
          nach: { reihe, spalte },
        };
        let istKorrekt = istKorrekterZug(zug, status);
        if (istKorrekt) {
          moeglicherZug = zug;
          istSchachmattOderPatt = false;
          return;
        }
      }
    }
  });
  if (istSchachmattOderPatt === "schachmatt" && !status.istSchach) {
    istSchachmattOderPatt = "patt";
  }
  return istSchachmattOderPatt;
}

function moeglicheFelder(status: Status, figurMitPosition: FigurMitPosition): Position[] {
  let korrektePositionen: Position[] = [];
  for (let reihe = 0; reihe < 8; reihe++) {
    for (let spalte = 0; spalte < 8; spalte++) {
      let zug: Zug = { figur: figurMitPosition.figur, von: figurMitPosition.pos, nach: { reihe, spalte } };
      let istKorrekt = istKorrekterZug(zug, status);
      if (istKorrekt) {
        korrektePositionen.push({ reihe, spalte });
      }
    }
  }
  return korrektePositionen;
}

function istKorrekteRochade(zug: Zug, status: Status): boolean {
  if (zug.figur.farbe == "w") {
    if (selbePosition(status.rochade.weisseRochade.linkeRochade ?? false, zug.nach)) {
      if (
        !istSchach("w", status) &&
        !istSchachAufFeld({ reihe: zug.von.reihe, spalte: zug.von.spalte - 1 }, "w", status)
      ) {
        if (
          schlaegtNichtDurchFigur(status.brett, zug) &&
          schlaegtNichtDurchFigur(status.brett, {
            figur: { art: "turm", farbe: "w" },
            von: { reihe: 7, spalte: 0 },
            nach: { reihe: 7, spalte: 3 },
          })
        ) {
          return true;
        }
      }
    }
    if (selbePosition(status.rochade.weisseRochade.rechteRochade ?? false, zug.nach)) {
      if (
        !istSchach("w", status) &&
        !istSchachAufFeld({ reihe: zug.von.reihe, spalte: zug.von.spalte + 1 }, "w", status)
      ) {
        if (
          schlaegtNichtDurchFigur(status.brett, zug) &&
          schlaegtNichtDurchFigur(status.brett, {
            figur: { art: "turm", farbe: "w" },
            von: { reihe: 7, spalte: 7 },
            nach: { reihe: 7, spalte: 5 },
          })
        ) {
          return true;
        }
      }
    }
  } else {
    if (selbePosition(status.rochade.schwarzeRochade.linkeRochade ?? false, zug.nach)) {
      if (
        !istSchach("b", status) &&
        !istSchachAufFeld({ reihe: zug.von.reihe, spalte: zug.von.spalte - 1 }, "b", status)
      ) {
        if (
          schlaegtNichtDurchFigur(status.brett, zug) &&
          schlaegtNichtDurchFigur(status.brett, {
            figur: { art: "turm", farbe: "w" },
            von: { reihe: 0, spalte: 0 },
            nach: { reihe: 0, spalte: 3 },
          })
        ) {
          return true;
        }
      }
    }
    if (selbePosition(status.rochade.schwarzeRochade.rechteRochade ?? false, zug.nach)) {
      if (
        !istSchach("b", status) &&
        !istSchachAufFeld({ reihe: zug.von.reihe, spalte: zug.von.spalte + 1 }, "b", status)
      ) {
        if (
          schlaegtNichtDurchFigur(status.brett, zug) &&
          schlaegtNichtDurchFigur(status.brett, {
            figur: { art: "turm", farbe: "w" },
            von: { reihe: 0, spalte: 7 },
            nach: { reihe: 0, spalte: 5 },
          })
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

/*
K vs K                     => tote Stellung
K + laeufer vs K           => tote Stellung
K + pferd vs K             => tote Stellung

K + pferd + pferd vs K     => NICHT tot

K + laeufer vs
K + laeufer,
beide gleiche Feldfarbe    => tot
K + laeufer + laeufer, beide gleiche Feldfarbe vs
K => tot

K + laeufer vs
K + laeufer,
verschiedene Feldfarben    => NICHT notwendigerweise tot
K + laeufer + laeufer, verschiedene Feldfarben vs
K => NICHT tot

K + pferd vs K + bauer     => NICHT tot
K + laeufer vs K + pferd   => NICHT tot
*/
function istToteStellung(status: Status) {
  let figW = figurenMitPositionen("w", status.brett);
  let figB = figurenMitPositionen("b", status.brett);
  if (figW.length == 1 && figB.length == 1) {
    return true;
  }
  if (
    figW.some((figur) => figur.figur.art == "bauer" || figur.figur.art == "dame" || figur.figur.art == "turm")
  ) {
    return false;
  }
  if (
    figB.some((figur) => figur.figur.art == "bauer" || figur.figur.art == "dame" || figur.figur.art == "turm")
  ) {
    return false;
  }
  if ((figW.length == 1 && figB.length == 2) || (figB.length == 1 && figW.length == 2)) {
    return true;
  }
  let obAlleWeiss: boolean = true;
  let obAlleSchwarz: boolean = true;
  let laeuferB = figB.filter((figur) => figur.figur.art == "laeufer");
  let laeuferW = figW.filter((figur) => figur.figur.art == "laeufer");
  let laeufer = laeuferW.concat(laeuferB);
  laeufer.forEach((pos) => {
    if (feldFarbe(pos.pos) == "b") {
      obAlleWeiss = false;
    }
  });

  laeufer.forEach((pos) => {
    if (feldFarbe(pos.pos) == "w") {
      obAlleSchwarz = false;
    }
  });
  if (obAlleSchwarz || obAlleWeiss) {
    return true;
  }
  return false;
}

function stellungZufuegen(status: Status) {
  let stellung = status.stellungRegel.find((el) => selbeStellung(el.stellung, status));
  if (stellung == undefined) {
    status.stellungRegel.push({ stellung: statusZuStellung(status), anzahl: 1 });
    return 1;
  } else {
    stellung.anzahl++;
    return stellung.anzahl;
  }
}

function statusZuStellung({ brett, amZug, enpassant, rochade }: Status): Stellung {
  return structuredClone({ brett, amZug, enpassant, rochade });
}
