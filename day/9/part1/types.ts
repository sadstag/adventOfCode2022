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
  head: Position;
  tail: Position;
  lastMove: Move | null;
};

export type History = Board[];

export const newBoard = (): Board => ({
  head: { x: 0, y: 0 },
  tail: { x: 0, y: 0 },
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

const applySingleMove = (
  direction: Direction,
  { head, tail }: Board
): Board => {
  const newHead = translate(head, direction);
  let newTail: Position;
  if (areSame(head, tail) || areSame(newHead, tail)) {
    // head and tail were on the same spot, tail stays
    // or head rejoin the tail : tail stays
    newTail = tail;
  } else if (areTouching(newHead, tail)) {
    // head moved around tail, it still at distance 1
    newTail = tail;
  } else {
    newTail = head; // tail follows, it is now were head was
  }

  return { head: newHead, tail: newTail, lastMove: { direction, distance: 1 } };
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
