import { useState } from "react";
import { startStatus, type Status, type Zug } from "../schach/types";
import type { UmwandlungsFigurArt } from "../schach/types";
import { Chessboard } from "./Chessboard";
import { BauernUmwandlung } from "./BauernUmwandlung";
import { istKorrekterZug, zugAnwenden, bauerUmwandeln } from "../schach/logic";

function App() {
  let [status, setStatus] = useState<Status>(startStatus);

  function onMove(zug: Zug) {
    if (istKorrekterZug(zug, status)) {
      setStatus(zugAnwenden(zug, status));
    } else {
      console.log("Ungültiger Zug", zug);
    }
  }

  function onUmwandlung(figur: UmwandlungsFigurArt) {
    setStatus(bauerUmwandeln(figur, status));
  }

  let farbe = status.amZug === "w" ? "Weiß" : "Schwarz";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f9f7f3,#e0d4c3_60%,#b69b82)] p-4 sm:p-8">
      <div className="flex w-full max-w-xl flex-col items-center gap-4 sm:gap-6 text-center text-stone-700">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-800">Schachmeister</h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600">{farbe} am Zug!</p>
        </div>
        <Chessboard status={status} onMove={onMove} />
        {status.bauernUmwandlung !== false && (
          <BauernUmwandlung farbe={status.amZug === "w" ? "b" : "w"} onWahl={onUmwandlung} />
        )}
      </div>
    </div>
  );
}

export default App;
