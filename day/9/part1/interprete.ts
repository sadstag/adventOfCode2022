// @deno-types="npm:@types/ramda"
import { all, compose, equals, length } from "ramda";

import { Interpretor } from "common";
import { Forest, Input, TreeHeight } from "./types.ts";

function isSquare(heights: TreeHeight[][]): boolean {
  const size = heights.length;
  return all(compose(equals(size), length), heights);
}

export const interprete: Interpretor<Input> = (lines) => {
  const size = lines.length;

  const forest: Forest = new Array(size);

  for (const [i, line] of lines.entries()) {
    forest[i] = [...line.trim()].map((c) => parseInt(c));
  }

  if (!isSquare(forest)) {
    throw Error("input is not a square");
  }

  return forest;
};
