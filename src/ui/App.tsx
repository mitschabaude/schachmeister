import type { Brett } from "../schach/types";
import { Chessboard } from "./Chessboard";

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
] satisfies Brett;

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f9f7f3,#e0d4c3_60%,#b69b82)] p-8">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center text-stone-700">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-800">Schachmeister</h1>
          <p className="mt-2 text-base text-stone-600">Das Brett steht bereit – die Partie kann warten.</p>
        </div>
        <Chessboard brett={startBrett} amZug="w" />
      </div>
    </div>
  );
}

export default App;
