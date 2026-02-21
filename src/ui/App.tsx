import { useState } from "react";
import { startBrett, type Status, type Zug } from "../schach/types";
import { Chessboard } from "./Chessboard";
import { istKorrekterZug, zugAnwenden } from "../schach/logic";

function App() {
  let [status, setStatus] = useState<Status>({ brett: startBrett, amZug: "w" });

  function onMove(zug: Zug) {
    if (istKorrekterZug(zug, status)) {
      setStatus(zugAnwenden(zug, status));
    } else {
      console.log("Ungültiger Zug", zug);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f9f7f3,#e0d4c3_60%,#b69b82)] p-8">
      <div className="flex max-w-xl flex-col items-center gap-6 text-center text-stone-700">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-800">Schachmeister</h1>
          <p className="mt-2 text-base text-stone-600">Los geht's!</p>
        </div>
        <Chessboard status={status} onMove={onMove} />
      </div>
    </div>
  );
}

export default App;
