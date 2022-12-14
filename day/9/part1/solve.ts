// @deno-types="npm:@types/ramda"
import { pluck, uniqWith } from "ramda";

import { Solver } from "common";
import {
  Output,
  Input,
  newBoard,
  applyMove,
  History,
  Move,
  areSame,
} from "./types.ts";
import { logTransition } from "./log.ts";

const countTailUniquePosition = (h: History): number => {
  const tailPositions = pluck("tail", h);
  return uniqWith(areSame, tailPositions).length;
};

export const solve: Solver<Input, Output> = (moves: Move[]) => {
  let currentBoard = newBoard();
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
