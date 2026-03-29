import type { Status, Zug, Position, Figur, Brett, Feld, UmwandlungsFigurArt } from "./types";

export { istKorrekterZug, zugAnwenden, bauerUmwandeln };

function istKorrekterZug(zug: Zug, status: Status): boolean {
  let { brett } = status;
  // kein zug wenn bauernumwandlung
  if (status.bauernUmwandlung !== false) return false;

  // man darf nur mit der farbe fahren die dran ist
  if (status.amZug !== zug.figur.farbe) return false;

  // man darf seine eigene figur nicht schlagen
  if (zug.figur.farbe === zielFeld(zug, brett)?.farbe) return false;

  if (zug.figur.art === "bauer") return istKorrekterBauernZug(zug, status);
  if (zug.figur.art === "pferd") return istKorrekterPferdeZug(zug);
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
  // TODO BUG
  if (zug.nach == status.enpassant) {
    if (zug.figur.farbe == "w") status.brett[zug.nach.reihe - 1]![zug.nach.spalte] = undefined;
    if (zug.figur.farbe == "b") status.brett[zug.nach.reihe + 1]![zug.nach.spalte] = undefined;
  }
  if (raufRunterDistanz(zug) !== 2 || zug.figur.art !== "bauer") {
    status.enpassant = false;
  }
  ändereAmZug(status);
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

function ändereAmZug(status: Status) {
  if (status.amZug === "b") status.amZug = "w";
  else status.amZug = "b";
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
      if (zug.von.reihe == 1) return true;
    }
  }
  if (zug.von.reihe - 2 == zug.nach.reihe) {
    if (zug.figur.farbe == "w") {
      if (zug.von.reihe == 6) return true;
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

function selbePosition(pos1: Position | false, pos2: Position): boolean {
  if (pos1 === false) return false;
  return pos1.reihe === pos2.reihe && pos1.spalte === pos2.spalte;
}
