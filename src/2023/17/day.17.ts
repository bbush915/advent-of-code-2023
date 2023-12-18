import fs from "fs";

import { search } from "../../utils/graph";

enum Directions {
  LEFT,
  UP,
  RIGHT,
  DOWN,
}

function parseInput() {
  return fs
    .readFileSync("src/day.17.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("").map(Number));
}

export function part1() {
  return getMinimumPossibleHeatLoss(getNeighbors1);
}

export function part2() {
  return getMinimumPossibleHeatLoss(getNeighbors2);
}

function getMinimumPossibleHeatLoss(
  getNeighbors: (map: number[][], key: string) => string[]
) {
  const map = parseInput();

  const { distanceLookup } = search(
    (key) => getNeighbors(map, key),
    toKey(0, 0, null, 0),
    undefined,
    (x, y) => getDistance(map, x, y)
  );

  return Math.min(
    ...[...distanceLookup.entries()]
      .filter(([key, _value]) =>
        key.startsWith(`${map.length - 1}|${map[map.length - 1].length - 1}`)
      )
      .map(([_key, value]) => value)
  );
}

function getNeighbors1(map: number[][], key: string): string[] {
  const [i, j, keyDirection, count] = fromKey(key);

  const neighbors = [
    [i, j - 1, Directions.LEFT],
    [i - 1, j, Directions.UP],
    [i, j + 1, Directions.RIGHT],
    [i + 1, j, Directions.DOWN],
  ]
    .filter(([i, j, neighborDirection]) => {
      // NOTE - Check against map bounds.
      if (i < 0 || i >= map.length || j < 0 || j >= map[i].length) {
        return false;
      }

      // NOTE - Prevent reverse.
      if (
        keyDirection != null &&
        neighborDirection === (keyDirection + 2) % 4
      ) {
        return false;
      }

      // NOTE - Prevent four consecutive moves.
      if (neighborDirection === keyDirection && count === 3) {
        return false;
      }

      return true;
    })
    .map(([i, j, neighborDirection]) =>
      toKey(
        i,
        j,
        neighborDirection,
        neighborDirection === keyDirection ? count + 1 : 1
      )
    );

  return neighbors;
}

function getNeighbors2(map: number[][], key: string): string[] {
  const [i, j, keyDirection, count] = fromKey(key);

  const neighbors = [
    [i, j - 1, Directions.LEFT],
    [i - 1, j, Directions.UP],
    [i, j + 1, Directions.RIGHT],
    [i + 1, j, Directions.DOWN],
  ]
    .filter(([i, j, neighborDirection]) => {
      // NOTE - Check against map bounds.
      if (i < 0 || i >= map.length || j < 0 || j >= map[i].length) {
        return false;
      }

      // NOTE - Prevent reverse.
      if (
        keyDirection != null &&
        neighborDirection === (keyDirection + 2) % 4
      ) {
        return false;
      }

      // NOTE - Prevent eleven consecutive moves.
      if (neighborDirection === keyDirection && count === 10) {
        return false;
      }

      if (count > 0 && neighborDirection !== keyDirection) {
        if (count < 4) {
          // NOTE - Ensure we go at least four moves in the same direction.
          return false;
        } else {
          // NOTE - Ensure we have room to go at least four moves in the neighbor's direction.
          switch (neighborDirection) {
            case Directions.LEFT: {
              if (j < 3) {
                return false;
              }

              break;
            }

            case Directions.RIGHT: {
              if (j >= map[i].length - 3) {
                return false;
              }

              break;
            }

            case Directions.UP: {
              if (i < 3) {
                return false;
              }

              break;
            }

            case Directions.DOWN: {
              if (i >= map.length - 3) {
                return false;
              }

              break;
            }
          }
        }
      }

      return true;
    })
    .map(([i, j, neighborDirection]) =>
      toKey(
        i,
        j,
        neighborDirection,
        neighborDirection === keyDirection ? count + 1 : 1
      )
    );

  return neighbors;
}

function getDistance(map: number[][], _x: string, y: string) {
  const [i, j] = fromKey(y);
  return map[i][j];
}

function toKey(
  i: number,
  j: number,
  direction: Directions | null,
  count: number
) {
  return `${i}|${j}|${direction === null ? "-" : direction}|${count}`;
}

function fromKey(key: string): [number, number, Directions | null, number] {
  const [i, j, direction, count] = key.split("|");
  return [
    Number(i),
    Number(j),
    direction === "-" ? null : Number(direction),
    Number(count),
  ];
}
