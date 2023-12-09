import fs from "fs";

import "./utils/array";

function parseInput() {
  return fs
    .readFileSync("src/day.9.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(" ").map(Number));
}

export function part1() {
  const report = parseInput();

  return report
    .map((history) => {
      const subhistories = [history];

      let depth = 0;

      while (subhistories[depth].some((x) => x)) {
        subhistories.push(
          subhistories[depth].slice(1).map((x, i) => x - subhistories[depth][i])
        );

        depth++;
      }

      subhistories[depth].push(0);

      for (let i = subhistories.length - 2; i >= 0; i--) {
        subhistories[i].push(
          subhistories[i][subhistories[i].length - 1] +
            subhistories[i + 1][subhistories[i + 1].length - 1]
        );
      }

      return subhistories[0][subhistories[0].length - 1];
    })
    .sum();
}

export function part2() {
  const report = parseInput();

  return report
    .map((history) => {
      const subhistories = [history];

      let depth = 0;

      while (subhistories[depth].some((x) => x)) {
        subhistories.push(
          subhistories[depth].slice(1).map((x, i) => x - subhistories[depth][i])
        );

        depth++;
      }

      subhistories[depth].unshift(0);

      for (let i = subhistories.length - 2; i >= 0; i--) {
        subhistories[i].unshift(subhistories[i][0] - subhistories[i + 1][0]);
      }

      return subhistories[0][0];
    })
    .sum();
}
