import type { Status, Zug, Position, Figur, Brett } from "./types";

export { istKorrekterZug, zugAnwenden };

function istKorrekterZug(zug: Zug, status: Status): boolean {
  // TODO
  if (status.amZug !== zug.figur.farbe) return false;
  if (zug.figur.art === "bauer") return istKorrekterBauernZug(zug, status.brett);
  return true;
}

function zugAnwenden(zug: Zug, { ...status }: Status): Status {
  console.log("Wir machen einen zug!", zug);
  status.brett[zug.von.reihe]![zug.von.spalte] = undefined;
  status.brett[zug.nach.reihe]![zug.nach.spalte] = zug.figur;
  ändereAmZug(status)
  return status
}

function ändereAmZug(status: Status) {
  if (status.amZug === "b") status.amZug = "w"
  else status.amZug = "b"
}

function istKorrekterBauernZug(zug: Zug, brett: Brett): boolean {
  if (zug.von.reihe + 1 == zug.nach.reihe) {
    if (zug.figur.farbe == "w") { }
  }
  if (zug.von.reihe - 1 == zug.nach.reihe) {
    if (zug.figur.farbe == "b") {
      if (zug.von.spalte === zug.nach.spalte) {
        if (brett[zug.von.reihe + 1]![zug.von.spalte]) return true
      }
      if (zug.nach.spalte === zug.von.spalte + 1 || zug.nach.spalte === zug.von.spalte - 1) { }
    }
  }
}