// @deno-types="npm:@types/ramda"
import { memoizeWith } from "ramda";

import { DistanceMatrix } from "./floydWarshall.ts";

export const computeMaxPressure = (
  startValveId: number,
  startRemainingTime: number,
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
        Math.max(
          memoizedCompute(
            valve,
            remainingMinutesAfter,
            closedValves.filter((v) => v !== valve)
          ),

          // what would the elephant would have done with the rest of closed valves
          // if I decided by advance to stop there for it to open the remaining valves ?
          memoizedComputePart1(
            startValveId,
            startRemainingTime,
            closedValves.filter((v) => v !== valve)
          )
        );

      if (pressure > maxPressure) {
        maxPressure = pressure;
      }
    }

    return maxPressure;
  };

  const computePart1 = function (
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
        memoizedComputePart1(
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

  const memoizedComputePart1 = memoize
    ? memoizeWith(
        (
          currentValveId: number,
          remaingingMinutes: number,
          closedValves: number[]
        ) => {
          return `${currentValveId}:${remaingingMinutes}:${closedValves}`;
        },
        computePart1
      )
    : computePart1;

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
