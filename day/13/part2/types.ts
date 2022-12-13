export type Elem = number | Elem[];

export type Packet = Elem[];

export type Input = Packet[];
export type Output = number;

// p1 < p2 => -1
// p1 = p2 => 0
// p1 > p2 => 1
type ComparisonResult = -1 | 0 | 1;
export const compareElements = (p1: Elem, p2: Elem): ComparisonResult => {
  //console.log("cmpElments", { p1, p2 });

  if (typeof p1 === "number") {
    if (typeof p2 === "number") {
      return Math.sign(p1 - p2) as ComparisonResult;
    } else {
      return compareElements([p1], p2);
    }
  }
  if (typeof p2 === "number") {
    return compareElements(p1, [p2]);
  }
  // two lists
  return compareLists(p1, p2);
};

export const compareLists = (p1: Packet, p2: Packet): ComparisonResult => {
  //console.log("cmpList", { p1, p2 });
  const [h1, ...rest1] = p1;
  const [h2, ...rest2] = p2;
  if (typeof h1 === "undefined") {
    if (typeof h2 === "undefined") {
      return 0; // two empty lists
    }
    return -1; // p1 is empty, p2 is not
  }
  if (typeof h2 === "undefined") {
    return 1; // p2 is empty, p1 is not
  }
  const cmp = compareElements(h1, h2);
  if (cmp !== 0) {
    // heads give resolution
    return cmp;
  }
  return compareLists(rest1, rest2);
};
