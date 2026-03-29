import { zugAnwenden } from "../schach/logic";
import { parseZug } from "../schach/notation";
import { startStatus, type Status } from "../schach/types";
import { test, expect } from "vitest";

function spiel(zuege: string[], start: Status = startStatus): Status {
  let status = start;
  for (let zugnotation of zuege) {
    let zug = parseZug(zugnotation, status);
    status = zugAnwenden(zug, status);
  }
  return status;
}

test("En Passant", () => {
  let status = spiel(["e4", "a5", "e5", "d5"]);
  expect(status.enpassant).toEqual({ reihe: 3, spalte: 3 });
  status = spiel(["exd6"], status);
  expect(status.brett[3]![3]).toBeUndefined();
});
