import type { Status, Zug, Position, Brett, Feld, UmwandlungsFigurArt } from "./types";
import { selbeFigur, selbePosition } from "./utils.ts";

export { istKorrekterZug, zugAnwenden, bauerUmwandeln };

function istKorrekterZug(zug: Zug, status: Status): boolean {
  let { brett } = status;
  // kein zug wenn bauernumwandlung
  if (status.bauernUmwandlung !== false) return false;

  // man darf nur mit der farbe fahren die dran ist
  if (status.amZug !== zug.figur.farbe) return false;

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
  return true;
}

function zugAnwenden(zug: Zug, { ...status }: Status): Status {
  console.log("[DEBUG] Zug anwenden", zug);
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
  return status;
}

function bauerUmwandeln(figur: UmwandlungsFigurArt, { ...status }: Status): Status {
  let { brett, bauernUmwandlung } = status;
  if (bauernUmwandlung === false) return status;
  let bauer = feld(bauernUmwandlung, brett);
  if (bauer === undefined) throw Error("invalider status: bauernumwandlung von leerem feld");
  setzeFeld(bauernUmwandlung, brett, { art: figur, farbe: bauer.farbe });
  status.bauernUmwandlung = false;
  return status;
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
  if (zug.von.reihe + 2 == zug.nach.reihe) {
    if (zug.figur.farbe == "b") {
      if (zug.von.reihe == 1) {
        if (zug.von.spalte == zug.nach.spalte) return true;
      }
    }
  }
  if (zug.von.reihe - 2 == zug.nach.reihe) {
    if (zug.figur.farbe == "w") {
      if (zug.von.reihe == 6) {
        if (zug.von.spalte == zug.nach.spalte) return true;
      }
    }
  }
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
  //if ( TurmschlagtdurchFigur) return false

  // TODO gib das weg wenn fertig
  return true;
}

function istKorrekterDameZug(zug: Zug, brett: Brett): boolean {
  return istKorrekterTurmZug(zug, brett) || istKorrekterLaeuferzug(zug, brett);
}

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
    // wenn eine figur auf dem feld steht, faehrt der laeufer hindurch -> falsch
    if (feld(pos, brett) !== undefined) return false;
    pos = schrittInRichtung(pos, richtung);
  }
  return true;
}

function istKorrekterLaeuferzug(zug: Zug, brett: Brett) {
  if (linksRechtsDistanz(zug) !== raufRunterDistanz(zug)) return false;
  return schlaegtNichtDurchFigur(brett, zug);
}
