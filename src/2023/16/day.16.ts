import fs from "fs";

import { cartesian, range } from "../../utils/array";

type Beam = {
  i: number;
  j: number;
  direction: Directions;
};

enum Directions {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const INTERACTION_MAP = {
  ".": {
    [Directions.LEFT]: [{ direction: Directions.LEFT, di: 0, dj: -1 }],
    [Directions.UP]: [{ direction: Directions.UP, di: -1, dj: 0 }],
    [Directions.RIGHT]: [{ direction: Directions.RIGHT, di: 0, dj: 1 }],
    [Directions.DOWN]: [{ direction: Directions.DOWN, di: 1, dj: 0 }],
  },
  "/": {
    [Directions.LEFT]: [{ direction: Directions.DOWN, di: 1, dj: 0 }],
    [Directions.UP]: [{ direction: Directions.RIGHT, di: 0, dj: 1 }],
    [Directions.RIGHT]: [{ direction: Directions.UP, di: -1, dj: 0 }],
    [Directions.DOWN]: [{ direction: Directions.LEFT, di: 0, dj: -1 }],
  },
  "\\": {
    [Directions.LEFT]: [{ direction: Directions.UP, di: -1, dj: 0 }],
    [Directions.UP]: [{ direction: Directions.LEFT, di: 0, dj: -1 }],
    [Directions.RIGHT]: [{ direction: Directions.DOWN, di: 1, dj: 0 }],
    [Directions.DOWN]: [{ direction: Directions.RIGHT, di: 0, dj: 1 }],
  },
  "|": {
    [Directions.LEFT]: [
      { direction: Directions.UP, di: -1, dj: 0 },
      { direction: Directions.DOWN, di: 1, dj: 0 },
    ],
    [Directions.UP]: [{ direction: Directions.UP, di: -1, dj: 0 }],
    [Directions.RIGHT]: [
      { direction: Directions.UP, di: -1, dj: 0 },
      { direction: Directions.DOWN, di: 1, dj: 0 },
    ],
    [Directions.DOWN]: [{ direction: Directions.DOWN, di: 1, dj: 0 }],
  },
  "-": {
    [Directions.LEFT]: [{ direction: Directions.LEFT, di: 0, dj: -1 }],
    [Directions.UP]: [
      { direction: Directions.LEFT, di: 0, dj: -1 },
      { direction: Directions.RIGHT, di: 0, dj: 1 },
    ],
    [Directions.RIGHT]: [{ direction: Directions.RIGHT, di: 0, dj: 1 }],
    [Directions.DOWN]: [
      { direction: Directions.LEFT, di: 0, dj: -1 },
      { direction: Directions.RIGHT, di: 0, dj: 1 },
    ],
  },
};

function parseInput() {
  return fs
    .readFileSync("src/day.16.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

export function part1() {
  const grid = parseInput();

  const initialBeam: Beam = { i: 0, j: 0, direction: Directions.RIGHT };

  return getEnergizedTileCount(grid, initialBeam);
}

export function part2() {
  const grid = parseInput();

  const initialBeams = ([] as Beam[])
    .concat(
      cartesian(range(0, grid[0].length), [Directions.UP, Directions.DOWN]).map(
        ([j, direction]) => ({
          i: direction === Directions.UP ? grid.length - 1 : 0,
          j,
          direction,
        })
      )
    )
    .concat(
      cartesian(range(0, grid.length), [Directions.LEFT, Directions.RIGHT]).map(
        ([i, direction]) => ({
          i,
          j: direction === Directions.LEFT ? grid[0].length - 1 : 0,
          direction,
        })
      )
    );

  return Math.max(
    ...initialBeams.map((initialBeam) =>
      getEnergizedTileCount(grid, initialBeam)
    )
  );
}

function getEnergizedTileCount(grid: string[][], initialBeam: Beam) {
  const energizedTiles = new Set<string>();

  const beams = [initialBeam];
  const history = new Set<string>();

  while (beams.length > 0) {
    const beam = beams.shift()!;
    const { i, j, direction } = beam;

    const key = toKey(i, j, direction);

    if (
      i < 0 ||
      i >= grid.length ||
      j < 0 ||
      j >= grid[0].length ||
      history.has(key)
    ) {
      continue;
    }

    beams.push(...step(grid, beam));
    history.add(key);

    energizedTiles.add(`${i}|${j}`);
  }

  return energizedTiles.size;
}

function step(grid: string[][], { i, j, direction }: Beam): Beam[] {
  return INTERACTION_MAP[grid[i][j] as keyof typeof INTERACTION_MAP][
    direction
  ].map(({ direction, di, dj }) => ({
    direction,
    i: i + di,
    j: j + dj,
  }));
}

function toKey(i: number, j: number, direction: Directions) {
  return `${i}|${j}|${direction}`;
}
