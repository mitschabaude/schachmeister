import { notation, spiel } from "../schach/notation.ts";
import { test } from "node:test";
import { assert, assertError } from "../schach/utils.ts";
import { koenigsFeld } from "../schach/logic.ts";

test("Koenigsfeld", () => {
  let status = spiel([]);
  assert(notation(koenigsFeld("w", status.brett)) === "e1", "Koenigsfeld sollte e1 sein");
  status = spiel(["e4", "e5", "Ke2"], status);
  assert(notation(koenigsFeld("w", status.brett)) === "e2", "Koenigsfeld sollte e1 sein");
});
