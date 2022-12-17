// @deno-types="npm:@types/ramda"
import { memoizeWith } from "ramda";

import { DistanceMatrix } from "./floydWarshall.ts";

export const computeMaxPressure = (
  flows: number[],
  distanceMatrix: DistanceMatrix,
  memoize: boolean
) => {
  const compute = function (
    currentValveId: number,
    remaingingMinutes: number,
    closedValves: number[]
  ): number {
    let maxPressure = 0;
    for (const valve of closedValves) {
      const distance = distanceMatrix[currentValveId][valve];
      if (distance >= remaingingMinutes) {
        continue; // no time left for this move !
      }
      const elapsed = distance + 1; // with 1 minute opening the valve
      const remainingMinutesAfter = remaingingMinutes - elapsed;

      const pressure =
        remainingMinutesAfter * flows[valve] +
        memoizedCompute(
          valve,
          remainingMinutesAfter,
          closedValves.filter((v) => v !== valve)
        );
      if (pressure > maxPressure) {
        maxPressure = pressure;
      }
    }
    return maxPressure;
  };

  const memoizedCompute = memoize
    ? memoizeWith(
        (
          currentValveId: number,
          remaingingMinutes: number,
          closedValves: number[]
        ) => {
          return `${currentValveId}:${remaingingMinutes}:${closedValves}`;
        },
        compute
      )
    : compute;

  return compute;
};
