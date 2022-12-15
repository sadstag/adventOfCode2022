// @deno-types="npm:@types/ramda"
import { curry } from "ramda";

export type Location = { x: number; y: number };

// ----------
// TODO Location + tool function => in common
export const locationsAreEqual = curry(
  ({ x: x1, y: y1 }: Location, { x: x2, y: y2 }: Location): boolean =>
    x1 === x2 && y1 === y2
);

export const manhattanDistance = (
  { x: x1, y: y1 }: Location,
  { x: x2, y: y2 }: Location
): number => Math.abs(x2 - x1) + Math.abs(y2 - y1);

// ----------
