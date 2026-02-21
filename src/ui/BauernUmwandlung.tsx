import type { UmwandlungsFigurArt } from "../schach/types";

const umwandlungsOptionen: { art: UmwandlungsFigurArt; label: string; symbol: { w: string; b: string } }[] = [
  { art: "dame", label: "Dame", symbol: { w: "♛\uFE0E", b: "♛\uFE0E" } },
  { art: "turm", label: "Turm", symbol: { w: "♜\uFE0E", b: "♜\uFE0E" } },
  { art: "laeufer", label: "Läufer", symbol: { w: "♝\uFE0E", b: "♝\uFE0E" } },
  { art: "pferd", label: "Pferd", symbol: { w: "♞\uFE0E", b: "♞\uFE0E" } },
];

export function BauernUmwandlung({
  farbe,
  onWahl,
}: {
  farbe: "w" | "b";
  onWahl: (figur: UmwandlungsFigurArt) => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2" role="group" aria-label="Bauernumwandlung">
      <p className="text-sm sm:text-base font-medium text-stone-700">Bauer umwandeln in:</p>
      <div className="flex gap-2">
        {umwandlungsOptionen.map(({ art, label, symbol }) => (
          <button
            key={art}
            onClick={() => onWahl(art)}
            aria-label={`Umwandlung in ${label}`}
            className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-lg border-2 border-stone-400 bg-[#f0d9b5] text-3xl sm:text-4xl shadow-md transition-all hover:scale-110 hover:border-stone-600 hover:shadow-lg active:scale-95"
          >
            <span className={farbe === "w" ? "text-white drop-shadow-[0_0_2px_rgba(15,23,42,0.55)]" : "text-slate-900"}>
              {symbol[farbe]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
