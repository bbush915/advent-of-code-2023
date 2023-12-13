import fs from "fs";

import "./utils/array";
import { clone } from "./utils/common";

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

  return (
    conditionRecords
      //.slice(21, 22)
      .map(({ spring, groups }, n) => {
        // const comp = getArrangementCountBFS(
        //   spring,
        //   groups,
        //   simplify(spring, groups)
        // );

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
      .sum()
  );
}

function simplify(spring: string[], groups: number[]) {
  const placements = new Array<Array<number>>();
  const knownPlacements = new Array(groups.length).fill(false);

  for (let i = 0; i < groups.length; i++) {
    placements.push([]);

    for (let j = 0; j < spring.length; j++) {
      placements[i].push(j);
    }
  }

  let iteration = 0;

  do {
    simplifyHelper(spring, groups, placements, iteration);

    for (let n = 0; n < groups.length; n++) {
      if (!knownPlacements[n] && placements[n].length === 1) {
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

        knownPlacements[n] = true;
      }
    }
  } while (iteration++ < 100);

  return placements;
}

function simplifyHelper(
  spring: string[],
  groups: number[],
  placements: number[][],
  iteration: number
) {
  for (let n = 0; n < groups.length; n++) {
    // NOTE - Known placement.
    if (placements[n].length === 1) {
      continue;
    }

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

      if (iteration > 0) {
        // NOTE - Can't place a piece after a known placement of a later group.

        for (let j = n + 1; j < groups.length; j++) {
          if (
            placements[j].length === 1 &&
            index + groups[n] >= placements[j][0]
          ) {
            continue placementLoop;
          }
        }

        // NOTE - Must not prevent the next groups from being placed.

        let threshold = index + groups[n];

        for (let m = n + 1; m < groups.length; m++) {
          if (placements[m].filter((x) => x > threshold).length === 0) {
            continue placementLoop;
          }

          threshold = placements[m].filter((x) => x > threshold)[0];
        }

        // NOTE - Can't have damaged pieces between groups.

        if (
          n > 0 &&
          spring
            .slice(
              placements[n - 1][placements[n - 1].length - 1] + groups[n - 1],
              index
            )
            .includes("#")
        ) {
          continue;
        }

        if (
          n < groups.length - 1 &&
          spring.slice(index + groups[n], placements[n + 1][0]).includes("#")
        ) {
          continue;
        }
      }

      validPlacements.push(index);
    }

    placements[n] = validPlacements;
  }
}

function getArrangementCountDFS(
  spring: string[],
  groups: number[],
  placements: number[][],
  groupIndex: number,
  springIndex: number,
  mapping: number[]
) {
  if (groupIndex === groups.length) {
    return 1;
  }

  let arrangementCount = 0;

  for (let i = springIndex; i < spring.length; i++) {
    if (spring[i] === ".") {
      continue;
    } else {
      let canPlace = true;

      for (let j = 0; j < groups[groupIndex]; j++) {
        if (spring[i + j] === ".") {
          canPlace = false;
          break;
        }
      }

      if (!canPlace) {
        continue;
      }
    }

    const submapping = clone(mapping);
    submapping[groupIndex] = i;

    if (isPossibleMapping(spring, groups, submapping)) {
      arrangementCount += getArrangementCountDFS(
        spring,
        groups,
        placements,
        groupIndex + 1,
        i + groups[groupIndex] + 1,
        submapping
      );
    }
  }

  return arrangementCount;
}

function getArrangementCountBFS(
  spring: string[],
  groups: number[],
  placements: number[][]
) {
  let mappings = getPossibleMappings(spring, groups, placements, 0, 0, []);

  for (let n = 1; n < groups.length; n++) {
    // console.log("Group: ", n, mappings.length);

    const workingMappings: number[][] = [];

    while (mappings.length > 0) {
      const mapping = mappings.shift()!;

      workingMappings.push(
        ...getPossibleMappings(
          spring,
          groups,
          placements,
          n,
          mapping[mapping.length - 1] + groups[mapping.length - 1] + 1,
          mapping
        )
      );
    }

    mappings = workingMappings;
  }

  return mappings;
}

function getPossibleMappings(
  spring: string[],
  groups: number[],
  placements: number[][],
  groupIndex: number,
  springIndex: number,
  mapping: number[]
) {
  return placements[groupIndex]
    .filter((x) => x >= springIndex)
    .map((placement) => {
      const submapping = clone(mapping);

      submapping[groupIndex] = placement;

      return submapping;
    })
    .filter((submapping) => isPossibleMapping(spring, groups, submapping));
}

function isPossibleMapping(
  spring: string[],
  groups: number[],
  mapping: number[]
) {
  // NOTE - Populate proposed spring from mapping.

  const proposedSpring = clone(spring);

  let maxIndex = 0;
  let partialPlacements = false;

  for (let i = 0; i < groups.length; i++) {
    const startIndex = mapping[i];

    if (startIndex === undefined) {
      partialPlacements = true;
      break;
    }

    for (let j = 0; j < groups[i]; j++) {
      const index = startIndex + j;

      proposedSpring[index] = "#";
      maxIndex = index + 1;
    }
  }

  if (partialPlacements) {
    while (
      maxIndex < proposedSpring.length &&
      proposedSpring[maxIndex] !== "?"
    ) {
      maxIndex++;
    }
  } else {
    maxIndex = proposedSpring.length;
  }

  // NOTE - Validate proposed groups.

  const proposedGroups = proposedSpring
    .slice(0, maxIndex)
    .join("")
    .replace(/\?/g, ".")
    .split(/\.+/)
    .filter((x) => x)
    .map((x) => x.length);

  for (let i = 0; i < proposedGroups.length; i++) {
    if (partialPlacements && i === proposedGroups.length - 1) {
      if (proposedGroups[i] > groups[i]) {
        return false;
      } else {
        continue;
      }
    }

    if (proposedGroups[i] !== groups[i]) {
      return false;
    }
  }

  return true;
}

function isValidMapping(spring: string[], groups: number[], mapping: number[]) {
  // NOTE - Populate proposed spring from mapping.

  const proposedSpring = clone(spring);

  let maxIndex = 0;
  let partialPlacements = false;

  for (let i = 0; i < groups.length; i++) {
    const startIndex = mapping[i];

    if (startIndex === undefined) {
      partialPlacements = true;
      break;
    }

    for (let j = 0; j < groups[i]; j++) {
      const index = startIndex + j;

      proposedSpring[index] = "#";
      maxIndex = index + 1;
    }
  }

  if (partialPlacements) {
    while (
      maxIndex < proposedSpring.length &&
      proposedSpring[maxIndex] !== "?"
    ) {
      maxIndex++;
    }
  } else {
    maxIndex = proposedSpring.length;
  }

  // NOTE - Validate proposed groups.

  const proposedGroups = proposedSpring
    .slice(0, maxIndex)
    .join("")
    .replace(/\?/g, ".")
    .split(/\.+/)
    .filter((x) => x)
    .map((x) => x.length);

  if (proposedGroups.length !== mapping.filter((x) => x !== null).length) {
    return false;
  }

  for (let i = 0; i < proposedGroups.length; i++) {
    if (proposedGroups[i] !== groups[i]) {
      return false;
    }
  }

  return true;
}
