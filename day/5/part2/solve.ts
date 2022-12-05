import { Solver } from "common";
import { Output, Input, Problem, applyMove, renderDock } from "./types.ts";

const advance = (p: Problem): Problem => {
  const { dock, moves } = p;
  const [move, ...remainginMoves] = moves;
  return {
    dock: applyMove(dock, move),
    moves: remainginMoves,
  };
};

export const solve: Solver<Input, Output> = (problem: Input) => {
  let p = problem;
  while (p.moves.length) {
    p = advance(p);
  }

  return renderDock(p.dock);
};
