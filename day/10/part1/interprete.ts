// @deno-types="npm:@types/ramda"
import { identity } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";

export const interprete: Interpretor<Input> = identity;
