// @deno-types="npm:@types/ramda"
import { map, sum } from "npm:ramda";

import { readlines } from "./io.ts";
import {
  findMeMoveFromOutcomeAndOpponentMove,
  findOutcomesForMoves,
  interprete,
  outcomeScore,
  Round,
  RoundDirective,
  simpleScore,
} from "./types.ts";

const __dirname = new URL(".", import.meta.url).pathname;

function evaluateRound(r: Round) {
  return (
    simpleScore[r.me] + outcomeScore[findOutcomesForMoves(r.opponent, r.me)]
  );
}

function mapDirectiveToRounds({ opponent, outcome }: RoundDirective): Round {
  const me = findMeMoveFromOutcomeAndOpponentMove(opponent, outcome);
  return {
    opponent,
    me,
  };
}

export function resolve(file: string): number {
  const input = interprete(readlines(file));

  const rounds = map(mapDirectiveToRounds, input);

  const totalScore = sum(map(evaluateRound, rounds));

  return totalScore;
}

console.log(resolve(`${__dirname}/input.txt`));
