import fs from "fs";

import "./utils/array";

type Reflection = {
  type: "row" | "col";
  index: number;
};

function parseInput() {
  return fs
    .readFileSync("src/day.13.input.txt")
    .toString()
    .split("\n\n")
    .map((x) =>
      x
        .split("\n")
        .filter((x) => x)
        .map((x) => x.split(""))
    );
}

export function part1() {
  const patterns = parseInput();

  return patterns
    .map((pattern) => {
      const reflection = getReflection(pattern, null)!;

      return reflection.type === "row"
        ? 100 * (reflection.index + 1)
        : reflection.index + 1;
    })
    .sum();
}

export function part2() {
  const patterns = parseInput();

  return patterns
    .map((pattern) => {
      const originalReflection = getReflection(pattern, null)!;

      for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
          pattern[i][j] = pattern[i][j] === "." ? "#" : ".";

          const reflection = getReflection(pattern, originalReflection);

          if (
            reflection &&
            (reflection.type != originalReflection.type ||
              reflection.index !== originalReflection.index)
          ) {
            return reflection.type === "row"
              ? 100 * (reflection.index + 1)
              : reflection.index + 1;
          }

          pattern[i][j] = pattern[i][j] === "." ? "#" : ".";
        }
      }

      return 0;
    })
    .sum();
}

function getReflection(
  pattern: string[][],
  originalReflection: Reflection | null
): Reflection | null {
  const rows = pattern.map((x) => x.join(""));

  rowLoop: for (let i = 0; i < rows.length; i++) {
    if (rows[i] === rows[i + 1]) {
      if (
        originalReflection &&
        originalReflection.type == "row" &&
        originalReflection.index === i
      ) {
        continue;
      }

      for (let j = 1; j <= Math.min(i, rows.length - 1 - (i + 1)); j++) {
        if (rows[i - j] !== rows[i + 1 + j]) {
          continue rowLoop;
        }
      }

      return {
        type: "row",
        index: i,
      };
    }
  }

  const cols: string[] = [];

  for (let j = 0; j < pattern[0].length; j++) {
    const col: string[] = [];

    for (let i = 0; i < pattern.length; i++) {
      col.push(pattern[i][j]);
    }

    cols.push(col.join(""));
  }

  colLoop: for (let j = 0; j < cols.length; j++) {
    if (cols[j] === cols[j + 1]) {
      if (
        originalReflection &&
        originalReflection.type == "col" &&
        originalReflection.index === j
      ) {
        continue;
      }

      for (let i = 1; i <= Math.min(j, cols.length - 1 - (j + 1)); i++) {
        if (cols[j - i] !== cols[j + 1 + i]) {
          continue colLoop;
        }
      }

      return {
        type: "col",
        index: j,
      };
    }
  }

  return null;
}
