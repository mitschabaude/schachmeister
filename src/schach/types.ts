export type {
  Farbe,
  Figur,
  FigurArt,
  Brett,
  Status,
  Zug,
  Position,
  Feld,
  UmwandlungsFigurArt,
  FigurMitPosition,
  Stellung,
  Rochade,
};
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
  /** ist gerade fuer die aktuelle farbe schach? */
  istSchach: boolean;
  /** falls gerade ein bauer umgewandelt wird, ist dies seine position */
  bauernUmwandlung: false | Position;
  enpassant: false | Position;
  rochade: Rochade;
  istBeendet: false | "schachmatt" | "patt" | "tote-stellung" | "50-zuege-regel" | "gleiche-stellung";
  zuegeRegel: number;
  stellungRegel: { stellung: Stellung; anzahl: number }[];
};

type Stellung = { brett: Brett; amZug: Farbe; enpassant: false | Position; rochade: Rochade };

// 0 bis 7 für Reihen und Spalten
type Position = { reihe: number; spalte: number };

type Zug = {
  figur: Figur;
  von: Position;
  nach: Position;
};

type EineRochade = { linkeRochade: Position | undefined; rechteRochade: Position | undefined };

type Rochade = { weisseRochade: EineRochade; schwarzeRochade: EineRochade };

type UmwandlungsFigurArt = "laeufer" | "pferd" | "turm" | "dame";

type FigurMitPosition = { figur: Figur; pos: Position };

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

const startRochade: Rochade = {
  weisseRochade: {
    linkeRochade: { reihe: 7, spalte: 2 },
    rechteRochade: { reihe: 7, spalte: 6 },
  },
  schwarzeRochade: {
    linkeRochade: { reihe: 0, spalte: 2 },
    rechteRochade: { reihe: 0, spalte: 6 },
  },
};

const startStatus: Status = {
  brett: startBrett,
  amZug: "w",
  istSchach: false,
  bauernUmwandlung: false,
  enpassant: false,
  rochade: startRochade,
  istBeendet: false,
  zuegeRegel: 0,
  stellungRegel: [
    {
      stellung: structuredClone({
        brett: startBrett,
        amZug: "w",
        enpassant: false,
        rochade: {
          weisseRochade: {
            linkeRochade: {
              reihe: 7,
              spalte: 2,
            },
            rechteRochade: {
              reihe: 7,
              spalte: 6,
            },
          },
          schwarzeRochade: {
            linkeRochade: {
              reihe: 0,
              spalte: 2,
            },
            rechteRochade: {
              reihe: 0,
              spalte: 6,
            },
          },
        },
      }),
      anzahl: 1,
    },
  ],
};
