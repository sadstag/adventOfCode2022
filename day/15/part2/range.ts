// @deno-types="npm:@types/ramda"
import { sortBy, prop } from "ramda";

// A range of coordinates, when "from" is less or equal to "to"
export type Range = { from: number; to: number };

export const rangeSize = ({ from, to }: Range): number => to - from;

export const rangeEqual = (
  { from: f1, to: t1 }: Range,
  { from: f2, to: t2 }: Range
): boolean => f1 == f2 && t1 === t2;

export const sortRanges: (ranges: Range[]) => Range[] = sortBy(prop("from"));

// return the merge of two ranges, or null if they are disjoints
export const merge = (r1: Range, r2: Range): Range | null => {
  if (r1.to < r2.from - 1 || r2.to < r1.from - 1) {
    return null;
  }
  return {
    from: Math.min(r1.from, r2.from),
    to: Math.max(r1.to, r2.to),
  };
};

// try to do the merge of two consecutives ranges in a sorted range array
const mergePass = (ranges: Range[]): Range[] => {
  for (let i = 0; i < ranges.length - 1; i++) {
    const fusion = merge(ranges[i], ranges[i + 1]);
    if (fusion) {
      return ranges
        .slice(0, i)
        .concat(fusion)
        .concat(...ranges.slice(i + 2));
    }
  }
  return ranges;
};

export const mergeRanges = (ranges: Range[]): Range[] => {
  let mergedRanges = sortRanges(ranges);
  while (true) {
    const oldLength = mergedRanges.length;
    mergedRanges = mergePass(mergedRanges);
    if (oldLength === mergedRanges.length) {
      break;
    }
  }
  return mergedRanges;
};
