import { AIR, Board, Cell, ROCK, SAND, SOURCE } from "./types.ts";

export type SandDropTerminalState =
  | "rest"
  | "fallingInAbyss"
  | "reached source";

const isCellBlocking = (x: number, y: number, cells: Cell[][]): boolean => {
  const cell = cells[y][x];
  return cell === ROCK || cell == SAND;
};

const simulate = (
  x: number,
  y: number,
  board: Board
): SandDropTerminalState => {
  const { cells, size } = board;
  const cell = cells[y][x];

  if (y + 1 == size.y) return "fallingInAbyss";

  if (cell !== AIR && cell != SOURCE) {
    // simulation must prevent that
    throw `ARG! no air there : ${x}, ${y}`;
  }

  if (!isCellBlocking(x, y + 1, cells)) {
    // keep on falling down
    return simulate(x, y + 1, board);
  }

  if (x === 0) {
    // it will fall by the left of the board
    return "fallingInAbyss";
  }

  if (!isCellBlocking(x - 1, y + 1, cells)) {
    // try to the left
    return simulate(x - 1, y + 1, board);
  }

  if (x + 1 === size.x) {
    // it will fall by the right of the board
    return "fallingInAbyss";
  }

  if (isCellBlocking(x + 1, y + 1, cells)) {
    // stuck !
    cells[y][x] = SAND;
    if (cell === SOURCE) {
      return "reached source";
    }
    return "rest";
  }

  // try to the right
  return simulate(x + 1, y + 1, board);
};

export const dropOneSandUnit = (board: Board): SandDropTerminalState =>
  simulate(board.source.x, board.source.y, board);
