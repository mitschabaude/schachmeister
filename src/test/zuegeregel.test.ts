import { parseZug, spiel } from "../schach/notation.ts";
import { test } from "node:test";
import { assert } from "../schach/utils.ts";
import { istKorrekterZug } from "../schach/logic.ts";

test("50-Zuege-Regel", () => {
  let vierZuege = ["Sf3", "Sf6", "Sg1", "Sg8"];
  let zuege = [];
  for (let i = 0; i < 12; i++) zuege.push(...vierZuege);
  let status = spiel(zuege);
  assert(status.istBeendet === false, "Nach 48 Zuegen ist noch nichts passiert.");
  status = spiel(["Sf3", "Sf6"], status);
  assert(status.istBeendet === "50-zuege-regel", "Nach 50 Zuegen ist das Spiel vorbei.");
  // weiterer zug ist nicht korrekt
  let ok = istKorrekterZug(parseZug("e4", status), status);
  assert(!ok, "Kein korrekter Zug");
});
