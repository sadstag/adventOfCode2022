// @deno-types="npm:@types/ramda"
import { map, join, compose, prop } from "ramda";
import {
  Path,
  Vector,
  Location,
  AIR,
  Cell,
  ROCK,
  Board,
  SAND,
  drawLocation,
  SOURCE,
} from "./types.ts";

const SOURCE_ABSOLUTE_LOCATION: Location = { x: 500, y: 0 };

const computeFrame = (paths: Path[]): { offset: Vector; size: Vector } => {
  const offset: Vector = { ...SOURCE_ABSOLUTE_LOCATION };
  //   {
  //     x: Number.MAX_SAFE_INTEGER,
  //     y: Number.MAX_SAFE_INTEGER,
  //   };
  const max: Location = { ...SOURCE_ABSOLUTE_LOCATION };
  //   {
  //     x: Number.MIN_SAFE_INTEGER,
  //     y: Number.MIN_SAFE_INTEGER,
  //   };
  for (const path of paths) {
    for (const location of path) {
      offset.x = Math.min(location.x, offset.x);
      offset.y = Math.min(location.y, offset.y);
    }
  }
  for (const path of paths) {
    for (const location of path) {
      max.x = Math.max(location.x, max.x);
      max.y = Math.max(location.y, max.y);
    }
  }
  const size = {
    x: max.x - offset.x + 1,
    y: max.y - offset.y + 1,
  };
  return { offset, size };
};

const translateLocation =
  ({ x: dx, y: dy }: Vector) =>
  ({ x, y }: Location): Location => ({
    x: x - dx,
    y: y - dy,
  });

const translatePaths = (offset: Vector, paths: Path[]) =>
  map(map(translateLocation(offset)), paths);

const traceLocation = (x: number, y: number, cell: Cell, cells: Cell[][]) => {
  try {
    cells[y][x] = cell;
  } catch (e) {
    console.log("!!", { x, y, row: cells[y] });
    throw e;
  }
};

const traceRockLine = (
  location1: Location,
  location2: Location,
  cells: Cell[][]
) => {
  if (location1.x === location2.x) {
    const min = Math.min(location1.y, location2.y);
    const max = Math.max(location1.y, location2.y);
    for (let row = min; row <= max; row++) {
      traceLocation(location1.x, row, ROCK, cells);
    }
    return;
  }
  if (location1.y === location2.y) {
    const min = Math.min(location1.x, location2.x);
    const max = Math.max(location1.x, location2.x);
    for (let column = min; column <= max; column++) {
      traceLocation(column, location1.y, ROCK, cells);
    }
    return;
  }
  throw Error(
    `non-ligned segment ${drawLocation(location1)} -> ${drawLocation(
      location2
    )}`
  );
};

// mutates cells
const traceRockPath = (path: Path, cells: Cell[][]) => {
  const [head1, head2, ...tail] = path;
  if (!head1) {
    return;
  }
  if (!head2) {
    traceLocation(head1.x, head1.y, ROCK, cells);
    return;
  }
  traceRockLine(head1, head2, cells);

  traceRockPath([head2, ...tail], cells);
};

export const buildBoard = (paths: Path[]): Board => {
  // displace
  const frame = computeFrame(paths);
  const translatedPaths = translatePaths(frame.offset, paths);

  // init
  const cells = new Array(frame.size.y);
  for (let row = 0; row < frame.size.y; row++) {
    cells[row] = new Array(frame.size.x);
    for (let column = 0; column < frame.size.x; column++) {
      cells[row][column] = AIR;
    }
  }

  // trace rock
  for (const path of translatedPaths) {
    traceRockPath(path, cells);
  }

  const source = translateLocation(frame.offset)(SOURCE_ABSOLUTE_LOCATION);
  traceLocation(source.x, source.y, SOURCE, cells);

  return {
    ...frame,
    source,
    cells,
  };
};

const CELL_CHARS: Record<Cell, string> = {
  [SOURCE]: "+",
  [AIR]: ".",
  [ROCK]: "#",
  [SAND]: "o",
};

const drawCell = (c: Cell): string => CELL_CHARS[c];

const drawRow: (c: Cell[]) => string = compose(join(""), map(drawCell));

export const drawBoard: (b: Board) => string = compose(
  join("\n"),
  map(drawRow),
  prop<Cell[][]>("cells")
);
