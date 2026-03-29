import { figurAuf, notation, spiel } from "../schach/notation.ts";
import { test } from "node:test";
import { assert } from "../schach/utils.ts";

test("En Passant", () => {
  let status = spiel(["e4", "a5", "e5", "d5"]);
  assert(status.enpassant !== false, "En Passant sollte möglich sein.");
  assert(notation(status.enpassant) === "d6", "En Passant Position sollte d6 sein.");
  status = spiel(["exd6"], status);
  assert(figurAuf("d5", status.brett) === undefined, "Feld d5 sollte nach En Passant geschlagen sein.");
});
