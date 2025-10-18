import type { Brett, Figur } from "../schach/types";

type ChessboardProps = {
  brett: Brett;
};

const pieceSymbols: Record<Figur["art"], Record<Figur["farbe"], string>> = {
  bauer: { w: "♙", b: "♟" },
  laeufer: { w: "♗", b: "♝" },
  pferd: { w: "♘", b: "♞" },
  turm: { w: "♖", b: "♜" },
  dame: { w: "♕", b: "♛" },
  koenig: { w: "♔", b: "♚" },
};

export function Chessboard({ brett }: ChessboardProps) {
  return (
    <div
      className="grid [grid-template-columns:repeat(8,4rem)] [grid-template-rows:repeat(8,4rem)] overflow-hidden rounded-xl border-4 border-slate-900 shadow-[0_6px_20px_rgba(0,0,0,0.2)]"
      role="grid"
      aria-label="Schachbrett"
    >
      {brett.map((reihe, reihenIndex) =>
        reihe.map((feld, spaltenIndex) => {
          const istDunkel = (reihenIndex + spaltenIndex) % 2 === 1;
          const symbol = feld !== undefined ? pieceSymbols[feld.art][feld.farbe] : "";

          const ariaLabel =
            feld !== undefined
              ? `Feld ${reihenIndex + 1}-${spaltenIndex + 1}: ${
                  feld.farbe === "w" ? "weiße" : "schwarze"
                } ${feld.art}`
              : `Feld ${reihenIndex + 1}-${spaltenIndex + 1}: leer`;

          return (
            <div
              key={`${reihenIndex}-${spaltenIndex}`}
              className={`flex items-center justify-center text-[3rem] leading-none select-none transition-transform duration-100 hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] ${
                istDunkel
                  ? "bg-[#b58863] focus-visible:outline-amber-300"
                  : "bg-[#f0d9b5] focus-visible:outline-amber-400"
              }`}
              role="gridcell"
              aria-label={ariaLabel}
            >
              {symbol}
            </div>
          );
        }),
      )}
    </div>
  );
}
