import fs from "fs";

import "../../utils/array";

function parseInput() {
  return fs
    .readFileSync("src/day.4.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) =>
      x
        .split(":")[1]
        .split("|")
        .map((x) => x.trim().split(/\s+/g).map(Number))
    );
}

export function part1() {
  const scratchcards = parseInput();

  return scratchcards
    .map((x) => {
      const matchCount = x[1].filter((y) => x[0].includes(y)).length;
      return matchCount ? Math.pow(2, matchCount - 1) : 0;
    })
    .sum();
}

export function part2() {
  const scratchcards = parseInput();

  const matchCounts = scratchcards.map(
    (x) => x[1].filter((y) => x[0].includes(y)).length
  );

  const scratchcardCounts = new Array(scratchcards.length).fill(1);

  for (let i = 0; i < scratchcards.length; i++) {
    for (let j = 0; j < matchCounts[i]; j++) {
      scratchcardCounts[i + j + 1] += scratchcardCounts[i];
    }
  }

  return scratchcardCounts.sum();
}
