export type Interpretor<Input> = (lines: string[]) => Input;
export type Solver<Input, Output> = (input: Input) => Output;
