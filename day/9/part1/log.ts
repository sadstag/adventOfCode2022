// @deno-types="npm:@types/ramda"
import { join, map } from "ramda";

import { Move, Position, History } from "./types.ts";

const logMove = (m: Move) => `${m.direction} ${m.distance}`;

const findExtremumPosition = (
  h: History,
  f: (...a: number[]) => number
): Position => {
  let optimX = 0;
  let optimY = 0;
  for (const b of h) {
    const { head, tail } = b;
    optimX = f(optimX, head.x, tail.x);
    optimY = f(optimY, head.y, tail.y);
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
    const oldValue = grid[row][col];
    let newValue = value;
    if (["H", "S", "T"].includes(oldValue) && ["H", "S", "T"].includes(value)) {
      newValue = "2";
    } else if (oldValue === "2") {
      newValue = "3";
    }
    grid[row][col] = newValue;
  };

  for (const b of h) {
    const {
      tail: { x, y },
    } = b;
    updateGrid(x, y, "#");
  }

  const b = h[h.length - 1];
  {
    const {
      tail: { x, y },
    } = b;
    updateGrid(x, y, "T");
  }
  {
    const {
      head: { x, y },
    } = b;
    updateGrid(x, y, "H");
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
