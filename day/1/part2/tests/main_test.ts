import { assertEquals } from "https://deno.land/std@0.166.0/testing/asserts.ts";
import { resolve } from "../main.ts";
// @deno-types="npm:@types/ramda"
import {
  compose,
  filter,
  identity,
  isEmpty,
  map,
  match,
  prop,
  reject,
  sortBy,
} from "npm:ramda";

const __dirname = new URL(".", import.meta.url).pathname;
const inputsDir = `${__dirname}/inputs`;

console.log(__dirname);
Deno.test("test", { permissions: { read: true } }, function resolveTest() {
  const files = [...Deno.readDirSync(inputsDir)];
  const fileNames = map(prop("name"), files);
  const testFilenames = reject(
    compose(isEmpty, match(/^\d+\.txt$/)),
    fileNames
  );
  const sortedTestFilenames = sortBy(identity<string>, testFilenames);

  for (const filename of sortedTestFilenames) {
    const [_, id] = match(/^(\d+)\.txt$/, filename);

    const expectedFilename = `${id}.expected.txt`;
    let expectedFileContent;
    try {
      expectedFileContent = Deno.readTextFileSync(
        `${inputsDir}/${expectedFilename}`
      );
    } catch (_e) {
      throw Error(`Could not find file ${expectedFilename}`);
    }

    const expected = Number(expectedFileContent);
    const result = resolve(`${inputsDir}/${filename}`);
    assertEquals(
      expected,
      result,
      `test id=${id} : expected ${expected}, got ${result}`
    );
  }
});
