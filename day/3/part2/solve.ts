// @deno-types="npm:@types/ramda"
import { map, sum, intersection } from "ramda";

import { Solver } from "common";
import { allItems, evaluateCharPriority, Group, Output } from "./types.ts";
import { Input } from "./types.ts";

const evaluateGroupPriority = ([r1, r2, r3]: Group): number => {
  const items1 = allItems(r1);
  const items2 = allItems(r2);
  const items3 = allItems(r3);
  const common = intersection(
    [...items1],
    intersection([...items2], [...items3])
  );
  if (common.length != 1) {
    throw Error(
      `Group #${r1.sourceLineNumber / 3} starting line ${
        r1.sourceLineNumber
      } has ${common.length} badges !`
    );
  }
  const [badge] = common;
  return evaluateCharPriority(badge);
};

export const solve: Solver<Input, Output> = (groups: Input) => {
  return sum(map(evaluateGroupPriority, groups));
};
