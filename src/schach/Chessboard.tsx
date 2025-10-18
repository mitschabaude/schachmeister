import type { Brett, Figur } from './types';
import './Chessboard.css';

type ChessboardProps = {
  brett: Brett;
};

const pieceSymbols: Record<Figur['art'], Record<Figur['farbe'], string>> = {
  bauer: { w: '♙', b: '♟' },
  laeufer: { w: '♗', b: '♝' },
  pferd: { w: '♘', b: '♞' },
  turm: { w: '♖', b: '♜' },
  dame: { w: '♕', b: '♛' },
  koenig: { w: '♔', b: '♚' },
};

export function Chessboard({ brett }: ChessboardProps) {
  return (
    <div className="chessboard" role="grid" aria-label="Schachbrett">
      {brett.map((reihe, reihenIndex) =>
        reihe.map((feld, spaltenIndex) => {
          const istDunkel = (reihenIndex + spaltenIndex) % 2 === 1;
          const symbol =
            feld !== undefined ? pieceSymbols[feld.art][feld.farbe] : '';

          const ariaLabel =
            feld !== undefined
              ? `Feld ${reihenIndex + 1}-${spaltenIndex + 1}: ${
                  feld.farbe === 'w' ? 'weiße' : 'schwarze'
                } ${feld.art}`
              : `Feld ${reihenIndex + 1}-${spaltenIndex + 1}: leer`;

          return (
            <div
              key={`${reihenIndex}-${spaltenIndex}`}
              className={`square ${istDunkel ? 'square--dark' : 'square--light'}`}
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
