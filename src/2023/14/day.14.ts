import fs from "fs";

function parseInput() {
  return fs
    .readFileSync("src/day.14.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

export function part1() {
  const platform = parseInput();

  tiltNorth(platform);

  return calculateTotalLoad(platform);
}

export function part2() {
  const platform = parseInput();

  const history = new Map<string, number>();

  let base = 0;
  let period = 0;

  for (let cycle = 0; cycle < 1_000_000_000; cycle++) {
    tiltNorth(platform);
    tiltWest(platform);
    tiltSouth(platform);
    tiltEast(platform);

    const key = `$${platform.map((x) => x.join("")).join("|")}`;

    if (history.has(key)) {
      base = history.get(key)!;
      period = cycle - base;
      break;
    } else {
      history.set(key, cycle);
    }
  }

  const key = [...history.keys()][base + ((1_000_000_000 - base) % period) - 1];

  return calculateTotalLoad(key.split("|").map((x) => x.split("")));
}

function calculateTotalLoad(platform: string[][]) {
  let totalLoad = 0;

  for (let i = 0; i < platform.length; i++) {
    for (let j = 0; j < platform[i].length; j++) {
      if (platform[i][j] === "O") {
        totalLoad += platform.length - i;
      }
    }
  }

  return totalLoad;
}

function tiltNorth(platform: string[][]) {
  for (let i = 0; i < platform.length; i++) {
    for (let j = 0; j < platform[i].length; j++) {
      if (platform[i][j] === "O") {
        let k = 1;

        while (i - k >= 0 && platform[i - k][j] === ".") {
          platform[i - (k - 1)][j] = ".";
          k++;
        }

        platform[i - (k - 1)][j] = "O";
      }
    }
  }
}

function tiltSouth(platform: string[][]) {
  for (let i = platform.length - 1; i >= 0; i--) {
    for (let j = 0; j < platform[i].length; j++) {
      if (platform[i][j] === "O") {
        let k = 1;

        while (i + k <= platform.length - 1 && platform[i + k][j] === ".") {
          platform[i + (k - 1)][j] = ".";
          k++;
        }

        platform[i + (k - 1)][j] = "O";
      }
    }
  }
}

function tiltEast(platform: string[][]) {
  for (let i = 0; i < platform.length; i++) {
    for (let j = platform[i].length - 1; j >= 0; j--) {
      if (platform[i][j] === "O") {
        let k = 1;

        while (j + k < platform[i].length && platform[i][j + k] === ".") {
          platform[i][j + (k - 1)] = ".";
          k++;
        }

        platform[i][j + (k - 1)] = "O";
      }
    }
  }
}

function tiltWest(platform: string[][]) {
  for (let i = 0; i < platform.length; i++) {
    for (let j = 0; j < platform[i].length; j++) {
      if (platform[i][j] === "O") {
        let k = 1;

        while (j - k >= 0 && platform[i][j - k] === ".") {
          platform[i][j - (k - 1)] = ".";
          k++;
        }

        platform[i][j - (k - 1)] = "O";
      }
    }
  }
}
