import { Interpretor } from "common";
import { Input } from "./types.ts";

function interpreteLine(line: string, lineNumber: number): FOO {
  const size = line.length;
  if (size == 0) {
    throw Error(`Line #${lineNumber}: length is empty`);
  }

  return 0;
}

export const interprete: Interpretor<Input> = (lines) =>
  lines.map(interpreteLine);
