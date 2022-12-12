// @deno-types="npm:@types/ramda"
import { map, split } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";
import { Elevation, Location } from "./elevationMap.ts";

const findElevation = (e: Elevation, elevations: Elevation[][]): Location => {
  const height = elevations.length;
  const width = elevations[0].length;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (elevations[y][x] === e) {
        return [x, y];
      }
    }
  }
  return [-1, -1]; // won't append
};
export const interprete: Interpretor<Input> = (lines: string[]) => {
  const elevations = map(split(""), lines);
  return {
    elevations,
    start: findElevation("S", elevations),
    end: findElevation("E", elevations),
    height: elevations.length,
    width: elevations[0].length,
  };
};
