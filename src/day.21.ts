import fs from "fs";

import { search } from "./utils/graph";
import { lpr } from "./utils/number";

function parseInput() {
  const map = fs
    .readFileSync("src/day.21.example.1.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  return {
    map,
    startPosition: getStartPosition(map),
  };
}

function getStartPosition(map: string[][]) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      if (map[i][j] === "S") {
        return toKey(i, j);
      }
    }
  }

  throw Error("Start position not found!");
}

export function part1(steps = 6) {
  const { map, startPosition } = parseInput();

  const { distanceLookup } = search(
    (key) => getNeighbors(map, key),
    startPosition
  );

  return [...distanceLookup.entries()].filter(
    ([, distance]) => distance <= steps && (steps - distance) % 2 === 0
  ).length;
}

export function part2(steps = 100) {
  const { map, startPosition } = parseInput();

  const expansionFactor = 5;

  const { distanceLookup } = search(
    (key) => getNeighbors(map, key, expansionFactor),
    startPosition
  );
  const dm =
    distanceLookup.get(toKey(expansionFactor * map.length, 0))! -
    distanceLookup.get(toKey((expansionFactor - 1) * map.length, 0))!;

  const dn =
    distanceLookup.get(toKey(0, expansionFactor * map[0].length))! -
    distanceLookup.get(toKey(0, (expansionFactor - 1) * map[0].length))!;

  let count = 0;

  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
      for (let m = -expansionFactor; m <= expansionFactor; m++) {
        for (let n = -expansionFactor; n <= expansionFactor; n++) {
          const distance = distanceLookup.get(
            toKey(i + m * map.length, j + n * map[0].length)
          )!;

          if (distance <= steps && (steps - distance) % 2 === 0) {
            count++;
          }
        }
      }

      const min_m = -Math.ceil(
        (steps -
          distanceLookup.get(toKey(i - expansionFactor * map.length, j))!) /
          dm
      );

      const max_m = Math.ceil(
        (steps -
          distanceLookup.get(toKey(i + expansionFactor * map.length, j))!) /
          dm
      );

      const min_n = -Math.ceil(
        (steps -
          distanceLookup.get(toKey(i, j - expansionFactor * map[0].length))!) /
          dn
      );

      const max_n = Math.ceil(
        (steps -
          distanceLookup.get(toKey(i, j + expansionFactor * map[0].length))!) /
          dn
      );

      let x = 3;

      // for (let m = -50; m <= 50; m++) {
      //   for (let n = -50; n <= 50; n++) {
      //     const distance = getDistance(
      //       map,
      //       distanceLookup,
      //       i,
      //       j,
      //       expansionFactor,
      //       m,
      //       dm,
      //       n,
      //       dn
      //     );
      //     if (distance <= steps && (steps - distance) % 2 === 0) {
      //       count++;
      //     }
      //   }
      // }
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

function getNeighbors(
  map: string[][],
  key: string,
  expansionFactor: number = 0
) {
  const [i, j] = fromKey(key);

  return [
    [i, j - 1],
    [i - 1, j],
    [i, j + 1],
    [i + 1, j],
  ]
    .filter(([i, j]) => {
      if (
        i < -expansionFactor * map.length ||
        i > (expansionFactor + 1) * map.length - 1 ||
        j < -expansionFactor * map[0].length ||
        j > (expansionFactor + 1) * map[0].length - 1
      ) {
        return false;
      }

      const i_ = lpr(i, map.length);
      const j_ = lpr(j, map[0].length);

      return map[i_][j_] !== "#";
    })
    .map(([i, j]) => toKey(i, j));
}

function getDistance(
  map: string[][],
  distanceLookup: Map<string, number>,
  i: number,
  j: number,
  expansionFactor: number,
  m: number,
  dm: number,
  n: number,
  dn: number
) {
  let distance = distanceLookup.get(
    toKey(
      i + Math.sign(m) * Math.min(Math.abs(m), expansionFactor) * map.length,
      j + Math.sign(n) * Math.min(Math.abs(n), expansionFactor) * map[0].length
    )
  )!;

  if (Math.abs(m) > expansionFactor) {
    distance += (Math.abs(m) - expansionFactor) * dm;
  }

  if (Math.abs(n) > expansionFactor) {
    distance += (Math.abs(n) - expansionFactor) * dn;
  }

  return distance;
}
