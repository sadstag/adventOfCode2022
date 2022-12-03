// @deno-types="npm:@types/ramda"
import { splitEvery } from "ramda";
import { Interpretor } from "common";
import { Char, chars, Group, Input, RuckSack } from "./types.ts";

function makeSet(rawLetters: string): Set<Char> {
  const arr = rawLetters.split("");
  for (const c of arr) {
    if (!chars.includes(c as Char)) {
      throw Error(`Illegal char '${c}'`);
    }
  }
  return new Set(arr) as Set<Char>;
}

function interpreteLine(line: string, lineNumber: number): RuckSack {
  const size = line.length;
  if (size == 0) {
    throw Error(`Line #${lineNumber}: length is empty`);
  }
  if (size % 2 != 0) {
    throw Error(`Line #${lineNumber}: length is odd`);
  }
  const halfSize = size / 2;
  const LeftLetters = line.slice(0, halfSize);
  const rightLetters = line.slice(halfSize, size);

  let rucksack: RuckSack;
  try {
    rucksack = {
      sourceLineNumber: lineNumber,
      sourceLine: line,
      left: makeSet(LeftLetters),
      right: makeSet(rightLetters),
    };
  } catch (e) {
    throw Error(`Line #${lineNumber}:${e.getMessage()}`);
  }

  return rucksack;
}

function interpreteGroup(
  [line1, line2, line3]: [string, string, string],
  groupNumber: number
): Group {
  return [
    interpreteLine(line1, groupNumber * 3),
    interpreteLine(line2, groupNumber * 3 + 1),
    interpreteLine(line3, groupNumber * 3 + 2),
  ];
}

export const interprete: Interpretor<Input> = (lines) => {
  if (lines.length % 3 !== 0) {
    throw Error("Number of line in input is not a multiple of 3");
  }
  const groupLines = splitEvery(3, lines) as [string, string, string][];
  return groupLines.map(interpreteGroup);
};
