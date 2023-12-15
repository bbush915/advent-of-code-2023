import fs from "fs";

import { search } from "../../utils/graph";

function parseInput() {
  const map = fs
    .readFileSync("src/day.10.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  let start = "";

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "S") {
        start = toKey(i, j);
      }
    }
  }

  return {
    map,
    start,
  };
}

export function part1() {
  const { map, start } = parseInput();

  const { distanceLookup } = search((key) => getNeighbors(map, key), start);

  return Math.max(...distanceLookup.values());
}

export function part2() {
  const { map, start } = parseInput();

  // NOTE - Depth-first search to get the pipe tiles.

  const pipe = [];
  const pipeLookup = new Set<string>();

  const keys = [start];

  while (keys.length > 0) {
    const key = keys.shift()!;

    if (pipeLookup.has(key)) {
      continue;
    } else {
      pipe.push(key);
      pipeLookup.add(key);

      keys.unshift(...getNeighbors(map, key));
    }
  }

  // NOTE - Calculate connected components to reduce the required
  // amount of winding number calculations.

  const connectedComponents: Set<string>[] = [];

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (pipeLookup.has(toKey(i, j))) {
        continue;
      }

      let found = false;

      for (const connectedComponent of connectedComponents) {
        if (connectedComponent.has(toKey(i, j))) {
          found = true;
          break;
        }
      }

      if (!found) {
        const connectedComponent = new Set<string>();

        const keys = [toKey(i, j)];

        while (keys.length > 0) {
          const key = keys.shift()!;

          if (connectedComponent.has(key)) {
            continue;
          } else {
            connectedComponent.add(key);

            const [m, n] = fromKey(key);

            const neighbors = [
              [m - 1, n],
              [m, n - 1],
              [m, n + 1],
              [m + 1, n],
            ]
              .filter(
                ([m, n]) =>
                  m >= 0 &&
                  m < map.length &&
                  n >= 0 &&
                  n < map[m].length &&
                  !pipeLookup.has(toKey(m, n))
              )
              .map(([m, n]) => toKey(m, n));

            keys.unshift(...neighbors);
          }
        }

        connectedComponents.push(connectedComponent);
      }
    }
  }

  // NOTE - Calculate the winding number for a representative of each
  // connected component. If the winding number is non-zero, then it is
  // enclosed by the pipe.

  let count = 0;

  for (const connectedComponent of connectedComponents) {
    const key = connectedComponent.values().next().value;

    const windingNumber = pipe
      .map((tile) => getQuadrant(fromKey(tile), fromKey(key)))
      .filter((x) => x !== null)
      .reduce(
        ({ accumulator, windingNumber }, currentValue, n, quadrants) => {
          const nextValue =
            quadrants[(n + quadrants.length - 1) % quadrants.length]!;

          // NOTE - Positive winding.

          if (currentValue === (nextValue + 1) % 4) {
            accumulator++;

            if (accumulator === 4) {
              accumulator = 0;
              windingNumber++;
            }
          }

          // NOTE - Negative winding.

          if (currentValue === (nextValue + 3) % 4) {
            accumulator--;

            if (accumulator === -4) {
              accumulator = 0;
              windingNumber--;
            }
          }

          return {
            accumulator,
            windingNumber,
          };
        },
        {
          accumulator: 0,
          windingNumber: 0,
        }
      ).windingNumber;

    if (windingNumber !== 0) {
      count += connectedComponent.size;
    }
  }

  return count;
}

function toKey(i: number, j: number) {
  return `${i}|${j}`;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}

function getNeighbors(map: string[][], key: string) {
  const [i, j] = fromKey(key);

  const neighbors: string[] = [];

  // NOTE - Top

  if (
    i > 0 &&
    ["|", "7", "F"].includes(map[i - 1][j]) &&
    ["S", "|", "L", "J"].includes(map[i][j])
  ) {
    neighbors.push(toKey(i - 1, j));
  }

  // NOTE - Bottom

  if (
    i < map.length - 1 &&
    ["|", "L", "J"].includes(map[i + 1][j]) &&
    ["S", "|", "7", "F"].includes(map[i][j])
  ) {
    neighbors.push(toKey(i + 1, j));
  }

  // NOTE - Left

  if (
    j > 0 &&
    ["-", "L", "F"].includes(map[i][j - 1]) &&
    ["S", "-", "J", "7"].includes(map[i][j])
  ) {
    neighbors.push(toKey(i, j - 1));
  }

  // NOTE - Right

  if (
    j < map[i].length - 1 &&
    ["-", "J", "7"].includes(map[i][j + 1]) &&
    ["S", "-", "L", "F"].includes(map[i][j])
  ) {
    neighbors.push(toKey(i, j + 1));
  }

  return neighbors;
}

function getQuadrant(tile: number[], relativeTo: number[]) {
  const x = tile[0] - relativeTo[0];
  const y = tile[1] - relativeTo[1];

  if (x < 0 && y < 0) {
    return 0;
  } else if (x < 0 && y > 0) {
    return 1;
  } else if (x > 0 && y > 0) {
    return 2;
  } else if (x > 0 && y < 0) {
    return 3;
  }

  return null;
}
