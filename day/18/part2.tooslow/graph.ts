// @deno-types="npm:@types/ramda"
import { range } from "ramda";
import { Voxels } from "./voxel.ts";

//type Node = [number, number, number];
type Node = string; // "x,y,z"

export type Droplet = {
  nodes: Set<Node>;
  edges: Map<Node, Set<Node>>;
};

const nodeString = (x: number, y: number, z: number) => `${x},${y},${z}`;

// build the graph of all blocks that are not lava
export const buildDropletEmptyBlockGraph = (v: Voxels<boolean>): Droplet => {
  const dim = v.length;
  const nodes: Droplet["nodes"] = new Set();
  const edges: Droplet["edges"] = new Map();

  let countNodes = 0;

  // pyramidal exploration, save somewhat 5/6 of operations (the graph is non-oriented)
  for (const x of range(0, dim)) {
    for (const y of range(0, dim)) {
      for (const z of range(0, dim)) {
        console.log({ x, y, z });
        if (v[x][y][z]) {
          // lava block
          continue;
        }
        const n = nodeString(x, y, z);
        nodes.add(n);
        edges.set(n, new Set());
        countNodes++;
        if (x > 0 && !v[x - 1][y][z]) {
          edges.get(nodeString(x - 1, y, z))!.add(n);
        }
        if (y > 0 && !v[x][y - 1][z]) {
          edges.get(nodeString(x, y - 1, z))!.add(n);
        }
        if (z > 0 && !v[x][y][z - 1]) {
          edges.get(nodeString(x, y, z - 1))!.add(n);
        }
      }
    }
  }

  return { nodes, edges };
};
