import { log } from "common";
import { addRock, Chamber, extendChamber, rockOverlays } from "./chamber.ts";
import { drawChamberWithFallingRock } from "./draw.ts";
import { Memo } from "./memo.ts";
import { getRockShape } from "./rock.ts";
import { Direction } from "./types.ts";

type DropRockOutcome = {
  chamber: Chamber;
  chamberInMemo?: Chamber;
};

export const dropNextRock = (
  chamber: Chamber,
  jets: Direction[],
  memo: Memo,
  withTruncation = true
): DropRockOutcome => {
  const [rockShapeIndex, rockShape] = getRockShape(chamber.nbLandedRocks);

  // make room for the shape
  extendChamber(chamber, rockShape);

  // log("========== chamber extended ================");
  // log(drawChamber(chamber));

  let x = 2;
  let y = chamber.rockLevel + 3;

  log(`========== rock #${chamber.nbLandedRocks + 1} spawned ================`);
  log(drawChamberWithFallingRock(chamber, rockShape, x, y));

  while (true) {
    const directionIndex = chamber.time % jets.length;
    const direction = jets[directionIndex];
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

    if (rockOverlays(rockShape, x, y - 1, chamber)) {
      // done !
      chamber.lastDirectionIndex = directionIndex;
      chamber.lastShapeIndex = rockShapeIndex;
      chamber.time++;
      const outcome = addRock(rockShape, x, y, chamber, memo, withTruncation);
      if (outcome.type === "added") {
        return { chamber: outcome.chamber };
      }

      return {
        chamber: outcome.chamber,
        chamberInMemo: outcome.chamberInMemo,
      };
    }

    chamber.time++;

    y -= 1;
    // log(`========== rock #${rockNumber} falling to x=${x}, y=${y} : succeed ================`);
    // log(drawChamberWithFallingRock(chamber, rockShape, x, y));
  }
};
