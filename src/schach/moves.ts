/**
 * Helper-Funktionen um Schachzuege in Standard-Notation ("e4", "Sf3", ...) in `Zug`-Objekte zu uebersetzen.
 */
import type { Zug, FigurArt, Status } from "./types.ts";

export { parseZug };

let spalten = ["a", "b", "c", "d", "e", "f", "g", "h"];
let zeilen = ["1", "2", "3", "4", "5", "6", "7", "8"];

let figuren: Record<string, FigurArt> = {
  K: "koenig",
  D: "dame",
  T: "turm",
  L: "laeufer",
  S: "pferd",
};

function parseZug(zug: string, status: Status): Zug {
  if (zug.length !== 3 && zug.length !== 2) throw Error(`Ungültiger Zug: ${zug}`);
  let figur: FigurArt;
  if (zug.length == 2) figur = "bauer";
  else {
    let f = figuren[zug[0]!];
    if (f === undefined) throw Error("Ungültige Figur: " + zug[0]);
    figur = f;
    zug = zug.slice(1);
  }
}
