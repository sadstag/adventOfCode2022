// @deno-types="npm:@types/ramda"
import { map, split } from "ramda";

import { Interpretor } from "common";
import { Input, Instruction } from "./types.ts";

const interpreteLine = (line: string): Instruction => {
  const [mnemonic, operand] = split(" ", line);
  if (mnemonic === "noop") {
    return { mnemonic: "noop" };
  }
  return {
    mnemonic: "addx",
    operand: parseInt(operand),
  };
};
export const interprete: Interpretor<Input> = (lines: string[]) =>
  map(interpreteLine, lines);
