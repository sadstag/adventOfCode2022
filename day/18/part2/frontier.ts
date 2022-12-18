// @deno-types="npm:@types/ramda"
import { range } from "ramda";

import { Coordinates, Droplet } from "./types.ts";

export const findFrontierBlocks = (d: Droplet): Set<Coordinates> => {
  const dim = d.length;
  const s: Set<Coordinates> = new Set();

  const r = range(0, dim);

  // blocks matrix face walk
  for (const i of r) {
    for (const j of r) {
      if (d[0][i][j] === "A") {
        s.add([0, i, j]);
      }
      if (d[dim - 1][i][j] === "A") {
        s.add([dim - 1, i, j]);
      }
      if (d[i][0][j] === "A") {
        s.add([i, 0, j]);
      }
      if (d[i][dim - 1][j] === "A") {
        s.add([i, dim - 1, j]);
      }
      if (d[i][j][0] === "A") {
        s.add([i, j, 0]);
      }
      if (d[i][j][dim - 1] === "A") {
        s.add([i, j, dim - 1]);
      }
    }
  }

  return s;
};
