import { Interpretor } from "common";
import { Assignment, Input, Pair } from "./types.ts";

function interpreteAssignment(s: string): Assignment {
  const [fromS, toS] = s.split("-");
  if (!(fromS && toS)) {
    throw Error("Range does not parse");
  }
  const from: number = parseInt(fromS);
  const to: number = parseInt(toS);
  if (isNaN(from) || isNaN(to)) {
    throw Error("Range is not made of numbers");
  }

  if (from < 1) {
    throw Error("Range 'from' is negative or zero");
  }

  if (to < from) {
    throw Error("Range 'to' is stricly lesser than 'from'");
  }

  return { from, to };
}

function interpreteLine(line: string, lineNumber: number): Pair {
  const size = line.length;
  if (size == 0) {
    throw Error(`Line #${lineNumber}: length is empty`);
  }
  const [a1s, a2s] = line.split(",");

  if (!(a1s && a2s)) {
    throw Error(
      `line #${lineNumber}: separator ',' does not split into parseable strings (${line})`
    );
  }

  let a1: Assignment;
  let a2: Assignment;
  try {
    a1 = interpreteAssignment(a1s);
  } catch (e) {
    throw Error(
      `line #${lineNumber}: first assignment do not parse : ${e.message} (${a1s})`
    );
  }
  try {
    a2 = interpreteAssignment(a2s);
  } catch (e) {
    throw Error(
      `line #${lineNumber}: second assignment do not parse : ${e.message} (${a2s})`
    );
  }
  return [a1, a2];
}

export const interprete: Interpretor<Input> = (lines) =>
  lines.map(interpreteLine);
