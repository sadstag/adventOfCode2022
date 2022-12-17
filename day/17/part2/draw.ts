// @deno-types="npm:@types/ramda"
import { compose, join, map, range, repeat } from "ramda";
import { Shape } from "./shape.ts";

import { Chamber } from "./chamber.ts";

export const drawChamber = (c: Chamber): string =>
  drawChamberWithFallingRock(c);

const drawMatrix = (
  c: Chamber,
  rockShape: Shape | null = null,
  xRock: number | null = null,
  yRock: number | null = null
): string =>
  compose(
    join("\n"),
    map(join(""))
  )(chamberToChars(c, rockShape, xRock, yRock));

export const drawChamberWithFallingRock = (
  c: Chamber,
  rockShape: Shape | null = null,
  xRock: number | null = null,
  yRock: number | null = null
): string => {
  const matrix = drawMatrix(c, rockShape, xRock, yRock);
  return `${matrix}\ntime:${c.time}\nh:${c.h}\nrockLevel:${c.rockLevel}\nrockLevelAccrossTruncates:${c.rockLevelAcrossTruncates}\nnbLandedRocks:${c.nbLandedRocks}`;
};

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
