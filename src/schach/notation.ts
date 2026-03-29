/**
 * Helper-Funktion um Schachzuege in Standard-Notation in `Zug`-Objekte zu uebersetzen.
 *
 * Dies ermoeglicht uns, einen Spielstand konzis durch eine Abfolge von Zuegen in Notation zu erzeugen.
 */
import { istKorrekterZug, zugAnwenden } from "./logic.ts";
import {
  type Zug,
  type FigurArt,
  type Status,
  type Position,
  type Figur,
  type Brett,
  startStatus,
} from "./types.ts";
import { selbePosition } from "./utils.ts";

export { parseZug, parseFeld, notation, figurAuf, spiel };

let spalten = ["a", "b", "c", "d", "e", "f", "g", "h"];
let zeilen = ["8", "7", "6", "5", "4", "3", "2", "1"];

let figuren: Record<string, FigurArt> = {
  K: "koenig",
  D: "dame",
  T: "turm",
  L: "laeufer",
  S: "pferd",
};

/**
 * Uebersetzt eine Position in Zeilen/Spalten-Notation (z.B. { reihe: 0, spalte: 0 }) in die Standard-Notation (z.B. "a8").
 */
function notation(position: Position): string {
  return spalten[position.spalte]! + zeilen[position.reihe]!;
}

/**
 * Uebersetzt eine Feld-Notation z.B. "a8" => { reihe: 0, spalte: 0 }.
 */
function parseFeld(position: string): Position {
  if (position.length !== 2) throw Error(`Ungültige Position: "${position}".`);
  let spalte = spalten.indexOf(position[0]!);
  let reihe = zeilen.indexOf(position[1]!);
  if (spalte === -1 || reihe === -1) throw Error(`Ungültige Position: "${position}".`);
  return { reihe, spalte };
}

/**
 * Die Figur auf einem Feld, angegeben durch Notation
 */
function figurAuf(position: string, brett: Brett): Figur | undefined {
  let pos = parseFeld(position);
  return brett[pos.reihe]![pos.spalte];
}

/**
 * Erzeugt einen Spielstand durch Anwenden einer Abfolge von Zuegen in Notation.
 * Beginnend von einem Start-Status (default: Anfangsstellung).
 */
function spiel(zuege: string[], start: Status = startStatus): Status {
  let status = start;
  for (let zugnotation of zuege) {
    let zug = parseZug(zugnotation, status);
    status = zugAnwenden(zug, status);
  }
  return status;
}

/**
 * Uebersetzt eine Zug-Notation (z.B. "e4", "exd5", "Sf3", "Sgf3", "0-0") in ein `Zug`-Objekt.
 *
 * Invariante: Der zurückgegebene Zug ist korrekt für den gegebenen Status,
 * d.h. `istKorrekterZug(parseZug(notation, status), status) === true`.
 *
 * TODO: Unterstuetze "+" fuer Schach und "#" fuer Schachmatt.
 */
