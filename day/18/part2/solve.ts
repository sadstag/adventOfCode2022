// @deno-types="npm:@types/ramda"
import { count, identity, range, xor } from "ramda";

import { Solver } from "common";
import { Output, Input, BlockType, Droplet, Coordinates } from "./types.ts";
import { log } from "common";
import { forceLog, setLogActivated } from "../../../common/log.ts";
import { LOG_ACTIVATED } from "./config.ts";
import { findFrontierBlocks } from "./frontier.ts";
import { diffuseWater } from "./diffuse.ts";

const countBlocks = (b: BlockType, d: Droplet): number => {
  let c = 0;
  const r = range(0, d.length);

  for (const x of r) {
    for (const y of r) {
      for (const z of r) {
        if (d[x][y][z] === b) {
          c++;
        }
      }
    }
  }
  return c;
};

const listBlocks = (b: BlockType, d: Droplet): Set<Coordinates> => {
  let s = new Set<Coordinates>();
  const r = range(0, d.length);

  for (const x of r) {
    for (const y of r) {
      for (const z of r) {
        if (d[x][y][z] === b) {
          s.add([x, y, z]);
        }
      }
    }
  }
  return s;
};

export const solve: Solver<Input, Output> = (droplet: Droplet) => {
  setLogActivated(LOG_ACTIVATED);
  log(droplet);

  const dim = droplet.length;
  log({ dim });

  // 1 - find all block at the frontier
  // 2 - for each of them launch a diffusion of water in a greedy deep walk of water
  // at the end launch modified part1 walk to count faces exposed to air

  const frontierBlocks = findFrontierBlocks(droplet);

  //log(frontierBlocks);

  for (const coordinates of frontierBlocks) {
    diffuseWater(coordinates, droplet);
    console.log("------");
    console.log("L:" + countBlocks("L", droplet));
    console.log("A:" + countBlocks("A", droplet));
    console.log("W:" + countBlocks("W", droplet));
  }

  log("air blocks:", { blocks: listBlocks("A", droplet) });

  // counting faces exposed to water
  let count = 0;
  let prev: BlockType = "W";
  const r = range(0, droplet.length);

  const isTransitionCounting = (from: BlockType, to: BlockType) =>
    (from === "L" && to === "W") || (from === "W" && to === "L");

  const check = (x: number, y: number, z: number) => {
    if (isTransitionCounting(prev, droplet[x][y][z])) {
      count++;
    }
    prev = droplet[x][y][z];
  };

  for (const x of r) {
    for (const y of r) {
      prev = "W";
      for (const z of r) {
        check(x, y, z);
      }
      if ((prev as BlockType) === "L") count++;
    }
  }

  for (const y of r) {
    for (const z of r) {
      prev = "W";
      for (const x of r) {
        check(x, y, z);
      }
      if ((prev as BlockType) === "L") count++;
    }
  }

  for (const z of r) {
    for (const x of r) {
      prev = "W";
      for (const y of r) {
        check(x, y, z);
      }
      if ((prev as BlockType) === "L") count++;
    }
  }

  return count;
};
