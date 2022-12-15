// @deno-types="npm:@types/ramda"
import { map, sum } from "ramda";

import { Solver } from "common";
import { Output, Input } from "./types.ts";
import { Scan, scannedRangeX } from "./scan.ts";
import { mergeRanges, Range, rangeSize } from "./range.ts";

//const Y = 10;
const Y = 2000000;

const countScannedLocationInRanges = (ranges: Range[]): number =>
  sum(map(rangeSize, ranges));

export const solve: Solver<Input, Output> = (scan: Scan) => {
  console.log(scan);
  const { sensors } = scan;
  const ranges: Range[] = [];
  for (let sensorId = 0; sensorId < sensors.length; sensorId++) {
    const range = scannedRangeX(scan, sensorId, Y);
    if (!range) continue;

    ranges.push(range);
  }
  console.log(ranges);
  const mergedRanges = mergeRanges(ranges);

  console.log({ mergedRanges });

  return countScannedLocationInRanges(mergedRanges);
};
