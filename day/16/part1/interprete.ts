// @deno-types="npm:@types/ramda"
import { equals, findIndex, map, split } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";

type valveRawInfo = {
  valveId: string;
  connectedValves: string[];
  flow: number;
};

const RE =
  /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (\w+(?:, \w+)*)$/;

export const interpreteLine = (line: string): valveRawInfo => {
  const [_, valveId, flowStr, connectedValvesStr] = line.match(RE)!;
  return {
    valveId,
    connectedValves: split(", ", connectedValvesStr),
    flow: parseInt(flowStr),
  };
};

export const interprete: Interpretor<Input> = (lines: string[]) => {
  const valves: string[] = [];
  const tunnelsStr: string[][] = [];
  const flows: number[] = [];
  for (const { valveId, connectedValves, flow } of map(interpreteLine, lines)) {
    valves.push(valveId);
    tunnelsStr.push(connectedValves);
    flows.push(flow);
  }
  const tunnels = map(
    map((valveId: string) => findIndex(equals(valveId), valves)),
    tunnelsStr
  );
  return { valves, tunnels, flows };
};
