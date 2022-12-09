// @deno-types="npm:@types/ramda"
import { join, last, map, reverse } from "ramda";

import { Move, Position, History } from "./types.ts";

const logMove = (m: Move) => `${m.direction} ${m.distance}`;

const findExtremumPosition = (
  h: History,
  f: (...a: number[]) => number
): Position => {
  let optimX = 0;
  let optimY = 0;
  for (const b of h) {
    for (const k of b.knots) {
      optimX = f(optimX, k.x);
      optimY = f(optimY, k.y);
    }
  }
  return { x: optimX, y: optimY };
};

const makeDebugGrid = (h: History): string => {
  const from = findExtremumPosition(h, Math.min);
  const to = findExtremumPosition(h, Math.max);

  const width = to.x - from.x + 1;
  const height = to.y - from.y + 1;

  const grid = new Array(height);
  for (let row = 0; row < grid.length; row++) {
    grid[row] = new Array(width);
    for (let col = 0; col < grid[row].length; col++) {
      grid[row][col] = "•";
    }
  }

  const { x: offsetX, y: offsetY } = from;

  const updateGrid = (x: number, y: number, value: string) => {
    const row = height - (y - offsetY) - 1;
    const col = x - offsetX;
    grid[row][col] = value;
  };
  for (const board of h) {
    const lastKnot = last(board.knots)!;
    updateGrid(lastKnot.x, lastKnot.y, "#");
  }

  const board = h[h.length - 1];
  {
    const [head, ...tail] = board.knots;
    for (const [i, { x, y }] of Object.entries(tail)) {
      updateGrid(x, y, (parseInt(i) + 1).toString());
    }
    updateGrid(head.x, head.y, "H");
  }

  updateGrid(0, 0, "S");

  return join("\n", map(join(""), grid));
};

export const logTransition = (m: Move, h: History) => {
  console.log(logMove(m));
  console.log("----->");
  console.log(makeDebugGrid(h));
  console.log("\n");
};
