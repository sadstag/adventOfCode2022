// @deno-types="npm:@types/ramda"
import { findIndex } from "ramda";
import { Location, locationsAreEqual } from "./location.ts";
import { Range } from "./range.ts";

type Sensor = Location;
type Beacon = Location;

type SensorId = number;
type BeaconId = number;

export type Scan = {
  sensors: Sensor[]; // id of a sensor : index in this table
  beacons: Beacon[]; // id of a beacon : index in this table
  detections: Map<SensorId, BeaconId>;
};

export const findLocation = (
  location: Location,
  field: "sensors" | "beacons",
  scan: Scan
): SensorId | BeaconId | -1 =>
  findIndex(locationsAreEqual(location), scan[field]);

export const upsertLocation = (
  location: Location,
  field: "sensors" | "beacons",
  scan: Scan
): SensorId | BeaconId => {
  let id = findLocation(location, field, scan);
  if (id === -1) {
    id = scan[field].length;
    scan[field].push(location);
  }
  return id;
};

export const buildScan = (): Scan => ({
  sensors: [],
  beacons: [],
  detections: new Map(),
});

// tells then range in X axis which a given sensor has scanned, that is the 1D ball intersecting the scanning 2D ball of the sensor at y coordinate == Y
// it does not tell the loation where we are sure there is no beacon (because the beacon scanned by the sensor my be there), we'll answer that question elsewhere
// return null if intersection is empty
export const scannedRangeX = (
  scan: Scan,
  sensorId: SensorId,
  Y: number
): Range | null => {
  const { detections, sensors, beacons } = scan;

  const beaconId = detections.get(sensorId)!;

  const { x: sx, y: sy } = sensors[sensorId];
  const { x: bx, y: by } = beacons[beaconId];

  // resolving d(s,r) <= d(s,b)
  // that is : |sx-rx|+|sy,ry| <= |sx-bx|+|sy-by| with ry=Y, finding rx
  const ballRadius = Math.abs(sx - bx) + Math.abs(sy - by);
  const yDist = Math.abs(sy - Y);

  if (yDist > ballRadius) return null; // no intersection or just the frontier

  const range: Range = {
    from: sx + yDist - ballRadius,
    to: sx + ballRadius - yDist,
  };

  console.log({ sx, sy, bx, by, yDist, ballRadius, range });

  return range;
};
