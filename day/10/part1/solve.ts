// @deno-types="npm:@types/ramda"
import { last, map, pluck, reduce, startsWith, sum, uniqWith } from "ramda";

import { Solver } from "common";
import {
  Output,
  Input,
  Program,
  CPUState,
  Execution,
  Instruction,
} from "./types.ts";

const executeInstruction = (
  instruction: Instruction,
  state: CPUState
): CPUState[] => {
  if (instruction.mnemonic === "noop")
    return [
      {
        registers: {
          start: {
            X: state.registers.end.X,
          },
          end: {
            X: state.registers.end.X,
          },
        },
        instruction: instruction,
        instructionInProgress: false,
        cycle: state.cycle + 1,
      },
    ];
  return [
    // 1st cycle of add
    {
      registers: {
        start: {
          X: state.registers.end.X,
        },
        end: {
          X: state.registers.end.X,
        },
      },
      instruction: instruction,
      instructionInProgress: true,
      cycle: state.cycle + 1,
    },
    // 2nd cycle of add
    {
      registers: {
        start: {
          X: state.registers.end.X,
        },
        end: {
          X: state.registers.end.X + instruction.operand,
        },
      },
      instruction: instruction,
      instructionInProgress: false,
      cycle: state.cycle + 2,
    },
  ];
};

const advanceExecution = (
  execution: Execution,
  instruction: Instruction
): Execution => {
  const state = last(execution)!;
  return [...execution, ...executeInstruction(instruction, state)];
};

const evaluateSignalStrength =
  (execution: Execution) =>
  (cycle: number): number =>
    execution[cycle].registers.start.X * cycle;

export const solve: Solver<Input, Output> = (program: Program) => {
  // program = program.slice(0, 10);
  const initialExecution: Execution = [
    {
      cycle: 0,
      registers: {
        start: { X: 1 },
        end: { X: 1 },
      },
      instruction: { mnemonic: "noop" },
      instructionInProgress: false,
    },
  ];
  const execution = reduce(advanceExecution, initialExecution, program);
  for (const state of execution) {
    console.log(state);
  }

  const evaluate = evaluateSignalStrength(execution);
  return sum(map(evaluate, [20, 60, 100, 140, 180, 220]));
};
