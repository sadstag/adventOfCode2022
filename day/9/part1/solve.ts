// @deno-types="npm:@types/ramda"
import { all, gt, lt, splitAt, tail } from "ramda";

import { Solver } from "common";
import {
  Output,
  Input,
  Forest,
  TreeHeight,
  computeTransposed,
} from "./types.ts";

const isHigherThanAll =
  (height: TreeHeight) =>
  (heights: TreeHeight[]): boolean => {
    //console.log({ heights, height, result: all(gt(height), heights) });
    return all(gt(height), heights);
  };

function isVisibleInForest(
  line: number,
  column: number,
  forest: Forest,
  transposed: Forest
): boolean {
  const height = forest[line][column];

  const test = isHigherThanAll(height);

  let result = false;

  let [before, after] = splitAt(column, forest[line]);
  result ||= test(before);
  if (result) return true;
  result ||= test(tail(after));
  if (result) return true;

  [before, after] = splitAt(line, transposed[column]);
  result ||= test(before);
  if (result) return true;
  result ||= test(tail(after));

  return result;
}

function countVisibles(forest: Forest): number {
  const transposed = computeTransposed(forest);
  const size = forest.length;

  let count = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (isVisibleInForest(i, j, forest, transposed)) {
        count++;
      }
    }
  }
  return count;
}

export const solve: Solver<Input, Output> = (forest: Forest) => {
  return countVisibles(forest);
};
