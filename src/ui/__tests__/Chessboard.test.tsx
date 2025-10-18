import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chessboard } from "../Chessboard";
import type { Brett } from "../../schach/types";

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

const brettMitTuermen: Brett = [
  [
    { art: "turm", farbe: "b" },
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ],
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
    { art: "turm", farbe: "w" },
  ],
] as const;

describe("Chessboard", () => {
  it("shows piece symbols with accessible labels", () => {
    render(<Chessboard brett={brettMitTuermen} />);

    expect(screen.getByRole("grid", { name: "Schachbrett" })).toBeInTheDocument();
    expect(screen.getByLabelText("Feld 1-1: schwarze turm")).toHaveTextContent("♜");
    expect(screen.getByLabelText("Feld 8-8: weiße turm")).toHaveTextContent("♖");
  });
});
