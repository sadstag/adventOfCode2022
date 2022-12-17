// @deno-types="npm:@types/ramda"
import { drop, identity, map } from "ramda";

import { log } from "common";

import { Solver } from "common";
import { Output, Input, Direction } from "./types.ts";
import { buildChamber, makeLeap } from "./chamber.ts";
import { forceLog, setLogActivated } from "../../../common/log.ts";
import { buildMemo } from "./memo.ts";
import {
  LEAP_OPTIMIZATION,
  LOG_ACTIVATED,
  PROGRESS_EVERY_NB_ROCKS,
  TARGET_NB_ROCKS,
} from "./config.ts";
import { drawChamber } from "./draw.ts";
import { dropNextRock } from "./drop.ts";

export const solve: Solver<Input, Output> = (jets: Direction[]) => {
  setLogActivated(LOG_ACTIVATED);

  let chamber = buildChamber(7);

  const memo = buildMemo();

  let leapDone = false;

  while (chamber.nbLandedRocks < TARGET_NB_ROCKS) {
    const { chamber: newChamber, chamberInMemo } = dropNextRock(
      chamber,
      jets,
      memo
    );

    chamber = newChamber;

    if (
      LEAP_OPTIMIZATION &&
      !leapDone && // just one leap would be necessary
      chamberInMemo
    ) {
      chamber = makeLeap(
        newChamber,
        chamberInMemo,
        jets,
        memo,
        TARGET_NB_ROCKS
      );
      leapDone = true;
      forceLog(chamber);

      //Deno.exit(0);
    }

    log(
      "========== rock #" + chamber.nbLandedRocks + " landed ================"
    );
    log(drawChamber(chamber));
    log("==== New tower height : " + chamber.rockLevelAcrossTruncates);

    if (chamber.nbLandedRocks % PROGRESS_EVERY_NB_ROCKS === 0) {
      forceLog(`Rock #${chamber.nbLandedRocks} landed !`);
    }

    //if (chamber.nbLandedRocks === 10) break;
  }

  console.log({ nbLandedRocks: chamber.nbLandedRocks, time: chamber.time });

  return chamber.rockLevelAcrossTruncates;
};
