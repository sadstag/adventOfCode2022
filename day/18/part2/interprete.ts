// @deno-types="npm:@types/ramda"
import { compose, identity, map, range, split } from "ramda";

import { Interpretor } from "common";
import { BlockType, Input } from "./types.ts";

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

  const blocks: BlockType[][][] = new Array(dim);
  const r = range(0, dim);
  for (const x of r) {
    blocks[x] = new Array(dim).fill("A");
    for (const y of r) {
      blocks[x][y] = new Array(dim).fill("A");
    }
  }

  for (const [x, y, z] of coordinates) {
    blocks[x - min][y - min][z - min] = "L";
  }

  return blocks;
};
