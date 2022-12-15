// @deno-types="npm:@types/ramda"
import { compose, map, split } from "ramda";

import { Interpretor } from "common";
import { Input, Location } from "./types.ts";

const interpreteLocation = compose(
  ([x, y]) => ({ x: parseInt(x, 10), y: parseInt(y, 10) }),
  split(",")
) as unknown as (s: string) => Location;

const interpreteLine = compose(map(interpreteLocation), split(" -> "));

export const interprete: Interpretor<Input> = map(interpreteLine);
