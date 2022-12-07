// @deno-types="npm:@types/ramda"
import { map, identity, sortBy } from "ramda";

import { Solver } from "common";

import { buildTree, findAll, Node } from "./tree.ts";
import { Output, Input } from "./types.ts";

type NodeData = {
  totalSize: number;
};
const defaultData: NodeData = {
  totalSize: 0,
};

// mutates !
const computeTotalNodeSize = (n: Node<NodeData>) => {
  if (n.type == "file") {
    n.data.totalSize = n.size;
    return;
  }
  n.data.totalSize = n.children.reduce((sum, child) => {
    computeTotalNodeSize(child); // mad
    return sum + child.data.totalSize;
  }, 0);
};

export const solve: Solver<Input, Output> = (input: Input) => {
  const tree = buildTree(input, defaultData);
  computeTotalNodeSize(tree);

  const unusedSpace = 70000000 - tree.data.totalSize;
  const neededSpace = 30000000 - unusedSpace;

  const candidateFolders = findAll((n: Node<NodeData>) => {
    return n.type === "folder" && n.data.totalSize >= neededSpace;
  })(tree);

  const [minFolderTotalSize] = sortBy(
    identity,
    map((n) => n.data.totalSize, candidateFolders)
  );

  return minFolderTotalSize;
};
