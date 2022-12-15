import { Solver } from "common";
import { Output, Input } from "./types.ts";
import { Scan, scannedRangeX } from "./scan.ts";
import { mergeRanges, Range } from "./range.ts";
import { Location } from "./location.ts";

//const maxDim = 20;
const maxDim = 4000000;

const tuningFrequency = ({ x, y }: Location): number => 4000000 * x + y; // 4000000 and not maxDim as stated by the puzzle

const rangesForY = (y: number, scan: Scan): Range[] => {
  const { sensors } = scan;

  const ranges: Range[] = [];
  for (let sensorId = 0; sensorId < sensors.length; sensorId++) {
    const range = scannedRangeX(scan, sensorId, y);
    if (!range) continue;

    ranges.push(range);
  }
  //console.log(ranges);
  const mergedRanges = mergeRanges(ranges);
  //console.log({ mergedRanges });
  return mergedRanges;
};

export const solve: Solver<Input, Output> = (scan: Scan) => {
  console.log(scan);

  let solution: Location | null = null;

  for (let y = 0; y <= maxDim; y++) {
    const ranges = rangesForY(y, scan);
    if (ranges.length === 1) {
      // THEN (as state by the puzzle, we have to check)
      // this single interval must either excelude all possibility for this line (covers [0-maxDim])
      // OR leave a single location available for a beacon at the frontier
      const [range] = ranges;
      if (range.from === 1) {
        solution = { x: 0, y };
        break;
      }
      if (range.to === maxDim - 1) {
        solution = { x: maxDim, y };
        break;
      }
      if (range.from <= 0 && range.to >= maxDim) {
        // exclude any position for a beacon
        continue;
      }
      // now there is a problem : more than one possible location for a beacon
      // puzzle is lying
      throw `Range ${range.from},${range.to} gives several possible locations for a beacon`;
    }

    if (ranges.length === 2) {
      const [r1, r2] = ranges;
      // ok, first range must begin before 0 or at 0, second must end after maxDim or at maxDim
      // AND first range must end 2 unit before seconf range start, so that the UNIQUE possible location for a beacon lies in-between
      if (r1.from > 0) {
        throw "LIE @ r1 start";
      }
      if (r2.to < maxDim) {
        throw "LIE @ r2 end";
      }
      if (r2.from - r1.to !== 2) {
        throw "LIE @ r2-r1";
      }
      solution = { x: r1.to + 1, y };
      break;
    } else {
      throw "meh";
    }
  }

  if (!solution) {
    throw "No inspected y gave beacon possible location !";
  }

  console.log({ solution });

  return tuningFrequency(solution);
};
