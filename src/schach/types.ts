export type { Figur, Brett, Status, Zug, Position, Feld, UmwandlungsFigurArt };
export { startBrett, startStatus };

type FigurArt = "bauer" | "laeufer" | "pferd" | "turm" | "dame" | "koenig";
type Farbe = "w" | "b";

type Figur = {
  art: FigurArt;
  farbe: Farbe;
};

type Feld = Figur | undefined;

/**
 * Das Schachbrett ist ein 8x8 Array von Figuren oder leeren Feldern.
 * Wir verwenden `undefined`, um ein leeres Feld darzustellen.
 *
 * Beispiel:
 * [ [undefined, undefined, ...], // 8 Felder in der ersten Reihe
 *   [undefined, { art: "bauer", farbe: "w" }, ...], // 8 Felder in der zweiten Reihe
 *   ... // Reihen 3 bis 7
 *   [ { art: "koenig", farbe: "b" }, undefined, ...]  // 8 Felder in der achten Reihe
 * ]
 */
type Brett = [
  [Feld, Feld, Feld, Feld, Feld, Feld, Feld, Feld],
  [Feld, Feld, Feld, Feld, Feld, Feld, Feld, Feld],
  [Feld, Feld, Feld, Feld, Feld, Feld, Feld, Feld],
  [Feld, Feld, Feld, Feld, Feld, Feld, Feld, Feld],
  [Feld, Feld, Feld, Feld, Feld, Feld, Feld, Feld],
  [Feld, Feld, Feld, Feld, Feld, Feld, Feld, Feld],
  [Feld, Feld, Feld, Feld, Feld, Feld, Feld, Feld],
  [Feld, Feld, Feld, Feld, Feld, Feld, Feld, Feld],
];

type Status = {
  /** das aktuelle brett */
  brett: Brett;
  /** farbe die am zug ist */
  amZug: Farbe;
  /** falls gerade ein bauer umgewandelt wird, ist dies seine position */
  bauernUmwandlung: false | Position;
  enpassant: false | Position;
};

// 0 bis 7 für Reihen und Spalten
type Position = { reihe: number; spalte: number };

type Zug = {
  figur: Figur;
  von: Position;
  nach: Position;
};

type UmwandlungsFigurArt = "laeufer" | "pferd" | "turm" | "dame";

const startBrett: Brett = [
  [
    { art: "turm", farbe: "b" },
    { art: "pferd", farbe: "b" },
    { art: "laeufer", farbe: "b" },
    { art: "dame", farbe: "b" },
    { art: "koenig", farbe: "b" },
    { art: "laeufer", farbe: "b" },
    { art: "pferd", farbe: "b" },
    { art: "turm", farbe: "b" },
  ],
  [
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
    { art: "bauer", farbe: "b" },
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
    { art: "bauer", farbe: "w" },
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

const startStatus: Status = {
  brett: startBrett,
  amZug: "w",
  bauernUmwandlung: false,
  enpassant: false,
};
