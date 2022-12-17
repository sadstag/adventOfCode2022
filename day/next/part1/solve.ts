// @deno-types="npm:@types/ramda"
import { identity } from "ramda";

import { Solver } from "common";
import { Output, Input } from "./types.ts";
import { log } from "common";
import { forceLog, setLogActivated } from "../../../common/log.ts";
import { LOG_ACTIVATED } from "./config.ts";

export const solve: Solver<Input, Output> = (input: Input) => {
  setLogActivated(LOG_ACTIVATED);
  log(input);

  // progression
  forceLog("Iteration=");

  return input.length;
};
