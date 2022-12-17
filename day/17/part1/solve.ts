// @deno-types="npm:@types/ramda"
import { drop, identity, map } from "ramda";

import { log } from "common";

import { Solver } from "common";
import { Output, Input, Direction } from "./types.ts";
import {
  addRock,
  buildChamber,
  Chamber,
  drawChamber,
  drawChamberWithFallingRock,
  extendChamber,
  rockOverlays,
} from "./chamber.ts";
import { getRockShape } from "./rock.ts";
import { Shape } from "./shape.ts";
import { forceLog, setLogActivated } from "../../../common/log.ts";

type DropRockOutcome = {
  time: number;
  processedJets: Direction[];
};

const dropNextRock = (
  chamber: Chamber,
  rockShape: Shape,
  jets: Direction[],
  time: number,
  rockNumber: number
): DropRockOutcome => {
  // make room for the shape
  extendChamber(chamber, rockShape);

  const processedJets: Direction[] = [];

  // log("========== chamber extended ================");
  // log(drawChamber(chamber));

  let x = 2;
  let y = chamber.rockLevel + 3;

  log(`========== rock #${rockNumber} spawned ================`);
  log(drawChamberWithFallingRock(chamber, rockShape, x, y));

  while (true) {
    time++;

    const direction = jets[time % jets.length];
    //log(`=== trying push to ${direction === 1 ? "right" : "left"}`);
    const xPushed = x + direction;
    if (rockOverlays(rockShape, xPushed, y, chamber)) {
      // log(
      //   `========== rock #${rockNumber} push to x=${xPushed}, y=${y} : failed ================`
      // );
    } else {
      x = xPushed;
      // log(
      //   `========== rock #${rockNumber} push to x=${xPushed}, y=${y} : succeed ================`
      // );
    }
    //log(drawChamberWithFallingRock(chamber, rockShape, x, y));

    processedJets.push(direction);

    if (rockOverlays(rockShape, x, y - 1, chamber)) {
      // done !
      addRock(rockShape, x, y, chamber);
      return { time, processedJets };
    }

    y -= 1;
    // log(`========== rock #${rockNumber} falling to x=${x}, y=${y} : succeed ================`);
    // log(drawChamberWithFallingRock(chamber, rockShape, x, y));
  }
};

export const solve: Solver<Input, Output> = (jets: Direction[]) => {
  setLogActivated(false);

  log(jets);

  const chamber = buildChamber(7);

  let time = -1;

  let nbRocks = 1;
  while (nbRocks <= 2022) {
    const rockShape = getRockShape(nbRocks - 1);
    const { time: newTime, processedJets } = dropNextRock(
      chamber,
      rockShape,
      jets,
      time,
      nbRocks
    );
    log("========== rock #" + nbRocks + " landed ================");
    log("==== Processed jets : " + processedJets);
    log(drawChamber(chamber));
    log("==== New tower height : " + chamber.rockLevel);
    time = newTime;

    if (nbRocks % 100 === 0) {
      forceLog(`Rock #${nbRocks} landed !`);
    }

    // maybe optimize : if some line is full of rock we can truncate the chamber
    // to speed up the rest of the drops

    //if (nbRocks === 10) break;

    nbRocks++;
  }

  return chamber.rockLevel;
};
