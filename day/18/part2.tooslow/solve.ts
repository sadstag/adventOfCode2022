// @deno-types="npm:@types/ramda"
import { identity, range } from "ramda";

import { Solver } from "common";
import { Output, Input } from "./types.ts";
import { log } from "common";
import { forceLog, setLogActivated } from "../../../common/log.ts";
import { LOG_ACTIVATED } from "./config.ts";
import { buildDropletEmptyBlockGraph } from "./graph.ts";
import { Voxels } from "./voxel.ts";

// idée : attribute à chaque cellule une composante connexe (CC)
// la pseudo CC -2 est celle qui regroupe les cellule de lave : CC de lave
// la pseudo CC -1  est elle qui relie à l'exterieur (eau) : CC c'eau
// à la fin de la recherche de composantes, on lancera alors l'algo de la partie 1 modifié comme suit :
// sitot qu'on entre ou sort d'une cellule marquée par une CC d'air, le compteur s'incrémente

export const solve: Solver<Input, Output> = (voxels: Voxels<boolean>) => {
  setLogActivated(LOG_ACTIVATED);
  log(voxels);

  const dim = voxels.length;
  log({ dim });
  const r = range(1, dim - 1);

  const g = buildDropletEmptyBlockGraph(voxels);
  // console.log("---");
  // console.log(g);

  const cc = computeConnectedComponents(g);

  // let count = 0;
  // let prev = false;

  // // composantes connexes
  // // la composante connexe d'id 0 est liée à l'exterieur : l'eau autour de la goutte de lave
  // const CC = new Array(1);
  // CC[0];

  // for (const x of r) {
  //   for (const y of r) {
  //     for (const z of r) {
  //       prev = false;
  //       if (voxels[x][y][z] !== prev) {
  //         count++;
  //         prev = voxels[x][y][z];
  //       }
  //     }
  //     if (prev) count++;
  //   }
  // }

  // for (const y of r) {
  //   for (const z of r) {
  //     prev = false;
  //     for (const x of r) {
  //       if (voxels[x][y][z] !== prev) {
  //         count++;
  //         prev = voxels[x][y][z];
  //       }
  //     }
  //     if (prev) count++;
  //   }
  // }

  // for (const z of r) {
  //   for (const x of r) {
  //     prev = false;
  //     for (const y of r) {
  //       if (voxels[x][y][z] !== prev) {
  //         count++;
  //         prev = voxels[x][y][z];
  //       }
  //     }
  //     if (prev) count++;
  //   }
  // }

  return 0;
};
