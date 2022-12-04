// @deno-types="npm:@types/ramda"
import { map, sum } from "ramda";

import { Solver } from "common";
import { Output, Input } from "./types.ts";

export const solve: Solver<Input, Output> = (pairs: Input) =>
  sum(map(foo, pairs));
