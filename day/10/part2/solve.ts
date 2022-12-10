// @deno-types="npm:@types/ramda"
import {
  join,
  last,
  map,
  max,
  pluck,
  reduce,
  startsWith,
  sum,
  uniqWith,
} from "ramda";

import { Solver } from "common";
import {
  Output,
  Input,
  Program,
  CPUState,
  Execution,
  Instruction,
  CRT,
  Raster,
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

const buildRaster = (): Raster => {
  const raster = new Array(6);
  for (let i = 0; i < 6; i++) {
    raster[i] = new Array(40);
  }
  return raster;
};

// mutates crt raster
const advanceCRT = (crt: CRT, state: CPUState): CRT => {
  const { cycle } = state;
  const cycleIndex = cycle - 1;
  const row = Math.floor(cycleIndex / 40);
  const column = cycleIndex % 40;
  const visible = Math.abs(state.registers.start.X - column) <= 1;
  crt.raster[row][column] = visible ? "#" : ".";
  return crt;
};

const CRTToString = (crt: CRT): string => join("\n", map(join(""), crt.raster));

const drawCRT = (execution: Execution): string => {
  const [_, ...realExecution] = execution; // the first state is 'fake', CRT wont show it
  // console.log(realExecution.length);
  // console.log(Math.max(...pluck("cycle", realExecution)));
  let crt: CRT = {
    raster: buildRaster(),
  };
  for (const state of realExecution) {
    crt = advanceCRT(crt, state);
  }
  return CRTToString(crt);
};

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
  // for (const state of execution) {
  //   console.log(state);
  // }

  return drawCRT(execution);
};
