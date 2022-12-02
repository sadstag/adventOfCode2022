// @deno-types="npm:@types/ramda"
import { compose, map, max, reduce, split, sum } from "npm:ramda";

const __dirname = new URL(".", import.meta.url).pathname;

function readlines(file: string): string[] {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync(file);
  return split("\n", decoder.decode(data));
}

type OpponentInputMove = "A" | "B" | "C";
type MeInputMove = "X" | "Y" | "Z";

type Move = "rock" | "paper" | "scissors";

type Round = {
  opponent: Move;
  me: Move;
};

type Input = Round[];

const opponentMovesMap: Record<OpponentInputMove, Move> = {
  A: "rock",
  B: "paper",
  C: "scissors",
};

const meMovesMap: Record<MeInputMove, Move> = {
  X: "rock",
  Y: "paper",
  Z: "scissors",
};

function mapOpponentMove(move: OpponentInputMove): Move {
  return opponentMovesMap[move];
}

function mapMeMove(move: MeInputMove): Move {
  return meMovesMap[move];
}

function interprete(lines: string[]): Input {
  return map(
    compose(
      ([moveOpponentABC, moveMeXYZ]) => ({
        opponent: mapOpponentMove(moveOpponentABC as OpponentInputMove),
        me: mapMeMove(moveMeXYZ as MeInputMove),
      }),
      split(" ")
    ),
    lines
  );
}

type RoundOutcome = "I win" | "I loose" | "draw";

const outcomes: Record<Move, Record<Move, RoundOutcome>> = {
  rock: {
    rock: "draw",
    paper: "I win",
    scissors: "I loose",
  },
  paper: {
    rock: "I loose",
    paper: "draw",
    scissors: "I win",
  },
  scissors: {
    rock: "I win",
    paper: "I loose",
    scissors: "draw",
  },
};
function roundOutcome({ opponent, me }: Round): RoundOutcome {
  return outcomes[opponent][me];
}

const simpleScore: Record<Move, number> = {
  rock: 1,
  paper: 2,
  scissors: 3,
};

const outcomeScore: Record<RoundOutcome, number> = {
  "I loose": 0,
  draw: 3,
  "I win": 6,
};

function evaluateRound(r: Round) {
  return simpleScore[r.me] + outcomeScore[roundOutcome(r)];
}

export function resolve(file: string): number {
  const input = interprete(readlines(file));

  const totalScore = sum(map(evaluateRound, input));

  return totalScore;
}

console.log(resolve(`${__dirname}/input.txt`));
