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

export type Execution = CPUState[];

export type Input = Program;
export type Output = number;