function parseZug(zugnotation: string, status: Status): Zug {
  // die farbe sehen wir aus dem status
  let farbe = status.amZug;
  let original = zugnotation;

  // rochade
  if (zugnotation === "0-0" || zugnotation === "0-0-0") {
    let reihe = farbe === "w" ? 7 : 0;
    let spalte = zugnotation === "0-0" ? 6 : 2;
    let zug: Zug = {
      figur: { art: "koenig", farbe },
      von: { reihe, spalte: 4 },
      nach: { reihe, spalte },
    };
    let ok = istKorrekterZug(zug, status);
    if (!ok) ungueltigAufgrundStatus(original, "Rochade ist nicht erlaubt.");
    return zug;
  }

  // das erste zeichen gibt die figur an, ausser bei bauern
  if (zugnotation.length < 1) ungueltig(original, "Zu wenige Zeichen.");
  let art: FigurArt = figuren[zugnotation[0]!] ?? "bauer";
  if (art !== "bauer") zugnotation = zugnotation.slice(1);
  let figur: Figur = { art, farbe };

  // die letzten 2 zeichen geben die ziel-position an, z.B. "f3"
  // wir extrahieren und validieren diese position zuerst
  if (zugnotation.length < 2) ungueltig(original, "Zu wenige Zeichen.");
  let zielSpalte = zugnotation[zugnotation.length - 2]!;
  let zielZeile = zugnotation[zugnotation.length - 1]!;
  zugnotation = zugnotation.slice(0, -2);
  let zielSpalteIndex = spalten.indexOf(zielSpalte!);
  let zielZeileIndex = zeilen.indexOf(zielZeile!);
  if (zielSpalteIndex === -1 || zielZeileIndex === -1) ungueltig(original, "Ungültige Ziel-Position.");
  let ziel: Position = { reihe: zielZeileIndex, spalte: zielSpalteIndex };

  // in der mitte gibt es noch:
  // - ein optionales zeichen fuer die start-spalte (z.B. "Sgf3" => springer von g nach f3)
  // - ein optionales "x" fuer schlaege (z.B. "exd5")
  // wir extrahieren zuerst das x
  let istSchlag = false;
  if (zugnotation.endsWith("x")) {
    istSchlag = true;
    zugnotation = zugnotation.slice(0, -1);
  }
  // validiere: x ist genau dann vorhanden, wenn auf dem ziel-feld eine figur steht
  let zielFigur = status.brett[ziel.reihe]![ziel.spalte];
  if (istSchlag && zielFigur === undefined && !selbePosition(status.enpassant, ziel))
    ungueltig(original, "Schlag (x) auf leeres Feld.");
  if (!istSchlag && zielFigur !== undefined) ungueltig(original, "Ziel-Feld besetzt, aber x fehlt.");

  // wenn es jetzt noch ein zeichen gibt, muss es die start-spalte sein
  let startSpalte: number | undefined = undefined;
  if (zugnotation.length === 1) {
    startSpalte = spalten.indexOf(zugnotation[0]!);
    if (startSpalte === -1) ungueltig(original, "Ungültige Start-Spalte.");
    zugnotation = zugnotation.slice(1);
  }
  // mehr zeichen sind nicht erlaubt
  if (zugnotation.length > 0) ungueltig(original, "Zu viele Zeichen.");

  // die start-position muss aus dem aktuellen brett ermittelt werden,
  // z.B. "Sf3" => finde springer von der aktuellen farbe, der nach f3 ziehen kann
  // => wir loopen durch passende figuren (art + farbe) und testen ob der zug moeglich ist
  console.log("[DEBUG] Notation", figur, ziel, istSchlag, startSpalte);
  for (let startPosition of positionenVonFigur(figur, status.brett)) {
    if (startSpalte !== undefined && startPosition.spalte !== startSpalte) continue;
    let zug: Zug = { figur, von: startPosition, nach: ziel };
    let ok = istKorrekterZug(zug, status);
    if (ok) return zug;
  }
  // wenn kein passendes startfeld gefunden wurde, ist die notation ungueltig
  ungueltigAufgrundStatus(original, "Kein passendes Startfeld gefunden.");
}

function positionenVonFigur(figur: Figur, brett: Brett): Position[] {
  let positionen: Position[] = [];
  for (let reihe = 0; reihe < 8; reihe++) {
    for (let spalte = 0; spalte < 8; spalte++) {
      let figurAufFeld = brett[reihe]![spalte];
      if (
        figurAufFeld !== undefined &&
        figurAufFeld.art === figur.art &&
        figurAufFeld.farbe === figur.farbe
      ) {
        positionen.push({ reihe, spalte });
      }
    }
  }
  return positionen;
}

function ungueltig(zug: string, nachricht: string): never {
  throw Error(`Ungültiger Zug: "${zug}". ${nachricht}`);
}

function ungueltigAufgrundStatus(zug: string, nachricht: string): never {
  throw Error(`Ungültiger Zug: "${zug}" für aktuellen Status. ${nachricht}`);
}
