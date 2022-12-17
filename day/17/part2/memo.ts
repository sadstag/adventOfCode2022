import { sha256 } from "https://denopkg.com/chiefbiiko/sha256@v1.0.0/mod.ts";
// @deno-types="npm:@types/ramda"
import { clone } from "ramda";

import { areSameChambersData, Chamber } from "./chamber.ts";

import { forceLog } from "../../../common/log.ts";

// Imprint : shasum of "<lastDirectionIndex>-<lastShapeIndex>-jsonencode(chambermatrix)>"
type Imprint = string;

export type Memo = {
  snapshots: Map<Imprint, Chamber>;
};

export const buildMemo = (): Memo => ({
  snapshots: new Map(),
});

const computeImprint = (chamber: Chamber): string => {
  const { m, lastDirectionIndex, lastShapeIndex } = chamber;
  const matrixJson = JSON.stringify(m);
  return sha256(
    `${lastDirectionIndex}-${lastShapeIndex}-${matrixJson}`,
    "utf8",
    "hex"
  ) as string;
};

type AddChamberOutcome =
  | {
      type: "added";
    }
  | {
      type: "found";
      chamber: Chamber;
    };

export const addChamber = (chamber: Chamber, memo: Memo): AddChamberOutcome => {
  const { snapshots } = memo;

  const imprint = computeImprint(chamber);

  const chamberInMemo = snapshots.get(imprint);

  if (chamberInMemo) {
    // oh my !
    // worth a real check
    if (areSameChambersData(chamber.m, chamberInMemo.m)) {
      forceLog(
        "Periodicity found at time=" +
          chamber.time +
          ", lastDirectionIndex=" +
          chamber.lastDirectionIndex +
          ", lastShapeIndex=" +
          chamber.lastShapeIndex +
          ",  imprint=" +
          imprint
      );
      return { type: "found", chamber: chamberInMemo };
    } else {
      forceLog(
        "Boo !! false positive periodicity found at time=" +
          chamber.time +
          ", lastDirectionIndex=" +
          chamber.lastDirectionIndex +
          ", lastShapeIndex=" +
          chamber.lastShapeIndex +
          ", imprint=" +
          imprint
      );
    }
  } else {
    snapshots.set(imprint, clone(chamber));
  }
  return { type: "added" };
};
