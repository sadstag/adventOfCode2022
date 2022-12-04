// @deno-types="npm:@types/ramda"
import { map, sum } from "ramda";

import { Solver } from "common";
import { isOverlap, Output, Pair } from "./types.ts";
import { Input } from "./types.ts";

const evaluateOverlap = ([left, right]: Pair): 0 | 1 =>
  isOverlap(left, right) ? 1 : 0;

export const solve: Solver<Input, Output> = (pairs: Input) =>
  sum(map(evaluateOverlap, pairs));
