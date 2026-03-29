import type { Position, Figur, Feld } from "./types";

export { assert, selbePosition, selbeFigur };

function assert(condition: boolean, message: string): asserts condition {
  if (!condition) throw Error(message);
}

function selbePosition(pos1: Position | false, pos2: Position): boolean {
  if (pos1 === false) return false;
  return pos1.reihe === pos2.reihe && pos1.spalte === pos2.spalte;
}

function selbeFigur(feld: Figur | undefined, figur: Figur): boolean {
  if (feld === undefined) return false;
  return feld.art === figur.art && feld.farbe === figur.farbe;
}
