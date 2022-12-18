import { Droplet } from "./graph.ts";
import { Voxels } from "./voxel.ts";

type ConnectedComponent = number;

// special connected components
const CCLava: ConnectedComponent = -2;
const CCWater: ConnectedComponent = -1;

type CCMatrix = Voxels<ConnectedComponent>;

export const computeConnectedComponents = (d: Droplet): CCMatrix => {};
