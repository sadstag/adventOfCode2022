// @deno-types="npm:@types/ramda"
import { range } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";

export const interprete: Interpretor<Input> = (lines: string[]) => {
  const coordinates = lines
    .map((line) => line.split(","))
    .map((coords: string[]) => coords.map((s) => parseInt(s, 10)));
  console.log(coordinates);

  let max = 0;
  let min = 100000;
  for (const [x, y, z] of coordinates) {
    max = Math.max(max, x, y, z);
    min = Math.min(min, x, y, z);
  }

  console.log({ min, max });

  const dim = max - min + 1;

  const voxels: boolean[][][] = new Array(dim);
  const r = range(0, dim);
  for (const x of r) {
    voxels[x] = new Array(dim).fill(false);
    for (const y of r) {
      voxels[x][y] = new Array(dim).fill(false);
    }
  }

  for (const [x, y, z] of coordinates) {
    voxels[x - min][y - min][z - min] = true;
  }

  return voxels;
};
