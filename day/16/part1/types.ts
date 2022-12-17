// valves ID are numbers, from 0 to N as appearing in input

export type Puzzle = {
  valves: string[];
  tunnels: number[][];
  flows: number[];
};

export type Input = Puzzle;

export type Output = number;
