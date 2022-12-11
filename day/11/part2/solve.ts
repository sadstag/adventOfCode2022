// @deno-types="npm:@types/ramda"
import { descend, prop, sort } from "ramda";

import { Solver } from "common";
import { Output, Input, Round, nextRound } from "./types.ts";

const NB_ROUNDS = 10000;

const evaluateRound = (round: Round): number => {
  const [m1, m2] = sort(descend(prop("nbItemInspections")), round.monkeys);
  return m1.nbItemInspections * m2.nbItemInspections;
};

export const solve: Solver<Input, Output> = (input: Input) => {
  let round: Round = {
    id: 0,
    monkeys: input,
  };
  for (let roundId = 1; roundId <= NB_ROUNDS; roundId++) {
    round = nextRound(round);
  }
  return evaluateRound(round);
};
