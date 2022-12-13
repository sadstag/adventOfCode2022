// @deno-types="npm:@types/ramda"
import { comparator, descend, indexBy, prop, sort } from "ramda";

import { Solver } from "common";
import { Output, Input, compareElements } from "./types.ts";

export const solve: Solver<Input, Output> = (input: Input) => {
  let sum = 0;
  for (const [index, [p1, p2]] of Object.entries(input)) {
    console.log({ p1, p2, cmp: compareElements(p1, p2) });
    sum += compareElements(p1, p2) !== 1 ? 1 + parseInt(index) : 0;
  }
  //console.log(input);
  return sum;
};
