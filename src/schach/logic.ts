import type { Status, Zug, Position, Figur, Brett } from "./types";

export { istKorrekterZug, zugAnwenden };

function istKorrekterZug(zug: Zug, status: Status): boolean {
  // TODO
  if (status.amZug !== zug.figur.farbe) return false;
  if (zug.figur.art === "bauer") return istKorrekterBauernZug(zug, status.brett);
  if (zug.figur.art === "pferd") return istKorrekterPferdeZug(zug);
  return true;
}

function zugAnwenden(zug: Zug, { ...status }: Status): Status {
  console.log("Wir machen einen zug!", zug);
  status.brett[zug.von.reihe]![zug.von.spalte] = undefined;
  status.brett[zug.nach.reihe]![zug.nach.spalte] = zug.figur;
  ändereAmZug(status);
  return status;
}

function ändereAmZug(status: Status) {
  if (status.amZug === "b") status.amZug = "w";
  else status.amZug = "b";
}

function istKorrekterBauernZug(zug: Zug, brett: Brett): boolean {
  if (zug.von.reihe + 1 == zug.nach.reihe) {
    if (zug.figur.farbe == "w") {
      if (zug.von.spalte === zug.nach.spalte) {
        if (brett[zug.von.reihe + 1]![zug.von.spalte] === undefined) return true
      }
      if (Math.abs(zug.nach.spalte - zug.von.spalte) === 1) {
        if (brett[zug.nach.reihe]![zug.nach.spalte] !== undefined) return true
      }
    }
  }
  if (zug.von.reihe - 1 == zug.nach.reihe) {
    if (zug.figur.farbe == "b") {
      if (zug.von.spalte === zug.nach.spalte) {
        if (brett[zug.von.reihe - 1]![zug.von.spalte] !== undefined) return true
      }
      if (Math.abs(zug.nach.spalte - zug.von.spalte) === 1) {
        if (brett[zug.nach.reihe]![zug.nach.spalte] !== undefined) return true
      }
    }
  }
  return false
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
