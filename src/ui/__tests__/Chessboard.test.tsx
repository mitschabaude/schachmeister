import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chessboard } from "../Chessboard";
import type { Brett, Status } from "../../schach/types";

const leereReihe = (): [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
] => [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

const brettMitFiguren: Brett = [
  [{ art: "turm", farbe: "b" }, undefined, undefined, undefined, undefined, undefined, undefined, undefined],
  leereReihe(),
  leereReihe(),
  leereReihe(),
  leereReihe(),
  leereReihe(),
  leereReihe(),
  [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { art: "koenig", farbe: "w" },
  ],
] as const;
const state: Status = { brett: brettMitFiguren, amZug: "w" };

describe("Chessboard", () => {
  it("shows piece symbols with accessible labels", () => {
    render(<Chessboard {...state} />);

    expect(screen.getByRole("grid", { name: "Schachbrett" })).toBeInTheDocument();
    expect(screen.getByLabelText("Feld 1-1: schwarze turm")).toHaveTextContent(/\u265C/);
    expect(screen.getByLabelText("Feld 8-8: weiße koenig")).toHaveTextContent(/\u265A/);
  });

  it("colors pieces according to their owner", () => {
    render(<Chessboard {...state} />);

    const schwarzesFeld = screen.getByLabelText("Feld 1-1: schwarze turm");
    const weissesFeld = screen.getByLabelText("Feld 8-8: weiße koenig");

    const schwarzesSymbol = schwarzesFeld.querySelector("span");
    const weissesSymbol = weissesFeld.querySelector("span");

    expect(schwarzesSymbol).not.toBeNull();
    expect(weissesSymbol).not.toBeNull();

    expect(schwarzesSymbol).toHaveClass("text-slate-900");
    expect(schwarzesSymbol).toHaveStyle({ color: "#000000" });
    expect(weissesSymbol).toHaveClass("text-white");
    expect(weissesSymbol).toHaveStyle({ color: "#ffffff" });
  });
});
