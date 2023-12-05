import fs from "fs";

function parseInput() {
  const sections = fs
    .readFileSync("src/day.5.input.txt")
    .toString()
    .split("\n\n");

  const seeds = sections[0].split(":")[1].trim().split(" ").map(Number);

  const maps = sections.slice(1).map((x) =>
    x
      .split("\n")
      .slice(1)
      .filter((x) => x)
      .map((x) => {
        const [destination, source, length] = x.split(" ").map(Number);
        return { destination, source, length };
      })
  );

  return {
    seeds,
    maps,
  };
}

export function part1() {
  const { seeds, maps } = parseInput();

  const locations = seeds.map((seed) => {
    let value = seed;

    for (const map of maps) {
      for (const { destination, source, length } of map) {
        if (value >= source && value < source + length) {
          value = destination + (value - source);
          break;
        }
      }
    }

    return value;
  });

  return Math.min(...locations);
}

export function part2() {
  const { seeds, maps } = parseInput();

  const seedIntervals = [];

  for (let i = 0; i < seeds.length; i += 2) {
    seedIntervals.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
  }

  const locationIntervals = seedIntervals.map((seedInterval) => {
    let sourceIntervals: number[][] = [seedInterval];
    let destinationIntervals: number[][] = [];

    for (const map of maps) {
      while (sourceIntervals.length > 0) {
        const interval = sourceIntervals.shift()!;

        let appliedTransform = false;

        for (const { destination, source, length } of map) {
          if (interval[0] >= source && interval[0] < source + length) {
            if (interval[1] >= source + length) {
              sourceIntervals.push([source + length, interval[1]]);
              interval[1] = source + length - 1;
            }

            appliedTransform = true;
          }

          if (interval[1] >= source && interval[1] < source + length) {
            if (interval[0] < source) {
              sourceIntervals.push([interval[0], source - 1]);
              interval[0] = source;
            }

            appliedTransform = true;
          }

          if (interval[0] < source && interval[1] >= source + length) {
            sourceIntervals.push([interval[0], source - 1]);
            interval[0] = source;

            sourceIntervals.push([source + length, interval[1]]);
            interval[1] = source + length - 1;

            appliedTransform = true;
          }

          if (appliedTransform) {
            destinationIntervals.push([
              destination + (interval[0] - source),
              destination + (interval[1] - source),
            ]);

            break;
          }
        }

        if (!appliedTransform) {
          destinationIntervals.push(interval);
        }
      }

      sourceIntervals = destinationIntervals;
      destinationIntervals = [];
    }

    return sourceIntervals;
  });

  return Math.min(...locationIntervals.flat(2));
}
