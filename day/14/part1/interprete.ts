// @deno-types="npm:@types/ramda"
import { isEmpty, map, splitWhenever } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";

export const interprete: Interpretor<Input> = (lines: string[]) => lines;
