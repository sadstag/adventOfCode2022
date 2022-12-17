// @deno-types="npm:@types/ramda"
import { clone, range } from "ramda";
import { Shape } from "./shape.ts";
import { forceLog, log } from "common";
import { addChamber, Memo } from "./memo.ts";
import {
  CLONE_CHAMBERS,
  LEAP_OPTIMIZATION,
  TRUNCATION_OPTIMIZATION,
} from "./config.ts";
import { dropNextRock } from "./drop.ts";
import { Direction } from "./types.ts";

export type Chamber = Shape & {
  time: number;
  rockLevel: number; // y coordinate of highest rock block in the tower
  rockLevelAcrossTruncates: number; // this is not reset by truncation
  nbLandedRocks: number;

  // facility for leap
  lastDirectionIndex: number; // index of direction that led to this chamber
  lastShapeIndex: number; // index og the shpae that was last added to this chamber
};

export const buildChamber = (w: number): Chamber => ({
  time: 0,
  w,
  h: 0,
  m: new Array(0),
  rockLevel: 0,
  rockLevelAcrossTruncates: 0,
  nbLandedRocks: 0,
  lastDirectionIndex: 0,
  lastShapeIndex: 0,
});

export const extendChamber = (chamber: Chamber, rockShape: Shape) => {
  const toAdd = 3 + rockShape.h;
  const targetHeight = chamber.rockLevel + toAdd;
  for (const y of range(chamber.h, targetHeight)) {
    chamber.m[y] = new Array(chamber.w).fill(false);
  }
  chamber.h = targetHeight;
};

export const rockOverlays = (
  rockShape: Shape,
  xRock: number,
  yRock: number,
  chamber: Chamber
): boolean => {
  if (xRock < 0 || xRock + rockShape.w > chamber.w || yRock < 0) return true;

  for (let y = 0; y < rockShape.h; y++) {
    for (let x = 0; x < rockShape.w; x++) {
      if (chamber.m[y + yRock][x + xRock] && rockShape.m[y][x]) {
        return true;
      }
    }
  }
  return false;
};

type AddRockOutcome =
  | {
      type: "added";
      chamber: Chamber;
    }
  | {
      type: "found in memo";
      chamber: Chamber;
      chamberInMemo: Chamber;
    };

export const addRock = (
  rockShape: Shape,
  xRock: number,
  yRock: number,
  chamber: Chamber,
  memo: Memo,
  withTruncation: boolean
): AddRockOutcome => {
  let newChamber = CLONE_CHAMBERS ? clone(chamber) : chamber;
  for (let y = 0; y < rockShape.h; y++) {
    for (let x = 0; x < rockShape.w; x++) {
      newChamber.m[y + yRock][x + xRock] =
        chamber.m[y + yRock][x + xRock] || rockShape.m[y][x];
    }
  }

  const oldRockLevel = chamber.rockLevel;
  newChamber.rockLevel = Math.max(oldRockLevel, yRock + rockShape.h);
  // overall rock level is rised the same amount
  newChamber.rockLevelAcrossTruncates += newChamber.rockLevel - oldRockLevel;

  newChamber.nbLandedRocks++;

  //
  // chamber truncation optimization
  //
  if (withTruncation && TRUNCATION_OPTIMIZATION) {
    if (
      yRock > 100
      //yRock > rockShape.h
    ) {
      for (let y = yRock - rockShape.h; y < yRock + rockShape.h - 1; y++) {
        // let's look whether this line in the chamber compose a blocking pattern
        // with the following after
        let blocking = true;
        for (let x = 0; x < newChamber.w; x++) {
          blocking &&= newChamber.m[y][x] || newChamber.m[y + 1][x];
        }
        if (blocking) {
          forceLog("Full ! At " + y + "-" + (y + 1) + " -> truncate");

          // truncate chambre
          newChamber = truncateChamber(newChamber, y);
          break;
        }
      }
    }
  }

  if (LEAP_OPTIMIZATION) {
    // it's time to get a imprint of the chamber
    // together with a modulo of the time regarding input (jet direction, rock shape)
    // so that
    // if we ever retriev the same chamber imprint and the same time modulo altogether
    // then we know it will repeat

    const outcome = addChamber(newChamber, memo);
    if (outcome.type === "found") {
      return {
        type: "found in memo",
        chamberInMemo: outcome.chamber,
        chamber: newChamber,
      };
    }
  }

  return { type: "added", chamber: newChamber };
};

// reallocate a chamber by truncate up to y (reallocates)
const truncateChamber = (chamber: Chamber, y: number): Chamber => {
  const truncatedChamber: Chamber = {
    time: chamber.time,
    w: chamber.w,
    h: chamber.h - y,
    m: chamber.m.slice(y),
    rockLevel: chamber.rockLevel - y,
    rockLevelAcrossTruncates: chamber.rockLevelAcrossTruncates,
    nbLandedRocks: chamber.nbLandedRocks,
    lastDirectionIndex: chamber.lastDirectionIndex,
    lastShapeIndex: chamber.lastShapeIndex,
  };

  // console.log("-----before truncate----");
  // console.log(drawChamber(chamber));
  // console.log("-----after truncate----");
  // console.log(drawChamber(truncatedChamber));

  return truncatedChamber;
};

export const areSameChambersData = (
  m1: boolean[][],
  m2: boolean[][]
): boolean => {
  if (m1.length != m2.length) return false;
  for (let y = 0; y < m1.length; y++) {
    if (m1[y].length !== m2[y].length) {
      return false;
    }
    for (let x = 0; x < m1[y].length; x++) {
      if (m1[y][x] !== m2[y][x]) {
        return false;
      }
    }
  }
  return true;
};

// land as many rocks as asked
// advancing time and chamber rock levels using the given snapshot
// mutates memo and chamber
export const makeLeap = (
  chamber: Chamber,
  chamberInMemo: Chamber,
  jets: Direction[],
  memo: Memo,
  nbRocksTarget: number
): Chamber => {
  const nbLandableBlockPerApplication =
    chamber.nbLandedRocks - chamberInMemo.nbLandedRocks;
  const elapsedTimePerApplication = chamber.time - chamberInMemo.time;
  const nbApplications = Math.floor(
    (nbRocksTarget - chamber.nbLandedRocks) / nbLandableBlockPerApplication
  );

  const rockLevelGainPerApplication =
    chamber.rockLevelAcrossTruncates - chamberInMemo.rockLevelAcrossTruncates;

  forceLog({
    nbApplications,
    nbLandableBlockPerApplication,
    elapsedTimePerApplication,
    rockLevelGainPerApplication,
  });

  const chamberAfterLeap: Chamber = {
    time: chamber.time + elapsedTimePerApplication * nbApplications,
    w: chamber.w,
    h: chamber.h,
    m: chamber.m,
    rockLevel: chamber.rockLevel,
    rockLevelAcrossTruncates:
      chamber.rockLevelAcrossTruncates +
      nbApplications * rockLevelGainPerApplication,
    nbLandedRocks:
      chamber.nbLandedRocks + nbApplications * nbLandableBlockPerApplication,
    lastDirectionIndex: chamber.lastDirectionIndex,
    lastShapeIndex: chamber.lastShapeIndex,
  };

  return chamberAfterLeap;
};
