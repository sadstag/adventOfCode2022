import { Solver } from "common";
import { Output, Input } from "./types.ts";

const hasDoublon = (s: string): boolean => {
  return new Set([...s]).size !== 14;
};

export const solve: Solver<Input, Output> = (input: Input) => {
  for (let i = 14; i < input.length; i++) {
    const candidate = input.slice(i - 14, i);
    if (hasDoublon(candidate)) continue;
    return i;
  }
  return -1;
};
