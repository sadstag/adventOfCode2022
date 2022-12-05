// @deno-types="npm:@types/ramda"
import { concat, head, join, map, reverse, splitAt } from "ramda";

type Crate = string; // length 1
type Stack = Crate[];

export type Dock = Stack[];

export type Move = {
  nb: number;
  from: number;
  to: number;
};

export type Problem = {
  dock: Dock;
  moves: Move[];
};

export type Input = Problem;
export type Output = string;

export const applyMove = (dock: Dock, { nb, from, to }: Move): Dock => {
  console.log({ dock, nb, from, to });
  const [top, bottom] = splitAt(nb, dock[from]);

  const newDock = [...dock];
  newDock[from] = bottom;
  newDock[to] = concat(reverse(top), dock[to]);

  return newDock;
};

export const renderDock = (dock: Dock): string => join("", map(head, dock));
