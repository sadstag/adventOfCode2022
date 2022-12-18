export type BlockType =
  | "L" //lava
  | "A" // air
  | "W"; // water

export type Coordinates = [number, number, number];

export type Droplet = BlockType[][][];

export type Input = Droplet;

export type Output = number;
