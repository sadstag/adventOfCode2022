// @deno-types="npm:@types/ramda"
import { intersection } from "ramda";

export type Input = RuckSack[];

export type RuckSack = {
  sourceLine: string;
  left: Set<Char>;
  right: Set<Char>;
};
export type Output = number;

export const chars = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

export type Char = typeof chars[number];

export function compartmentsIntersection(r: RuckSack): Set<Char> {
  return new Set(intersection([...r.left], [...r.right]));
}

export function evaluateCharPriority(c: Char): number {
  const cc = c.charCodeAt(0);
  if (cc >= 97) {
    // lowercase
    // a:1 -> z:26
    return cc - 97 + 1;
  }
  // uppercase
  // A:27 -> z:52
  return cc - 65 + 1 + 26;
}
