// @deno-types="npm:@types/ramda"
import { descend, prop, sort } from "ramda";

import { Solver } from "common";
import { Output, Input } from "./types.ts";
import { ElevationMap, findAll } from "./elevationMap.ts";
import { computeShortestPathLength } from "./graph.ts";

export const solve: Solver<Input, Output> = (elevationMap: ElevationMap) => {
  // TODO call with all locations of a or S
  const startCandidates = [elevationMap.start, ...findAll(elevationMap, "a")];
  let minLength = elevationMap.width * elevationMap.height;
  for (const start of startCandidates) {
    minLength = Math.min(
      minLength,
      computeShortestPathLength(elevationMap, start)
    );
  }
  return minLength;
};
