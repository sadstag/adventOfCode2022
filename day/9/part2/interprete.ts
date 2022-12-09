// @deno-types="npm:@types/ramda"
import { compose, map, split } from "ramda";

import { Interpretor } from "common";
import { Input, Move } from "./types.ts";

export const interprete: Interpretor<Input> = map(
  compose(
    ([direction, distanceStr]) =>
      ({ direction, distance: parseInt(distanceStr) } as Move),
    split(" ")
  )
);
