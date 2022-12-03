// @deno-types="npm:@types/ramda"
import { compose } from "npm:ramda";

import { readlines } from "./io.ts";
import { Interpretor, Solver } from "./types.ts";

export const execute = <Input, Output>(
  file: string,
  interprete: Interpretor<Input>,
  solve: Solver<Input, Output>
) => {
  const run = compose(solve, interprete, readlines);
  const result = run(file);
  console.log(result);
};
