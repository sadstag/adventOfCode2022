// @deno-types="npm:@types/ramda"
import { findIndex, gte, lte, reverse, splitAt, tail } from "ramda";

import { Solver } from "common";
import {
  Output,
  Input,
  Forest,
  TreeHeight,
  computeTransposed,
} from "./types.ts";

const computeScoreSingleDirection =
  (height: TreeHeight) =>
  (
    heights: TreeHeight[] // nearest tree first in list !
  ): number => {
    let result: number;
    const i = findIndex(lte(height), heights);
    if (i === -1) {
      result = heights.length;
    } else {
      result = i + 1;
    }
    //console.log({ heights, height, i, result });
    return result;
  };

function computeScenicScore(
  line: number,
  column: number,
  forest: Forest,
  transposed: Forest
): number {
  const height = forest[line][column];

  const compute = computeScoreSingleDirection(height);

  let result = 1;

  let [before, after] = splitAt(column, forest[line]);
  result *= compute(reverse(before)) * compute(tail(after));

  [before, after] = splitAt(line, transposed[column]);
  result *= compute(reverse(before)) * compute(tail(after));

  return result;
}

export const solve: Solver<Input, Output> = (forest: Forest) => {
  const transposed = computeTransposed(forest);
  const size = forest.length;

  let max = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      max = Math.max(max, computeScenicScore(i, j, forest, transposed));
    }
  }
  return max;
};
