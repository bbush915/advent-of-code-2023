import fs from "fs";

import "./utils/array";

function parseInput(unfoldingFactor: number) {
  return fs
    .readFileSync("src/day.12.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const parts = x.split(" ");

      return {
        spring: new Array(unfoldingFactor).fill(parts[0]).join("?").split(""),
        groups: new Array(unfoldingFactor)
          .fill(parts[1])
          .join(",")
          .split(",")
          .map(Number),
      };
    });
}

export function part1() {
  return getTotalArrangementCount(1);
}

export function part2() {
  return getTotalArrangementCount(5);
}

function getTotalArrangementCount(unfoldingFactor: number) {
  const conditionRecords = parseInput(unfoldingFactor);

  return conditionRecords
    .map(({ spring, groups }) => {
      const placements = simplify(spring, groups);

      const arrangementCounts = [new Array(placements[0].length).fill(1)];

      for (let i = 1; i < placements.length; i++) {
        arrangementCounts.push(new Array(placements[i].length).fill(0));

        for (let j = 0; j < placements[i].length; j++) {
          for (let k = 0; k < placements[i - 1].length; k++) {
            if (
              placements[i][j] > placements[i - 1][k] + groups[i - 1] &&
              !spring
                .slice(placements[i - 1][k] + groups[i - 1], placements[i][j])
                .includes("#")
            ) {
              arrangementCounts[i][j] += arrangementCounts[i - 1][k];
            }
          }
        }
      }

      return arrangementCounts[arrangementCounts.length - 1].sum();
    })
    .sum();
}

function simplify(spring: string[], groups: number[]) {
  const placements = new Array<Array<number>>();

  for (let i = 0; i < groups.length; i++) {
    placements.push([]);

    for (let j = 0; j < spring.length; j++) {
      placements[i].push(j);
    }
  }

  simplifyHelper(spring, groups, placements);

  for (let n = 0; n < groups.length; n++) {
    if (placements[n].length === 1) {
      const index = placements[n][0];

      if (index > 0) {
        spring[index - 1] = ".";
      }

      for (let i = 0; i < groups[n]; i++) {
        spring[index + i] = "#";
      }

      if (index + groups[n] < spring.length - 1) {
        spring[index + groups[n]] = ".";
      }
    }
  }

  return placements;
}

function simplifyHelper(
  spring: string[],
  groups: number[],
  placements: number[][]
) {
  for (let n = 0; n < groups.length; n++) {
    const validPlacements: number[] = [];

    placementLoop: for (let i = 0; i < placements[n].length; i++) {
      const index = placements[n][i];

      // NOTE - Ensure separation between groups.

      if (index < (n === 0 ? 0 : placements[n - 1][0] + groups[n - 1] + 1)) {
        continue;
      }

      // NOTE - Can't create extra group at start of the spring.

      if (
        n === 0 &&
        spring
          .slice(0, index)
          .join("")
          .replace(/\?/g, ".")
          .split("")
          .filter((x) => x === "#").length > 0
      ) {
        continue;
      }

      // NOTE - Can't create extra group at end of the spring.

      if (
        n === groups.length - 1 &&
        spring.slice(index + groups[n]).includes("#")
      ) {
        continue;
      }

      // NOTE - Can't place a piece off the edge of the spring.

      if (index + groups[n] > spring.length) {
        continue;
      }

      // NOTE - Must be able to place entire group.

      for (let j = 0; j < groups[n]; j++) {
        if (spring[index + j] === ".") {
          continue placementLoop;
        }
      }

      // NOTE - Must not have a leading damaged piece.

      if (index > 0 && spring[index - 1] === "#") {
        continue;
      }

      // NOTE - Must not have a trailing damaged piece.

      if (
        index + groups[n] < spring.length &&
        spring[index + groups[n]] === "#"
      ) {
        continue;
      }

      validPlacements.push(index);
    }

    placements[n] = validPlacements;
  }
}
