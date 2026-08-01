import { useState } from "react";
import { startStatus, type Status, type Zug } from "../schach/types";
import type { Farbe, UmwandlungsFigurArt } from "../schach/types";
import { Chessboard } from "./Chessboard";
import { BauernUmwandlung } from "./BauernUmwandlung";
import { istKorrekterZug, zugAnwenden, bauerUmwandeln, istSchach } from "../schach/logic";
import { andereFarbe } from "../schach/utils";

function schreibeFarbe(farbe: Farbe) {
  return farbe === "w" ? "Weiß" : "Schwarz";
}

function statusNachricht(status: Status): string {
  if (status.istSchachmattOderPatt === "schachmatt") {
    return `Schachmatt! ${schreibeFarbe(andereFarbe(status.amZug))} hat gewonnen!`;
  } else if (status.istSchachmattOderPatt === "patt") {
    return "Patt!";
  }
  let amZug = `${schreibeFarbe(status.amZug)} am Zug!`;
  let obIstSchach = status.istSchach ? " Schach!" : "";
  return amZug + obIstSchach;
}

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#f9f7f3,#e0d4c3_60%,#b69b82)] p-4 sm:p-8">
      <div className="flex w-full max-w-xl flex-col items-center gap-4 sm:gap-6 text-center text-stone-700">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-800">Schachmeister</h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600">{statusNachricht(status)}</p>
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
