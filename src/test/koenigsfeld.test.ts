import { notation, spiel } from "../schach/notation.ts";
import { test } from "node:test";
import { assert, assertError } from "../schach/utils.ts";
import { koenigsFeld } from "../schach/logic.ts";

test("Koenigsfeld", () => {
  let status = spiel([]);
  assert(notation(koenigsFeld("w", status.brett)) === "e1", "Koenigsfeld sollte e1 sein");
  status = spiel(["Kxe8"], status);
  assertError(() => koenigsFeld("b", status.brett), "Kein Koenig vorhanden?!");
});
