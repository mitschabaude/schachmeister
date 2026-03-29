import type { Brett, Status } from "../schach/types";

/**
 * Ein Test-Status bei dem ein weißer Bauer Reihe 0 (Spalte 4) erreicht hat
 * und auf Umwandlung wartet.
 */
const testBrett: Brett = [
  [
    { art: "turm", farbe: "b" },
    { art: "pferd", farbe: "b" },
    { art: "laeufer", farbe: "b" },
    { art: "dame", farbe: "b" },
    { art: "bauer", farbe: "w" },
    { art: "laeufer", farbe: "b" },
    { art: "pferd", farbe: "b" },
    { art: "turm", farbe: "b" },
  ],
  [
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
    undefined,
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
  ],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  [
    { art: "bauer", farbe: "w" },
    { art: "bauer", farbe: "w" },
    { art: "bauer", farbe: "w" },
    { art: "bauer", farbe: "w" },
    undefined,
    { art: "bauer", farbe: "w" },
    { art: "bauer", farbe: "w" },
    { art: "bauer", farbe: "w" },
  ],
  [
    { art: "turm", farbe: "w" },
    { art: "pferd", farbe: "w" },
    { art: "laeufer", farbe: "w" },
    { art: "dame", farbe: "w" },
    { art: "koenig", farbe: "w" },
    { art: "laeufer", farbe: "w" },
    { art: "pferd", farbe: "w" },
    { art: "turm", farbe: "w" },
  ],
];

export const bauernUmwandlungStatus: Status = {
  brett: testBrett,
  amZug: "b",
  bauernUmwandlung: { reihe: 0, spalte: 4 },
  enpassant: false,
};
