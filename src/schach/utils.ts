import type { Position, Figur, Brett, Farbe, FigurMitPosition } from "./types";

export {
  assert,
  selbePosition,
  selbeFigur,
  assertError,
  figurenMitPositionen,
  andereFarbe,
  arrayRemove,
  feldFarbe,
};

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw Error(message);
}

function assertError(fn: () => void, message: string) {
  try {
    fn();
    assert(false, "Fehler: kein Fehler");
  } catch (err: any) {
    if (err.message === message) {
      // gut
    } else throw err;
  }
}

function selbePosition(pos1: Position | false, pos2: Position): boolean {
  if (pos1 === false) return false;
  return pos1.reihe === pos2.reihe && pos1.spalte === pos2.spalte;
}

function selbeFigur(feld: Figur | undefined, figur: Figur): boolean {
  if (feld === undefined) return false;
  return feld.art === figur.art && feld.farbe === figur.farbe;
}

function figurenMitPositionen(farbe: Farbe, brett: Brett): FigurMitPosition[] {
  let figuren: FigurMitPosition[] = [];

  brett.forEach((reihe, i) => {
    reihe.forEach((feld, j) => {
      let pos: Position = { reihe: i, spalte: j };
      if (feld !== undefined && feld.farbe === farbe) {
        figuren.push({ figur: feld, pos });
      }
    });
  });

  return figuren;
}

function andereFarbe(farbe: Farbe) {
  return farbe === "b" ? "w" : "b";
}

function arrayRemove<T>(arr: T[], bedingung: (t: T) => boolean) {
  let i = arr.findIndex(bedingung);
  // wenn kein element mit der bedingung existiert, passiert nichts
  if (i == -1) return;
  arr.splice(i, 1);
}

function feldFarbe(pos: Position): Farbe {
  if ((pos.reihe + pos.spalte) % 2 == 0) return "w";
  else return "b";
}
