import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { Chessboard } from "./Chessboard";
import { startStatus, type Status, type Zug } from "../schach/types";

// Polyfill Touch for jsdom
beforeAll(() => {
  if (!global.Touch) {
    global.Touch = class Touch {
      identifier: number;
      target: EventTarget;
      clientX: number;
      clientY: number;
      pageX: number;
      pageY: number;

      constructor(touchInit: TouchInit) {
        this.identifier = touchInit.identifier;
        this.target = touchInit.target;
        this.clientX = touchInit.clientX ?? 0;
        this.clientY = touchInit.clientY ?? 0;
        this.pageX = touchInit.pageX ?? 0;
        this.pageY = touchInit.pageY ?? 0;
      }
    } as any;
  }
});

// Helper to create a basic chess board status
describe("Chessboard Touch Interactions", () => {
  it("should render the chessboard", () => {
    const status = startStatus;
    const onMove = vi.fn();

    render(<Chessboard status={status} onMove={onMove} />);

    expect(screen.getByRole("grid")).toBeInTheDocument();
  });

  it("should complete touch move with correct target position", async () => {
    const status = startStatus;
    const onMove = vi.fn();

    const { container } = render(<Chessboard status={status} onMove={onMove} />);

    const board = screen.getByRole("grid");
    const cells = screen.getAllByRole("gridcell");

    // Get cells at specific positions
    // Board is 8x8, laid out row by row
    const fromCell = cells[6 * 8 + 4]; // Row 6, Column 4 (white pawn)
    const toCell = cells[4 * 8 + 4]; // Row 4, Column 4 (empty square)
    expect(fromCell).toBeTruthy();
    expect(toCell).toBeTruthy();

    // Find the piece span within the from cell
    const piece = fromCell!.querySelector("span");
    expect(piece).toBeTruthy();

    // Mock elementFromPoint to return the target cell
    const originalElementFromPoint = document.elementFromPoint;
    document.elementFromPoint = vi.fn().mockReturnValue(toCell);

    // Simulate touch start on the piece
    await act(async () => {
      const touchStartEvent = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [
          new Touch({
            identifier: 0,
            target: piece!,
            clientX: 100,
            clientY: 100,
            pageX: 100,
            pageY: 100,
          }),
        ],
      });
      piece!.dispatchEvent(touchStartEvent);
    });

    // Simulate touch end on the board
    await act(async () => {
      const touchEndEvent = new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        changedTouches: [
          new Touch({
            identifier: 0,
            target: board,
            clientX: 200,
            clientY: 200,
            pageX: 200,
            pageY: 200,
          }),
        ],
      });
      board.dispatchEvent(touchEndEvent);
    });

    // Restore original implementation
    document.elementFromPoint = originalElementFromPoint;

    // Verify the move was called with correct positions
    expect(onMove).toHaveBeenCalledTimes(1);
    const move: Zug = onMove.mock.calls[0]![0];

    // Should move from row 6, col 4 to row 4, col 4
    expect(move.von).toEqual({ reihe: 6, spalte: 4 });
    expect(move.nach).toEqual({ reihe: 4, spalte: 4 });
    expect(move.figur).toEqual({ art: "bauer", farbe: "w" });
  });

  it("should not complete move if touch ends outside board", async () => {
    const status = startStatus;
    const onMove = vi.fn();

    const { container } = render(<Chessboard status={status} onMove={onMove} />);

    const board = screen.getByRole("grid");
    const cells = screen.getAllByRole("gridcell");
    const fromCell = cells[6 * 8 + 4];
    expect(fromCell).toBeTruthy();
    const piece = fromCell!.querySelector("span");

    // Mock elementFromPoint to return something outside the board
    const originalElementFromPoint = document.elementFromPoint;
    document.elementFromPoint = vi.fn().mockReturnValue(document.body);

    // Start touch on piece
    await act(async () => {
      const touchStartEvent = new TouchEvent("touchstart", {
        bubbles: true,
        cancelable: true,
        touches: [
          new Touch({
            identifier: 0,
            target: piece!,
            clientX: 100,
            clientY: 100,
            pageX: 100,
            pageY: 100,
          }),
        ],
      });
      piece!.dispatchEvent(touchStartEvent);
    });

    // End touch outside board
    await act(async () => {
      const touchEndEvent = new TouchEvent("touchend", {
        bubbles: true,
        cancelable: true,
        changedTouches: [
          new Touch({
            identifier: 0,
            target: board,
            clientX: 1000,
            clientY: 1000,
            pageX: 1000,
            pageY: 1000,
          }),
        ],
      });
      board.dispatchEvent(touchEndEvent);
    });

    document.elementFromPoint = originalElementFromPoint;

    // Should not call onMove if touch ended outside board
    expect(onMove).not.toHaveBeenCalled();
  });

  it("should add data attributes to cells for position tracking", () => {
    const status = startStatus;
    const onMove = vi.fn();

    render(<Chessboard status={status} onMove={onMove} />);

    const cells = screen.getAllByRole("gridcell");

    // Check first cell
    expect(cells[0]).toHaveAttribute("data-reihe", "0");
    expect(cells[0]).toHaveAttribute("data-spalte", "0");

    // Check a middle cell (row 3, col 4 = index 3*8+4 = 28)
    expect(cells[28]).toHaveAttribute("data-reihe", "3");
    expect(cells[28]).toHaveAttribute("data-spalte", "4");

    // Check last cell (row 7, col 7 = index 63)
    expect(cells[63]).toHaveAttribute("data-reihe", "7");
    expect(cells[63]).toHaveAttribute("data-spalte", "7");
  });
});
