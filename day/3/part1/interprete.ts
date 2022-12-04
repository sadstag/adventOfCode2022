import { Interpretor } from "common";
import { Char, chars, Input, RuckSack } from "./types.ts";

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
      sourceLine: line,
      left: makeSet(LeftLetters),
      right: makeSet(rightLetters),
    };
  } catch (e) {
    throw Error(`Line #${lineNumber}:${e.message}`);
  }

  return rucksack;
}

export const interprete: Interpretor<Input> = (lines) =>
  lines.map(interpreteLine);
