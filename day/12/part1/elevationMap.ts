// @deno-types="npm:@types/ramda"
import { curry, equals, find, last, length, map, reduce } from "ramda";

export type Elevation = string;
export type ElevationMap = {
  elevations: Elevation[][];
  start: Location;
  end: Location;
  height: number;
  width: number;
};

export type Location = [number, number]; // [y,x]
export type Path = Location[];

export const evaluate = (e: Elevation): number => {
  if (e === "S") return evaluate("a");
  if (e === "E") return evaluate("z");
  return e.charCodeAt(0) - 97;
};
export const canPass = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  elevations: Elevation[][]
): boolean => {
  return (
    evaluate(elevations[toY][toX]) <= evaluate(elevations[fromY][fromX]) + 1
  );
};
