// @deno-types="npm:@types/ramda"
import { compose, join, map, range, repeat } from "ramda";
import { Shape } from "./shape.ts";

export type Chamber = Shape & {
  rockLevel: number; // y coordinate of highest rock block in the tower
};

export const buildChamber = (w: number): Chamber => ({
  w,
  h: 0,
  rockLevel: 0,
  m: new Array(0),
});

export const extendChamber = (chamber: Chamber, rockShape: Shape) => {
  const toAdd = 3 + rockShape.h;
  const targetHeight = chamber.rockLevel + toAdd;
  for (const y of range(chamber.h, targetHeight)) {
    chamber.m[y] = new Array(chamber.w).fill(false);
  }
  chamber.h = targetHeight;
};

export const drawChamber = (c: Chamber): string =>
  drawChamberWithFallingRock(c);

export const drawChamberWithFallingRock = (
  c: Chamber,
  rockShape: Shape | null = null,
  xRock: number | null = null,
  yRock: number | null = null
): string =>
  compose(
    join("\n"),
    map(join(""))
  )(chamberToChars(c, rockShape, xRock, yRock));

const chamberCellToChar = (b: boolean): string => (b ? "#" : "\u22c5");

export const chamberToChars = (
  c: Chamber,
  rockShape: Shape | null = null,
  xRock: number | null = null,
  yRock: number | null = null
): string[][] => {
  const chars = new Array(c.h + 1);
  for (const y of range(0, c.h)) {
    chars[c.h - y - 1] = ["|", ...map(chamberCellToChar, c.m[y]), "|"];
  }
  chars[c.h] = ["+", ...repeat("-", c.w), "+"];

  if (rockShape && xRock !== null && yRock !== null) {
    for (const y of range(0, rockShape.h)) {
      for (const x of range(0, rockShape.w)) {
        if (rockShape.m[y][x]) {
          chars[c.h - yRock - y - 1][xRock + x + 1] = "@";
        }
      }
    }
  }
  return chars;
};

export const rockOverlays = (
  rockShape: Shape,
  xRock: number,
  yRock: number,
  chamber: Chamber
): boolean => {
  if (xRock < 0 || xRock + rockShape.w > chamber.w || yRock < 0) return true;

  for (let y = 0; y < rockShape.h; y++) {
    for (let x = 0; x < rockShape.w; x++) {
      if (chamber.m[y + yRock][x + xRock] && rockShape.m[y][x]) {
        return true;
      }
    }
  }
  return false;
};

export const addRock = (
  rockShape: Shape,
  xRock: number,
  yRock: number,
  chamber: Chamber
): void => {
  for (let y = 0; y < rockShape.h; y++) {
    for (let x = 0; x < rockShape.w; x++) {
      chamber.m[y + yRock][x + xRock] ||= rockShape.m[y][x];
    }
  }
  chamber.rockLevel = Math.max(chamber.rockLevel, yRock + rockShape.h);
};
