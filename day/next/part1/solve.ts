// @deno-types="npm:@types/ramda"
import { identity } from "ramda";

import { Solver } from "common";
import { Output, Input } from "./types.ts";

export const solve: Solver<Input, Output> = (input: Input) => {
  return input.length;
};
