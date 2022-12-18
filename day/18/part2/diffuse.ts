import { Coordinates, Droplet } from "./types.ts";

const directions = [
  [-1, 0, 0],
  [1, 0, 0],
  [0, -1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
];
// mutates droplet
export const diffuseWater = ([x, y, z]: Coordinates, d: Droplet) => {
  const dim = d.length;
  console.log({ x, y, z });
  if (d[x][y][z] !== "A") {
    return;
  }
  d[x][y][z] = "W";
  for (const v of directions) {
    const neighbor = [x + v[0], y + v[1], z + v[2]] as Coordinates;
    const [x2, y2, z2] = neighbor;
    if (
      x2 >= 0 &&
      y2 >= 0 &&
      z2 >= 0 &&
      x2 < dim &&
      y2 < dim &&
      z2 < dim &&
      d[x2][y2][z2] === "A"
    ) {
      //console.log("recurse " + [x, y, z] + " =>" + neighbor + "(v=" + v + ")");
      diffuseWater(neighbor, d);
    }
  }
};
