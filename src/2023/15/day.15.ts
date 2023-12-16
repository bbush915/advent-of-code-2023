import fs from "fs";

import "../../utils/array";

type Lens = {
  label: string;
  focalLength: number;
};

function parseInput() {
  return fs
    .readFileSync("src/day.15.input.txt")
    .toString()
    .replace("\n", "")
    .split(",");
}

export function part1() {
  const steps = parseInput();
  return steps.map(hash).sum();
}

export function part2() {
  const steps = parseInput();

  const boxes = [...new Array(256)].map(() => new Array<Lens>());

  for (const step of steps) {
    if (step.endsWith("-")) {
      const label = step.slice(0, -1);

      const boxIndex = hash(label);
      const lensIndex = boxes[boxIndex].findIndex((x) => x.label === label);

      if (lensIndex >= 0) {
        boxes[boxIndex].splice(lensIndex, 1);
      }
    } else {
      const [label, focalLength] = step.split("=");

      const boxIndex = hash(label);
      const lensIndex = boxes[boxIndex].findIndex((x) => x.label === label);

      const lens = {
        label,
        focalLength: Number(focalLength),
      };

      if (lensIndex >= 0) {
        boxes[boxIndex].splice(lensIndex, 1, lens);
      } else {
        boxes[boxIndex].push(lens);
      }
    }
  }

  return boxes
    .map((box, boxIndex) =>
      box
        .map(
          (lens, slotIndex) =>
            (boxIndex + 1) * (slotIndex + 1) * lens.focalLength
        )
        .sum()
    )
    .sum();
}

function hash(value: string) {
  let result = 0;

  for (const character of value) {
    if (character === "\n") {
      continue;
    }

    result = (17 * (result + character.charCodeAt(0))) % 256;
  }

  return result;
}
