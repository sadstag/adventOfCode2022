// @deno-types="npm:@types/ramda"
import { map, split } from "ramda";

import { Interpretor } from "common";
import { Dock, Input, Move } from "./types.ts";

const regexp = /^move (\d+) from (\d+) to (\d+)$/;

function interpreteMoveLines(line: string): Move {
  const [_, nb, from, to] = line.match(regexp)!;
  return {
    nb: parseInt(nb),
    from: parseInt(from) - 1,
    to: parseInt(to) - 1,
  };
}

function interpreteDock(): Dock {
  // "cheat" !
  const dock = map(split(""), [
    "NQLSCZPT",
    "GCHVTPL",
    "FZCD",
    "CVMLDTWG",
    "CWP",
    "ZSTCDJFP",
    "DBGWV",
    "WHQSJN",
    "VLSFQCR",
  ]);

  // [N]         [C]     [Z]
  // [Q] [G]     [V]     [S]         [V]
  // [L] [C]     [M]     [T]     [W] [L]
  // [S] [H]     [L]     [C] [D] [H] [S]
  // [C] [V] [F] [D]     [D] [B] [Q] [F]
  // [Z] [T] [Z] [T] [C] [J] [G] [S] [Q]
  // [P] [P] [C] [W] [W] [F] [W] [J] [C]
  // [T] [L] [D] [G] [P] [P] [V] [N] [R]
  //  1   2   3   4   5   6   7   8   9

  return dock;
}
export const interprete: Interpretor<Input> = (lines) => {
  const dock = interpreteDock();
  return {
    dock,
    moves: lines.map(interpreteMoveLines),
  };
};
