// @deno-types="npm:@types/ramda"
import { all, compose, map, sum, propEq, head, findIndex } from "ramda";

import { Solver } from "common";
import {
  Char,
  compartmentsIntersection,
  evaluateCharPriority,
  Output,
} from "./types.ts";
import { Input } from "./types.ts";

export const solve: Solver<Input, Output> = (rucksacks: Input) => {
  const intersections = map(
    compose((s) => [...s], compartmentsIntersection),
    rucksacks
  );

  if (!all(propEq("length", 1), intersections)) {
    const index = findIndex(propEq("length", 1), intersections);
    const r = rucksacks[index];
    console.log(r);
    throw Error(
      `Rucksack #${index} ("${r.sourceLine}") have left/right compartment share ${intersections[index].length} items`
    );
  }

  const reducedIntersection = map(head, intersections) as Char[];

  return sum(map(evaluateCharPriority, reducedIntersection));
};
