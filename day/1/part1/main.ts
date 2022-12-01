// @deno-types="npm:@types/ramda"
import { map, max, reduce, split, sum } from "npm:ramda";

const __dirname = new URL(".", import.meta.url).pathname;

export function resolve(file: string): number {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync(file);
  const inputData = decoder.decode(data);

  const blocs = split("\n\n", inputData);

  const elvesCalories = map(split("\n"), blocs);

  const elvesCaloriesAsNumbers = map(map(Number), elvesCalories);

  const elvesTotalCalories = map(sum, elvesCaloriesAsNumbers);

  const maxCaloriesForElves = reduce<number, number>(
    max,
    0,
    elvesTotalCalories
  );
  return maxCaloriesForElves;
}

console.log(resolve(`${__dirname}/input.txt`));
