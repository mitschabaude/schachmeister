import { useState } from "react";
import type { Figur, Status, Zug, Position } from "../schach/types.ts";
const asTextGlyph = (symbol: string) => `${symbol}\uFE0E`;

const pieceSymbols: Record<Figur["art"], Record<Figur["farbe"], string>> = {
  bauer: { w: asTextGlyph("♟"), b: asTextGlyph("♟") },
  laeufer: { w: asTextGlyph("♝"), b: asTextGlyph("♝") },
  pferd: { w: asTextGlyph("♞"), b: asTextGlyph("♞") },
  turm: { w: asTextGlyph("♜"), b: asTextGlyph("♜") },
  dame: { w: asTextGlyph("♛"), b: asTextGlyph("♛") },
  koenig: { w: asTextGlyph("♚"), b: asTextGlyph("♚") },
};

export function Chessboard({ status, onMove }: { status: Status; onMove: (zug: Zug) => void }) {
  let { brett } = status;
  let [gezogeneFigur, setGezogeneFigur] = useState<
    { figur: Figur; pos: Position; x: number; y: number; startX: number; startY: number } | undefined
  >(undefined);

  const handleMove = (pageX: number, pageY: number) => {
    if (gezogeneFigur !== undefined) {
      let x = pageX - gezogeneFigur.startX;
      let y = pageY - gezogeneFigur.startY;
      setGezogeneFigur({
        pos: gezogeneFigur.pos,
        figur: gezogeneFigur.figur,
        x,
        y,
        startX: gezogeneFigur.startX,
        startY: gezogeneFigur.startY,
      });
    }
  };

  return (
    <div
      className="grid [grid-template-columns:repeat(8,4rem)] [grid-template-rows:repeat(8,4rem)] overflow-hidden rounded-xl border-4 border-slate-900 shadow-[0_6px_20px_rgba(0,0,0,0.2)]"
      role="grid"
      aria-label="Schachbrett"
      onMouseMove={(e) => handleMove(e.pageX, e.pageY)}
      onTouchMove={(e) => {
        if (gezogeneFigur !== undefined && e.touches[0]) {
          e.preventDefault();
          handleMove(e.touches[0].pageX, e.touches[0].pageY);
        }
      }}
      onMouseLeave={() => setGezogeneFigur(undefined)}
      onTouchEnd={() => setGezogeneFigur(undefined)}
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

          const istGezogen =
            gezogeneFigur !== undefined &&
            gezogeneFigur.pos.reihe === reihenIndex &&
            gezogeneFigur.pos.spalte === spaltenIndex;

          const textSize = istGezogen ? "2.5rem" : "3rem";

          return (
            <div
              key={`${reihenIndex}-${spaltenIndex}`}
              className={`flex items-center justify-center leading-none select-none transition-transform duration-100 hover:scale-105 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] ${
                istDunkel
                  ? "bg-[#b58863] focus-visible:outline-amber-300"
                  : "bg-[#f0d9b5] focus-visible:outline-amber-400"
              }`}
              role="gridcell"
              aria-label={ariaLabel}
              onMouseUp={() => {
                // TODO versuche echten zug zu machen
                if (gezogeneFigur === undefined) return;
                onMove({
                  von: gezogeneFigur.pos,
                  nach: { reihe: reihenIndex, spalte: spaltenIndex },
                  figur: gezogeneFigur.figur,
                });
                setGezogeneFigur(undefined);
              }}
              onTouchEnd={(e) => {
                if (gezogeneFigur === undefined) return;
                e.preventDefault();
                onMove({
                  von: gezogeneFigur.pos,
                  nach: { reihe: reihenIndex, spalte: spaltenIndex },
                  figur: gezogeneFigur.figur,
                });
                setGezogeneFigur(undefined);
              }}
            >
              {feld !== undefined ? (
                <span
                  className={`leading-none drop-shadow-[0_0_2px_rgba(15,23,42,0.55)] ${pieceColorClass}`}
                  aria-hidden="true"
                  style={{
                    fontSize: textSize,
                    transform: istGezogen
                      ? `translate(${gezogeneFigur.x}px, ${gezogeneFigur.y}px)`
                      : undefined,
                  }}
                  onMouseDown={(e) => {
                    let pos = { reihe: reihenIndex, spalte: spaltenIndex };
                    setGezogeneFigur({
                      pos,
                      figur: feld,
                      x: 0,
                      y: 0,
                      startX: e.pageX,
                      startY: e.pageY,
                    });
                  }}
                  onTouchStart={(e) => {
                    if (!e.touches[0]) return;
                    e.preventDefault();
                    let pos = { reihe: reihenIndex, spalte: spaltenIndex };
                    setGezogeneFigur({
                      pos,
                      figur: feld,
                      x: 0,
                      y: 0,
                      startX: e.touches[0].pageX,
                      startY: e.touches[0].pageY,
                    });
                  }}
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
