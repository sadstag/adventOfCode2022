import { Shape } from "./shape.ts";

export enum Rock {
  HLINE,
  CROSS,
  CORNER,
  VLINE,
  SQUARE,
}

// y = first dim = 0 : bottom of the shape
const rockShapes: Shape[] = [
  { w: 4, h: 1, m: [[true, true, true, true]] },
  {
    w: 3,
    h: 3,
    m: [
      [false, true, false],
      [true, true, true],
      [false, true, false],
    ],
  },
  {
    w: 3,
    h: 3,
    m: [
      [true, true, true],
      [false, false, true],
      [false, false, true],
    ],
  },
  { w: 1, h: 4, m: [[true], [true], [true], [true]] },
  {
    w: 2,
    h: 2,
    m: [
      [true, true],
      [true, true],
    ],
  },
];

export const getRockShape = (counter: number): Shape =>
  rockShapes[counter % rockShapes.length];
