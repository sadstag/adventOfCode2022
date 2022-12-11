// @deno-types="npm:@types/ramda"
import { compose, equals, map, split, splitWhenever, trim } from "ramda";

import { Interpretor } from "common";
import { Input, Monkey, Operation } from "./types.ts";

const splitBySemiColon = split(":");

// suppose everything is ok in input, as it is the case in the contest
const interpreteMonkeyLines = (lines: string[]): Monkey => {
  // first line ignored (monkey id, consistent by given sample)
  const [idLine, itemsLine, operationLine, testLine, testOkLine, testKoline] =
    lines;
  const [_2, idStr] = idLine.match(/^Monkey (\d+):$/)!;
  const [_3, itemListStr] = splitBySemiColon(itemsLine);
  const [_4, operator, operand] = operationLine.match(
    /Operation: new = old ([\*\+]) (.+)$/
  )!;
  const [_5, testModuloStr] = testLine.match(/Test: divisible by (\d+)$/)!;
  const [_6, monkeyIdTestOkStr] = testOkLine.match(
    /If true: throw to monkey (\d+)$/
  )!;
  const [_7, monkeyIdTestKoStr] = testKoline.match(
    /If false: throw to monkey (\d+)$/
  )!;

  let operation: Operation = { type: "square" };
  if (operator === "*") {
    if (operand !== "old") {
      operation = { type: "multiplication", operand: parseInt(operand) };
    }
  } else {
    operation = { type: "addition", operand: parseInt(operand) };
  }

  return {
    id: parseInt(idStr),
    items: map(
      compose((s: string) => parseInt(s, 10), trim),
      split(",", itemListStr)
    ),
    operation,
    test: {
      modulo: parseInt(testModuloStr),
      monkeyIdWhenTestOk: parseInt(monkeyIdTestOkStr),
      monkeyIdWhenTestKo: parseInt(monkeyIdTestKoStr),
    },
    nbItemInspections: 0,
  };
};

export const interprete: Interpretor<Input> = (lines: string[]) => {
  const monkeyLines = splitWhenever(equals(""), lines);
  return map(interpreteMonkeyLines, monkeyLines);
};
