// @deno-types="npm:@types/ramda"
import { isEmpty, map, splitWhenever } from "ramda";

import { Interpretor } from "common";
import { Input, PacketPair } from "./types.ts";

const interpreteCouple = (couple: string[]): PacketPair =>
  map(eval, couple) as PacketPair;

export const interprete: Interpretor<Input> = (lines: string[]) => {
  const couples = splitWhenever(isEmpty, lines);
  return map(interpreteCouple, couples);
};
