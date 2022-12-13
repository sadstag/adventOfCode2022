// @deno-types="npm:@types/ramda"
import { comparator, concat, descend, indexBy, prop, sort } from "ramda";

import { Solver } from "common";
import { Output, Input, compareElements, Packet } from "./types.ts";

const div1 = [[2]];
const div2 = [[6]];
const dividers: Packet[] = [div1, div2];

export const solve: Solver<Input, Output> = (input: Input) => {
  const inputWithDividers = concat(input, dividers);

  const sortedPackets = sort(compareElements, inputWithDividers);
  console.log(sortedPackets);

  let product = 1;
  for (const [i, p] of Object.entries(sortedPackets)) {
    if (compareElements(p, div1) === 0) {
      product *= parseInt(i) + 1;
    } else if (compareElements(p, div2) === 0) {
      product *= parseInt(i) + 1;
    }
  }

  return product;
};
