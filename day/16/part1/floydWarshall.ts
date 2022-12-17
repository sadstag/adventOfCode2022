// @deno-types="npm:@types/ramda"
import { join, map } from "ramda";

// distance from a valve (dim 1) to another (dim 2)
export type DistanceMatrix = number[][];

export type PathMatrixUnderConstruction = (number | null)[][];
export type PathMatrix = number[][];

const initDistanceMatrix = (tunnels: number[][]): DistanceMatrix => {
  const { length: size } = tunnels;
  const map: DistanceMatrix = new Array(size);
  for (let from = 0; from < size; from++) {
    map[from] = new Array(size).fill(size); // distance will be no longer than the number of valves, so here nbValves is the same as infinity
  }
  return map;
};

const initPathMatrix = (size: number): PathMatrixUnderConstruction => {
  const next: PathMatrix = new Array(size);
  for (let from = 0; from < size; from++) {
    next[from] = new Array(size).fill(null);
  }
  return next;
};

export const simpleFloydWarshall = (
  tunnels: number[][]
): [DistanceMatrix, PathMatrix] => {
  const { length: size } = tunnels;
  const distanceMatrix: DistanceMatrix = initDistanceMatrix(tunnels);
  const pathMatrix: PathMatrixUnderConstruction = initPathMatrix(size);

  for (let from = 0; from < size; from++) {
    distanceMatrix[from][from] = 0;
    pathMatrix[from][from] = from;
  }

  for (let from = 0; from < size; from++) {
    for (let e = 0; e < tunnels[from].length; e++) {
      const to = tunnels[from][e];
      distanceMatrix[from][to] = 1;
      pathMatrix[from][to] = to;
    }
  }

  for (let via = 0; via < size; via++) {
    for (let from = 0; from < size; from++) {
      for (let to = 0; to < size; to++) {
        const direct = distanceMatrix[from][to];
        const indirect = distanceMatrix[from][via] + distanceMatrix[via][to];
        if (indirect < direct) {
          distanceMatrix[from][to] = indirect;
          pathMatrix[from][to] = pathMatrix[from][via];
        }
      }
    }
  }
  return [distanceMatrix, pathMatrix as PathMatrix];
};

export const matrixToString = (m: number[][]): string =>
  join("\n", map(join(" "), m));
