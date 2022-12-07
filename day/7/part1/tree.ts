// @deno-types="npm:@types/ramda"
import { append, clone, concat, map, tail, unnest } from "ramda";

import { Command, LsOutputLine } from "./command.ts";

type NodeCommon<T> = {
  name: string;
  data: T;
};

type File<T> = {
  type: "file";
  size: number;
} & NodeCommon<T>;

type Folder<T> = {
  type: "folder";
  children: Node<T>[];
} & NodeCommon<T>;

export type Node<T> = Folder<T> | File<T>;

export type FSTree<T> = Folder<T>;

type BuildContext<T> = {
  tree: FSTree<T>;
  currentBuildPath: Folder<T>[]; // first: current folder, last : direct child of root
};

export const findChildrenFolder = <T>(
  directory: string,
  parent: Folder<T>
): Folder<T> =>
  parent.children.find(
    (n: Node<T>) => n.type === "folder" && n.name === directory
  ) as unknown as Folder<T>;

export const buildNode =
  <T>(defaultData: T) =>
  (n: LsOutputLine): Node<T> => {
    if (n.type === "folder") {
      return {
        type: "folder",
        name: n.name,
        children: [],
        data: clone(defaultData),
      };
    }
    return { type: "file", name: n.name, size: n.size, data: defaultData };
  };

export const executeCommand = <T>(
  command: Command,
  context: BuildContext<T>,
  defaultData: T
): BuildContext<T> => {
  const { tree, currentBuildPath } = context;
  const [currentFolder = tree] = currentBuildPath;
  if (command.type === "cd") {
    const { directory } = command;
    if (directory === "..") {
      return {
        tree,
        currentBuildPath: tail(currentBuildPath),
      };
    }
    return {
      tree,
      currentBuildPath: [
        findChildrenFolder<T>(directory, currentFolder),
        ...currentBuildPath,
      ],
    };
  }
  currentFolder.children = map(buildNode(defaultData), command.output);
  return context;
};

export const buildTree = <T>(
  commands: Command[],
  defaultData: T
): FSTree<T> => {
  const root: Folder<T> = {
    type: "folder",
    name: "/",
    children: [],
    data: clone(defaultData),
  };
  let context: BuildContext<T> = {
    tree: root,
    currentBuildPath: [],
  };
  const remainingCommands = commands;
  while (remainingCommands.length > 0) {
    const command = remainingCommands.shift()!;
    context = executeCommand(command, context, defaultData);
  }

  return context.tree;
};

export const findAll =
  <T>(predicate: (n: Node<T>) => boolean) =>
  (inNode: Node<T>): Node<T>[] => {
    let result = predicate(inNode) ? [inNode] : [];
    if (inNode.type === "folder") {
      result = concat(result, unnest(map(findAll(predicate), inNode.children)));
    }
    return result;
  };
