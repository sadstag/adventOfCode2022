// @deno-types="npm:@types/ramda"
import { compose, find, map, split } from "npm:ramda";
type OpponentInputMove = "A" | "B" | "C";
type OutcomeInput = "X" | "Y" | "Z";

export type Move = "rock" | "paper" | "scissors";

export type Round = {
  opponent: Move;
  me: Move;
};

export type RoundDirective = {
  opponent: Move;
  outcome: RoundOutcome;
};

type Input = RoundDirective[];

const opponentMovesMap: Record<OpponentInputMove, Move> = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const outcomesMap: Record<OutcomeInput, RoundOutcome> = {
  X: "I loose",
  Y: "draw",
  Z: "I win",
};

function mapOpponentMove(move: OpponentInputMove): Move {
  return opponentMovesMap[move];
}

function mapOutcome(outcome: OutcomeInput): RoundOutcome {
  return outcomesMap[outcome];
}

export function interprete(lines: string[]): Input {
  return map(
    compose(
      ([moveOpponentABC, outcome]) => ({
        opponent: mapOpponentMove(moveOpponentABC as OpponentInputMove),
        outcome: mapOutcome(outcome as OutcomeInput),
      }),
      split(" ")
    ),
    lines
  );
}

export type RoundOutcome = "I win" | "I loose" | "draw";

const outcomesFromMoves: (Round & RoundDirective)[] = [
  { opponent: "rock", me: "rock", outcome: "draw" },
  { opponent: "rock", me: "paper", outcome: "I win" },
  { opponent: "rock", me: "scissors", outcome: "I loose" },
  { opponent: "paper", me: "rock", outcome: "I loose" },
  { opponent: "paper", me: "paper", outcome: "draw" },
  { opponent: "paper", me: "scissors", outcome: "I win" },
  { opponent: "scissors", me: "rock", outcome: "I win" },
  { opponent: "scissors", me: "paper", outcome: "I loose" },
  { opponent: "scissors", me: "scissors", outcome: "draw" },
];

export function findOutcomesForMoves(opponent: Move, me: Move): RoundOutcome {
  const r = find(
    (r: Round & RoundDirective) => r.opponent === opponent && r.me === me,
    // both(propEq("opponent", opponent), propEq("me", me)),
    outcomesFromMoves
  )!;
  return r.outcome;
}

export function findMeMoveFromOutcomeAndOpponentMove(
  opponent: Move,
  outcome: RoundOutcome
): Move {
  const r = find(
    (r: Round & RoundDirective) =>
      r.opponent === opponent && r.outcome === outcome,
    //    both(propEq("opponent", opponent), propEq("outcome", outcome)),
    outcomesFromMoves
  )!;
  return r.me;
}

export const simpleScore: Record<Move, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

export const outcomeScore: Record<RoundOutcome, number> = {
  "I loose": 0,
  draw: 3,
  "I win": 6,
};
