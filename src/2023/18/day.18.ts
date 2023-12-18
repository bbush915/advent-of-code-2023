import fs from "fs";

type Instruction = {
  direction: Directions;
  length: number;
};

enum Directions {
  R,
  D,
  L,
  U,
}

function parseInput() {
  return fs
    .readFileSync("src/day.18.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => {
      const [direction, count, hexCode] = x.split(" ");

      return {
        direction: Directions[direction as keyof typeof Directions],
        length: Number(count),
        hexCode,
      };
    });
}

export function part1() {
  const plan = parseInput();

  return getTotalArea(plan);
}

export function part2() {
  const plan = parseInput();
  const instructions = plan.map(({ hexCode }) => parseHexCode(hexCode));

  return getTotalArea(instructions);
}

function getTotalArea(instructions: Instruction[]) {
  let i = 0;
  let j = 0;

  const points = [[i, j]];

  let boundary = 0;

  for (const { direction, length } of instructions) {
    const dx =
      direction === Directions.U ? -1 : direction === Directions.D ? 1 : 0;
    const dy =
      direction === Directions.L ? -1 : direction === Directions.R ? 1 : 0;

    i += length * dx;
    j += length * dy;

    points.push([i, j]);

    boundary += Math.abs(length * dx + length * dy);
  }

  let area = 0;

  for (let n = 0; n < points.length - 1; n++) {
    area +=
      0.5 * (points[n][1] * points[n + 1][0] - points[n + 1][1] * points[n][0]);
  }

  return 1 + 0.5 * boundary + area;
}

function parseHexCode(hexCode: string) {
  const direction = Number(hexCode.at(-2)) as Directions;
  const length = parseInt(hexCode.slice(2, 7), 16);

  return { direction, length };
}
