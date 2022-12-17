// @deno-types="npm:@types/ramda"
import { always, compose, equals, head, ifElse, map, split } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";

export const interprete: Interpretor<Input> = compose(
  map(ifElse(equals("<"), always(-1), always(1))),
  split(""),
  head
);
