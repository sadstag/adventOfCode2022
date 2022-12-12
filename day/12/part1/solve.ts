// @deno-types="npm:@types/ramda"
import { descend, prop, sort } from "ramda";

import { Solver } from "common";
import { Output, Input } from "./types.ts";
import { ElevationMap } from "./elevationMap.ts";
import { computeShortestPathLength } from "./graph.ts";

export const solve: Solver<Input, Output> = (elevationMap: ElevationMap) => {
  return computeShortestPathLength(elevationMap);
};
