export type Location = { x: number; y: number };

export type Vector = Location;

export type Path = Location[];

export const SOURCE = 0;
export const AIR = 1;
export const ROCK = 2;
export const SAND = 3;

export type Cell = typeof SOURCE | typeof AIR | typeof ROCK | typeof SAND;
export type Board = {
  cells: Cell[][]; // first dim : y : second : x

  // offset: what to add to cell coordinates so that they match the coordinates as given in input
  offset: Vector;

  // dimensions of the grid
  size: Vector;

  // where sand is falling from
  source: Location;
};

export type Input = Path[];

export type Output = number;

export const drawLocation = ({ x, y }: Location): string => `${x},${y}`;
