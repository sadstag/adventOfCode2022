// @deno-types="npm:@types/ramda"
import { clone, reduce } from "ramda";

type Item = number;
type MonkeyId = number;
export type Multiplication = {
  type: "multiplication";
  operand: number;
};
export type Addition = {
  type: "addition";
  operand: number;
};
export type Square = {
  type: "square";
};

export type Operation = Multiplication | Addition | Square;

export type Test = {
  modulo: number;
  monkeyIdWhenTestOk: number;
  monkeyIdWhenTestKo: number;
};
export type Monkey = {
  id: MonkeyId;
  items: Item[];
  operation: Operation;
  test: Test;
  nbItemInspections: number;
};

export type Round = {
  id: number;
  monkeys: Monkey[];
};

export type Input = Monkey[];
export type Output = number;

type ItemProcessingResult = {
  throwItem: Item; // re-evaluated item value
  throwTo: MonkeyId;
};

const evaluateItemWorryLevel = (item: Item, operation: Operation): Item => {
  let newValue = item;
  switch (operation.type) {
    case "addition":
      newValue += operation.operand;
      break;
    case "multiplication":
      newValue *= operation.operand;
      break;
    case "square":
      newValue *= newValue;
      break;
    default:
  }
  return Math.floor(newValue / 3); // by worrying reduction rule
};

const processItem = (
  item: Item,
  operation: Operation,
  test: Test
): ItemProcessingResult => {
  const throwItem = evaluateItemWorryLevel(item, operation);
  const throwTo =
    test[throwItem % test.modulo ? "monkeyIdWhenTestKo" : "monkeyIdWhenTestOk"];
  return {
    throwTo,
    throwItem,
  };
};

const animateMonkey = (nextMonkeys: Monkey[], monkey: Monkey): Monkey[] => {
  const { id, items, operation, test } = monkey;

  for (const item of items) {
    const { throwItem, throwTo } = processItem(item, operation, test);
    nextMonkeys[throwTo].items.push(throwItem);
  }

  nextMonkeys[id].items = [];
  nextMonkeys[id].nbItemInspections += items.length;

  return nextMonkeys;
};

export const nextRound = (round: Round): Round => {
  const { id: roundId, monkeys } = round;

  let nextMonkeys: Monkey[] = clone(monkeys);

  nextMonkeys = reduce(animateMonkey, nextMonkeys, nextMonkeys);

  return {
    id: roundId + 1,
    monkeys: nextMonkeys,
  };
};
