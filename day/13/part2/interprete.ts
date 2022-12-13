// @deno-types="npm:@types/ramda"
import { isEmpty, map, reject } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";

export const interprete: Interpretor<Input> = (lines: string[]) => {
  const packets = reject(isEmpty, lines);
  return map(eval, packets);
};
