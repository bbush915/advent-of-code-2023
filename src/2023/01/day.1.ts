import fs from "fs";

import "../../utils/array";
import { isNumeric } from "../../utils/number";

const DIGIT_MAP = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function parseInput() {
  return fs
    .readFileSync("src/day.1.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x);
}

export function part1() {
  const calibrationValues = parseInput();

  return calibrationValues
    .map((calibrationValue) => {
      const digits = calibrationValue
        .split("")
        .filter((x) => isNumeric(x))
        .map(Number);

      return 10 * digits[0] + digits[digits.length - 1];
    })
    .sum();
}

export function part2() {
  const calibrationValues = parseInput();

  return calibrationValues
    .map((calibrationValue) => {
      let firstDigit: number | null = null;

      for (let i = 0; i < calibrationValue.length; i++) {
        if ((firstDigit = tryGetDigit(calibrationValue, i))) {
          break;
        }
      }

      let lastDigit: number | null = null;

      for (let i = calibrationValue.length - 1; i >= 0; i--) {
        if ((lastDigit = tryGetDigit(calibrationValue, i))) {
          break;
        }
      }

      return 10 * firstDigit! + lastDigit!;
    })
    .sum();
}

function tryGetDigit(calibrationValue: string, index: number) {
  if (isNumeric(calibrationValue[index])) {
    return Number(calibrationValue[index]);
  }

  for (const [key, value] of Object.entries(DIGIT_MAP)) {
    if (calibrationValue.slice(index).startsWith(key)) {
      return value;
    }
  }

  return null;
}
