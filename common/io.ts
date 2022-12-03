import { split } from "ramda";

export function readlines(file: string): string[] {
  const decoder = new TextDecoder("utf-8");
  const data = Deno.readFileSync(file);
  return split("\n", decoder.decode(data));
}
