// @deno-types="npm:@types/ramda"
import { identity, map, split, sum, sort, descend } from "npm:ramda";

const __dirname = new URL(".", import.meta.url).pathname;

export function resolve(file: string): number {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync(file);
  const inputData = decoder.decode(data);

  const blocs = split("\n\n", inputData);

  const elvesCalories = map(split("\n"), blocs);

  const elvesCaloriesAsNumbers = map(map(Number), elvesCalories);

  const elvesTotalCalories = map(sum, elvesCaloriesAsNumbers);

  const [n1 = 0, n2 = 0, n3 = 0] = sort(descend(identity), elvesTotalCalories);

  return n1 + n2 + n3;
}

console.log(resolve(`${__dirname}/input.txt`));
