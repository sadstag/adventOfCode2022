import { execute } from "common";
import { interprete } from "./interprete.ts";
import { solve } from "./solve.ts";

const __dirname = new URL(".", import.meta.url).pathname;
const file = `${__dirname}/../input.txt`;

execute(file, interprete, solve);
