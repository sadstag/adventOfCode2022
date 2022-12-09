// @deno-types="npm:@types/ramda"
import { map, pluck, uniqWith } from "ramda";

import { Solver } from "common";
import {
  Output,
  Input,
  newBoard,
  applyMove,
  History,
  Move,
  areSame,
  Position,
} from "./types.ts";
import { logTransition } from "./log.ts";

const countTailUniquePosition = (h: History): number => {
  const knotsAtAllStages = pluck("knots", h);
  const tailPositions = map(
    (knots: Position[]) => knots[knots.length - 1],
    knotsAtAllStages
  );
  return uniqWith(areSame, tailPositions).length;
};

const NB_KNOTS = 10;
export const solve: Solver<Input, Output> = (moves: Move[]) => {
  let currentBoard = newBoard(NB_KNOTS);
  let history = [currentBoard];
  let move: Move = { direction: "U", distance: 1 };
  while (moves.length) {
    move = moves.shift()!;
    const result = applyMove(move, currentBoard);
    currentBoard = result[result.length - 1];
    history = history.concat(result);
    //logTransition(move, history);
  }
  return countTailUniquePosition(history);
};
