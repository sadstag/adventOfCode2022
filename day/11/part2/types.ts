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

const evaluateItemWorryLevel = (
  item: Item,
  operation: Operation,
  moduloProduct: number
): Item => {
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
  return newValue % moduloProduct;
};

const processItem = (
  item: Item,
  monkey: Monkey,
  moduloProduct: number
): ItemProcessingResult => {
  const { operation, test } = monkey;
  const throwItem = evaluateItemWorryLevel(item, operation, moduloProduct);
  const throwTo =
    test[throwItem % test.modulo ? "monkeyIdWhenTestKo" : "monkeyIdWhenTestOk"];
  return {
    throwTo,
    throwItem,
  };
};

const animateMonkey =
  (moduloProduct: number) =>
  (nextMonkeys: Monkey[], monkey: Monkey): Monkey[] => {
    const { id, items } = monkey;

    for (const item of items) {
      const { throwItem, throwTo } = processItem(item, monkey, moduloProduct);
      nextMonkeys[throwTo].items.push(throwItem);
    }

    nextMonkeys[id].items = [];
    nextMonkeys[id].nbItemInspections += items.length;

    return nextMonkeys;
  };

export const nextRound = (round: Round): Round => {
  const { id: roundId, monkeys } = round;

  const moduloProduct = reduce(
    (product, monkey) => product * monkey.test.modulo,
    1,
    monkeys
  );

  let nextMonkeys: Monkey[] = clone(monkeys);

  nextMonkeys = reduce(animateMonkey(moduloProduct), nextMonkeys, nextMonkeys);

  return {
    id: roundId + 1,
    monkeys: nextMonkeys,
  };
};
