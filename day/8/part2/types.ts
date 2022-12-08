export type TreeHeight = number;

export type Forest = TreeHeight[][];

export type Input = Forest;
export type Output = number;

export function computeTransposed(heights: TreeHeight[][]): TreeHeight[][] {
  const size = heights.length;
  const t: TreeHeight[][] = new Array(size);
  for (let i = 0; i < size; i++) {
    t[i] = new Array(size);
  }
  for (const [i, row] of heights.entries()) {
    for (const [j, height] of row.entries()) {
      t[j][i] = height;
    }
  }
  return t;
}
