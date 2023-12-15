import fs from "fs";

import "../../utils/array";

function parseInput() {
  const values = fs
    .readFileSync("src/day.6.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(":")[1].trim().split(/\s+/g).map(Number));

  return values[0].map((x, i) => ({ time: x, distance: values[1][i] }));
}

export function part1() {
  const races = parseInput();

  return races
    .map(({ time, distance }) => getPossibilities(time, distance))
    .product();
}

export function part2() {
  const races = parseInput();

  const time = Number(races.map((x) => String(x.time)).join(""));
  const distance = Number(races.map((x) => String(x.distance)).join(""));

  return getPossibilities(time, distance);
}

function getPossibilities(time: number, distance: number) {
  let x0 = (time - Math.sqrt(time * time - 4 * distance)) / 2;

  if (Math.abs(x0 - Math.ceil(x0)) < 1e-5) {
    x0 = Math.ceil(x0) + 1;
  } else {
    x0 = Math.ceil(x0);
  }

  let x1 = (time + Math.sqrt(time * time - 4 * distance)) / 2;

  if (Math.abs(x1 - Math.floor(x1)) < 1e-5) {
    x1 = Math.floor(x1) - 1;
  } else {
    x1 = Math.floor(x1);
  }

  return x1 - x0 + 1;
}
