type Direction = "U" | "D" | "L" | "R";

export type Move = {
  direction: Direction;
  distance: number;
};

export type Position = { x: number; y: number };
type Vector = Position;

// the state of the simulation
export type Board = {
  // starting point is at position (0,0)
  knots: Position[];
  lastMove: Move | null;
};

export type History = Board[];

const origin: Position = { x: 0, y: 0 };

export const newBoard = (nbKnots: number): Board => ({
  knots: new Array(nbKnots).fill(origin),
  lastMove: null,
});

export type Input = Move[];
export type Output = number;

const VECTOR: Record<Direction, Vector> = {
  U: { x: 0, y: 1 },
  D: { x: 0, y: -1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

export const areSame = (
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position
): boolean => x1 === x2 && y1 === y2;

const add = (
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Vector
): Position => ({ x: x1 + x2, y: y1 + y2 });

const areTouching = (
  { x: x1, y: y1 }: Position,
  { x: x2, y: y2 }: Position
): boolean => Math.abs(x2 - x1) <= 1 && Math.abs(y2 - y1) <= 1;

const translate = (position: Position, direction: Direction): Position =>
  add(position, VECTOR[direction]);

// tel where will be knot after the front knot moved from frontKnotBefore to frontKnot
const moveKnot = (
  knotBefore: Position,
  frontKnot: Position,
  frontKnotBefore: Position
): Position => {
  let knot: Position;
  if (areSame(frontKnot, knotBefore)) {
    // head and tail were on the same spot, tail stays
    // or head rejoin the tail : tail stays
    knot = knotBefore;
  } else if (areTouching(frontKnot, knotBefore)) {
    // head moved around tail, it still at distance 1
    knot = knotBefore;
  } else {
    knot = { ...knotBefore };
    if (knot.x === frontKnot.x) {
      knot.y += knot.y < frontKnot.y ? 1 : -1;
    } else if (knot.y === frontKnot.y) {
      knot.x += knot.x < frontKnot.x ? 1 : -1;
    } else {
      // tail move to the sourrounding of the head, diagonally
      knot.x += knot.x < frontKnot.x ? 1 : -1;
      knot.y += knot.y < frontKnot.y ? 1 : -1;
    }
  }
  return knot;
};

const applySingleMove = (direction: Direction, { knots }: Board): Board => {
  const [head, ...tail] = knots;

  const newHead = translate(head, direction);

  const newKnots = [newHead];

  let frontKnot = newHead;
  let frontKnotBefore = head;
  for (const knot of tail) {
    const newKnot = moveKnot(knot, frontKnot, frontKnotBefore);
    newKnots.push(newKnot);
    frontKnotBefore = knot;
    frontKnot = newKnot;
  }

  return {
    knots: newKnots,
    lastMove: { direction, distance: 1 },
  };
};

export const applyMove = (move: Move, board: Board): Board[] => {
  const { direction, distance } = move;
  let d = distance;
  const result: Board[] = [];
  let currentBoard = board;
  while (d) {
    currentBoard = applySingleMove(direction, currentBoard);
    result.push(currentBoard);
    d--;
  }
  return result;
};
