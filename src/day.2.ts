import fs from "fs";

import "./utils/array";

function parseInput() {
  return fs
    .readFileSync("src/day.2.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(": ");

      const id = Number(parts[0].split(" ")[1]);

      const subsets = parts[1].split("; ").map((y) =>
        y.split(", ").reduce(
          (subset, z) => {
            const [count, color] = z.split(" ");
            subset[color as keyof typeof subset] = Number(count);

            return subset;
          },
          { red: 0, green: 0, blue: 0 }
        )
      );

      return {
        id,
        subsets,
      };
    });
}

export function part1() {
  const games = parseInput();

  return games
    .map(({ id, subsets }) =>
      subsets.some(
        ({ red, green, blue }) => red > 12 || green > 13 || blue > 14
      )
        ? 0
        : id
    )
    .sum();
}

export function part2() {
  const games = parseInput();

  return games
    .map(({ subsets }) => {
      let red = 0;
      let green = 0;
      let blue = 0;

      for (const subset of subsets) {
        if (subset.red > red) {
          red = subset.red;
        }

        if (subset.green > green) {
          green = subset.green;
        }

        if (subset.blue > blue) {
          blue = subset.blue;
        }
      }

      return red * green * blue;
    })
    .sum();
}
