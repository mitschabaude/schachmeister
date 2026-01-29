import type { Status, Zug, Position, Figur } from "./types";

export { istKorrekterZug, zugAnwenden };

function istKorrekterZug(zug: Zug, status: Status): boolean {
  // TODO
  if (status.amZug !== zug.figur.farbe) return false;
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
