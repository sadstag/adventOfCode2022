// @deno-types="npm:@types/ramda"
import { map } from "ramda";

import { Interpretor } from "common";
import { Input } from "./types.ts";
import { buildScan, upsertLocation } from "./scan.ts";

type RawDetection = [
  number, // sensorX
  number, // sensorY
  number, // beaconX
  number // beaconY
];

const RE =
  /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)$/;

const interpreteLine = (line: string): RawDetection => {
  const [_, ...detection] = map(
    (s: string) => parseInt(s, 10),
    line.match(RE)!
  );
  return detection as unknown as RawDetection;
};

export const interprete: Interpretor<Input> = (lines: string[]) => {
  const scan = buildScan();
  const rawDetections = map(interpreteLine, lines);
  for (const rawDetection of rawDetections) {
    const [sensorX, sensorY, beaconX, beaconY] = rawDetection;
    const sensorID = upsertLocation(
      { x: sensorX, y: sensorY },
      "sensors",
      scan
    );
    const beaconID = upsertLocation(
      { x: beaconX, y: beaconY },
      "beacons",
      scan
    );
    scan.detections.set(sensorID, beaconID);
  }
  return scan;
};
