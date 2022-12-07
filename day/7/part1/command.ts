type LsOutputLineFile = {
  type: "file";
  name: string;
  size: number;
};

type LsOutputLineFolder = {
  type: "folder";
  name: string;
};

export type LsOutputLine = LsOutputLineFolder | LsOutputLineFile;

type CommandCd = {
  type: "cd";
  directory: string;
};

type CommandLs = {
  type: "ls";
  output: LsOutputLine[];
};

export type Command = CommandLs | CommandCd;
