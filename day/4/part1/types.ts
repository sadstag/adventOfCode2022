export type Input = Pair[];
export type Output = number;

export type Pair = [Assignment, Assignment];

export type Assignment = {
  from: number;
  to: number;
};

/**
 * return true iff a1 is included in a2
 * @param a1
 * @param a2
 */
export function isIncludedIn(a1: Assignment, a2: Assignment): boolean {
  return a2.from <= a1.from && a2.to >= a1.to;
}
