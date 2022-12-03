function usage() {
  console.log("deno run main <day> <part>\nex:deno run main 3 1");
}

const [dayArg, partArg] = Deno.args;

if (!(dayArg && partArg)) {
  usage();
  Deno.exit(1);
}

const day = parseInt(dayArg);
const part = parseInt(partArg);

if (day < 3) {
  console.log("day < 3 are to be launched in their own dir");
  Deno.exit(2);
}

const subMain = `./day/${day}/part${part}/main.ts`;

console.log(`Launching ${subMain} ...`);
console.log("------------------------------------------");

const p = Deno.run({
  cmd: ["deno", "run", "-A", "--import-map=./import_map.json", subMain],
});

const status = await p.status();

Deno.exit(status.code);
