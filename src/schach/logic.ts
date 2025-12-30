import type { Status, Zug, Position, Figur } from "./types";

export { istKorrekterZug, zugAnwenden };

function istKorrekterZug(zug: Zug, status: Status): boolean {
  // TODO
  return true;
}

function zugAnwenden(zug: Zug, status: Status): Status {
  // TODO
  console.log("Wir machen einen zug!", zug);
  return status;
}
