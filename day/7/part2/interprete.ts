// @deno-types="npm:@types/ramda"
import { startsWith, splitWhen, map } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";
import { Command, LsOutputLine } from "./command.ts";

const buildCommand = (s: string): Command => {
  const withoutPrompt = s.slice(2);
  if (withoutPrompt === "ls") {
    return {
      type: "ls",
      output: [],
    };
  }
  return {
    type: "cd",
    directory: withoutPrompt.slice(3),
  };
};

const parseLsCommandOutputLines = (line: string): LsOutputLine => {
  const match = line.match(/^(\w+) ([\w\.]+)$/);
  if (!match) {
    throw Error(`Line "${line}" does not match ls command output line`);
  }
  const [_, elt1, elt2] = match;
  if (elt1 === "dir") {
    return { type: "folder", name: elt2 };
  }
  return {
    type: "file",
    name: elt2,
    size: parseInt(elt1),
  };
};

const aggregateOutput = (command: Command, outputLines: string[]): Command => {
  if (command.type === "cd") return command;
  return {
    type: "ls",
    output: map(parseLsCommandOutputLines, outputLines),
  };
};

type ParserAcc = {
  remainingLines: string[];
  command: Command;
};

const parseOneCommand = (lines: string[]): ParserAcc => {
  const [cmdStr, ...rest] = lines;
  const command = buildCommand(cmdStr);

  const [outputLines, remainingLines] = splitWhen(startsWith("$"), rest);

  const cmdWithOutput = aggregateOutput(command, outputLines);

  return {
    remainingLines,
    command: cmdWithOutput,
  };
};

export const interprete: Interpretor<Input> = (lines) => {
  //   const root = { type: "folder", name: "/" };
  //   const buildAcc = { tree: root, currentNode: root };
  const commands = [];
  let remainingLines = lines;
  while (remainingLines.length > 0) {
    const { command, remainingLines: newRemainingLines } =
      parseOneCommand(remainingLines);
    remainingLines = newRemainingLines;
    commands.push(command);
  }
  return commands;
};
