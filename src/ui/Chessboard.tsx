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
      className="grid w-full max-w-[min(100vw-2rem,100vh-2rem,32rem)] aspect-square grid-cols-8 grid-rows-8 overflow-hidden rounded-xl border-4 border-slate-900 shadow-[0_6px_20px_rgba(0,0,0,0.2)] touch-none"
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
      onTouchEnd={(e) => {
        if (gezogeneFigur === undefined) {
          setGezogeneFigur(undefined);
          return;
        }

        // Get the final touch position
        const touch = e.changedTouches[0];
        if (!touch) {
          setGezogeneFigur(undefined);
          return;
        }

        // Find the element at the touch end position
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        const gridcell = element?.closest('[role="gridcell"]') as HTMLElement | null;

        if (gridcell) {
          const reihe = gridcell.getAttribute("data-reihe");
          const spalte = gridcell.getAttribute("data-spalte");

          if (reihe !== null && spalte !== null) {
            onMove({
              von: gezogeneFigur.pos,
              nach: { reihe: parseInt(reihe), spalte: parseInt(spalte) },
              figur: gezogeneFigur.figur,
            });
          }
        }

        setGezogeneFigur(undefined);
      }}
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

          return (
            <div
              key={`${reihenIndex}-${spaltenIndex}`}
              data-reihe={reihenIndex}
              data-spalte={spaltenIndex}
              className={`flex items-center justify-center leading-none select-none transition-transform duration-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] ${
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
            >
              {feld !== undefined ? (
                <span
                  className={`leading-none drop-shadow-[0_0_2px_rgba(15,23,42,0.55)] ${pieceColorClass} ${
                    istGezogen ? "text-[min(2.5rem,10vw)]" : "text-[min(3rem,12vw)]"
                  }`}
                  aria-hidden="true"
                  style={{
                    transform: istGezogen
                      ? `translate(${gezogeneFigur.x}px, ${gezogeneFigur.y}px)`
                      : undefined,
                    pointerEvents: istGezogen ? "none" : undefined,
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
