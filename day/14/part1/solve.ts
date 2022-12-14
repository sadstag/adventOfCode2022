import { Solver } from "common";
import { Output, Input, Board, SAND } from "./types.ts";
import { buildBoard, drawBoard } from "./board.ts";
import { dropOneSandUnit, SandDropTerminalState } from "./simulation.ts";

const SEP = "\n" + new Array(150).fill("-").join("") + "\n";

const dumpBoard = (board: Board) => {
  console.log(SEP);
  console.log(drawBoard(board));
};

export const solve: Solver<Input, Output> = (input: Input) => {
  const board = buildBoard(input);
  dumpBoard(board);

  let dropOutcome: SandDropTerminalState = "rest";
  let nbRestSand = -1;
  while (dropOutcome == "rest") {
    nbRestSand++;
    try {
      dropOutcome = dropOneSandUnit(board);
    } catch (e) {
      dumpBoard(board);
      throw e;
    }
  }

  dumpBoard(board);

  return nbRestSand;
};
