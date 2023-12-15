import fs from "fs";

function parseInput() {
  const image = fs
    .readFileSync("src/day.11.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  const galaxyLookup = new Set<string>();

  const expansionRows: number[] = [];
  const expansionCols: number[] = [];

  const isColGalaxy = new Array(image[0].length).fill(false);

  for (let i = 0; i < image.length; i++) {
    let isRowGalaxy = false;

    for (let j = 0; j < image[i].length; j++) {
      if (image[i][j] == "#") {
        galaxyLookup.add(toKey(i, j));

        isRowGalaxy = true;
        isColGalaxy[j] = true;
      }
    }

    if (!isRowGalaxy) {
      expansionRows.push(i);
    }
  }

  for (let j = 0; j < image[0].length; j++) {
    if (!isColGalaxy[j]) {
      expansionCols.push(j);
    }
  }

  return {
    image,
    galaxyLookup,
    expansionRows,
    expansionCols,
  };
}

export function part1() {
  return getPairwiseDistanceSum(1);
}

export function part2() {
  return getPairwiseDistanceSum(999_999);
}

function toKey(i: number, j: number) {
  return `${i}|${j}`;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}

function getPairwiseDistanceSum(expansionFactor: number) {
  const { galaxyLookup, expansionRows, expansionCols } = parseInput();

  const entries = [...galaxyLookup.values()];

  let sum = 0;

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const [x0, y0] = fromKey(entries[i]);
      const [x1, y1] = fromKey(entries[j]);

      const numRows = expansionRows.filter(
        (x) => x > Math.min(x0, x1) && x < Math.max(x0, x1)
      ).length;
      const numCols = expansionCols.filter(
        (y) => y > Math.min(y0, y1) && y < Math.max(y0, y1)
      ).length;

      sum +=
        Math.abs(x0 - x1) +
        numRows * expansionFactor +
        Math.abs(y0 - y1) +
        numCols * expansionFactor;
    }
  }

  return sum;
}
