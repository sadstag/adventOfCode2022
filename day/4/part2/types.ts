export type Input = Pair[];
export type Output = number;

export type Pair = [Assignment, Assignment];

export type Assignment = {
  from: number;
  to: number;
};

export function isOverlap(a1: Assignment, a2: Assignment): boolean {
  if (a1.from > a2.from) {
    return isOverlap(a2, a1);
  }
  if (a1.from === a2.from) return true;
  if (a2.from <= a1.to) return true;
  return false;
}
