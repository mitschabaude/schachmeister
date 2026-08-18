import type { Position, Figur, Brett, Farbe, FigurMitPosition, Stellung, Feld, Rochade } from "./types";

export {
  assert,
  selbePosition,
  selbeFigur,
  assertError,
  figurenMitPositionen,
  andereFarbe,
  arrayRemove,
  feldFarbe,
  selbeStellung,
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

function selbePosition(pos1: Position | false | undefined, pos2: Position | undefined): boolean {
  if (pos1 === false) return false;
  if (pos1 === undefined || pos2 === undefined) return pos1 === pos2;
  return pos1.reihe === pos2.reihe && pos1.spalte === pos2.spalte;
}

function selbeFigur(figur1: Figur | undefined, figur2: Figur | undefined): boolean {
  if (figur1 === undefined || figur2 === undefined) return figur1 === figur2;
  return figur1.art === figur2.art && figur1.farbe === figur2.farbe;
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

function selbeStellung(stellung1: Stellung, stellung2: Stellung): boolean {
  return (
    selbesBrett(stellung1.brett, stellung2.brett) &&
    stellung1.amZug === stellung2.amZug &&
    selbesEnPassant(stellung1.enpassant, stellung1.enpassant) &&
    selbeRochade(stellung1.rochade, stellung2.rochade)
  );
}

function selbesBrett(brett1: Brett, brett2: Brett) {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (!selbeFigur(brett1[i]![j], brett2[i]![j])) return false;
    }
  }
  return true;
}

function selbesEnPassant(enPassant1: Position | false, enPassant2: Position | false) {
  if (enPassant2 === false) return enPassant1 === false;
  return selbePosition(enPassant1, enPassant2);
}

function selbeRochade(rochade1: Rochade, rochade2: Rochade) {
  return (
    selbePosition(rochade1.weisseRochade.linkeRochade, rochade2.weisseRochade.linkeRochade) &&
    selbePosition(rochade1.weisseRochade.rechteRochade, rochade2.weisseRochade.rechteRochade) &&
    selbePosition(rochade1.schwarzeRochade.linkeRochade, rochade2.schwarzeRochade.linkeRochade) &&
    selbePosition(rochade1.schwarzeRochade.rechteRochade, rochade2.schwarzeRochade.rechteRochade)
  );
}
