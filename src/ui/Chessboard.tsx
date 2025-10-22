import type { Brett, Figur, Status } from "../schach/types";

const pieceFontStack =
  '"Noto Sans Symbols","DejaVu Sans","Segoe UI Symbol","Noto Sans","sans-serif"';
const asTextGlyph = (symbol: string) => `${symbol}\uFE0E`;

const pieceSymbols: Record<Figur["art"], Record<Figur["farbe"], string>> = {
  bauer: { w: asTextGlyph("♟"), b: asTextGlyph("♟") },
  laeufer: { w: asTextGlyph("♝"), b: asTextGlyph("♝") },
  pferd: { w: asTextGlyph("♞"), b: asTextGlyph("♞") },
  turm: { w: asTextGlyph("♜"), b: asTextGlyph("♜") },
  dame: { w: asTextGlyph("♛"), b: asTextGlyph("♛") },
  koenig: { w: asTextGlyph("♚"), b: asTextGlyph("♚") },
};

export function Chessboard({ brett }: Status) {
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
          const pieceColorClass =
            feld !== undefined ? (feld.farbe === "w" ? "text-white" : "text-slate-900") : "";

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
              {feld !== undefined ? (
                <span
                  className={`leading-none drop-shadow-[0_0_2px_rgba(15,23,42,0.55)] ${pieceColorClass}`}
                  style={{
                    color: feld.farbe === "w" ? "#ffffff" : "#0f172a",
                    fontFamily: pieceFontStack,
                    fontVariant: "normal",
                    WebkitTextFillColor: feld.farbe === "w" ? "#ffffff" : "#0f172a",
                  }}
                  aria-hidden="true"
                >
                  {symbol}
                </span>
              ) : null}
            </div>
          );
        }),
      )}
    </div>
  );
}
