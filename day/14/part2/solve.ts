import { Solver } from "common";
import { Output, Input, Board, SAND } from "./types.ts";
import { buildBoard, drawBoard, SOURCE_ABSOLUTE_LOCATION } from "./board.ts";
import { dropOneSandUnit, SandDropTerminalState } from "./simulation.ts";

const SEP = "\n" + new Array(150).fill("-").join("") + "\n";

const dumpBoard = (board: Board) => {
  console.log(SEP);
  console.log(drawBoard(board));
};

export const solve: Solver<Input, Output> = (input: Input) => {
  let board = buildBoard(input);

  // tricking input to have a sufficiently large platform two unit under max y, no need to be exact
  const height = board.offset.y + board.size.y;
  const platformY = height + 1;
  input.push([
    { x: SOURCE_ABSOLUTE_LOCATION.x - platformY, y: platformY }, // worst case 45 degress slopes in both direction
    { x: SOURCE_ABSOLUTE_LOCATION.x + platformY, y: platformY },
  ]);

  console.log(input);

  board = buildBoard(input);
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

  if (dropOutcome !== "reached source") {
    throw "This is unexpected : felt into abyss !";
  }

  return nbRestSand + 1;
};
