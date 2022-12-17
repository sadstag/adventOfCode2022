// @deno-types="npm:@types/ramda"
import { equals, filter, findIndex, range } from "ramda";

import { Solver } from "common";
import { Output, Input } from "./types.ts";
import { matrixToString, simpleFloydWarshall } from "./floydWarshall.ts";

import { computeMaxPressure } from "./compute.ts";

const MAX_MINUTES = 26;

export const solve: Solver<Input, Output> = (puzzle: Input) => {
  console.log("------------ Input ----------");
  console.log(puzzle);

  const { tunnels, flows } = puzzle;
  const { length: size } = tunnels;

  const [distanceMatrix, _] = simpleFloydWarshall(tunnels);

  console.log("------------ Distance Matrix ----------");
  console.log(matrixToString(distanceMatrix));

  // closedValves : all id of valves that we shall try to open
  // the valve with flow == 0 does not need to be open
  const closedValves = filter(
    (valveId: number) => flows[valveId] > 0,
    range(0, size)
  );

  const AAId = findIndex(equals("AA"), puzzle.valves);

  return computeMaxPressure(
    AAId,
    MAX_MINUTES,
    flows,
    distanceMatrix,
    true
  )(AAId, MAX_MINUTES, closedValves);
};
