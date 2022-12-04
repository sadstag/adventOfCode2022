// @deno-types="npm:@types/ramda"
import { map, sum } from "ramda";

import { Solver } from "common";
import { isIncludedIn, Output, Pair } from "./types.ts";
import { Input } from "./types.ts";

const evaluateInclusion = ([left, right]: Pair): 0 | 1 =>
  isIncludedIn(left, right) || isIncludedIn(right, left) ? 1 : 0;

export const solve: Solver<Input, Output> = (pairs: Input) =>
  sum(map(evaluateInclusion, pairs));
