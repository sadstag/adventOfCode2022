type InstructionNoop = {
  mnemonic: "noop";
};
type InstructionAdd = {
  mnemonic: "addx";
  operand: number;
};
export type Instruction = InstructionAdd | InstructionNoop;

export type Program = Instruction[];

type Registers = {
  X: number;
};
export type CPUState = {
  cycle: number;
  registers: {
    start: Registers;
    end: Registers;
  };
  instruction: Instruction;
  instructionInProgress: boolean;
};

type Pixel = "#" | ".";
export type Raster = Pixel[][];

export type CRT = {
  raster: Raster;
};

export type Execution = CPUState[];

export type Input = Program;
export type Output = string;
