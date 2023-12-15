import fs from "fs";

import "../../utils/array";
import { isNumeric } from "../../utils/number";

function parseInput() {
  return fs
    .readFileSync("src/day.3.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));
}

export function part1() {
  const schematic = parseInput();

  let sum = 0;
  let digits: string[] = [];

  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < schematic[i].length; j++) {
      const character = getCharacter(schematic, i, j);

      const isDigit = isNumeric(character);

      if (isDigit) {
        digits.push(character as string);
      }

      const isEndOfLine = j === schematic[i].length - 1;

      if (digits.length > 0 && (!isDigit || isEndOfLine)) {
        const partNumber = Number(digits.join(""));

        outer: for (let x = i - 1; x < i + 2; x++) {
          for (let y = j - digits.length - 1; y < j + 1; y++) {
            if (isSymbol(getCharacter(schematic, x, y))) {
              sum += partNumber;
              break outer;
            }
          }
        }

        digits = [];
      }
    }
  }

  return sum;
}

export function part2() {
  const schematic = parseInput();

  const gears = new Map<string, Array<number>>();
  let digits: string[] = [];

  for (let i = 0; i < schematic.length; i++) {
    for (let j = 0; j < schematic[i].length; j++) {
      const character = getCharacter(schematic, i, j);

      const isDigit = isNumeric(character);

      if (isDigit) {
        digits.push(character as string);
      }

      const isEndOfLine = j === schematic[i].length - 1;

      if (digits.length > 0 && (!isDigit || isEndOfLine)) {
        const partNumber = Number(digits.join(""));

        for (let x = i - 1; x < i + 2; x++) {
          for (let y = j - digits.length - 1; y < j + 1; y++) {
            if (getCharacter(schematic, x, y) === "*") {
              const key = toKey(x, y);

              if (!gears.has(key)) {
                gears.set(key, []);
              }

              gears.get(key)!.push(partNumber);
            }
          }
        }

        digits = [];
      }
    }
  }

  return [...gears.values()]
    .filter((partNumbers) => partNumbers.length === 2)
    .map((partNumbers) => partNumbers.product())
    .sum();
}

function getCharacter(schematic: string[][], i: number, j: number) {
  if (i < 0 || i >= schematic.length || j < 0 || j >= schematic[i].length) {
    return null;
  }

  return schematic[i][j];
}

function isSymbol(character: string | null) {
  return character && character !== "." && !isNumeric(character);
}

function toKey(i: number, j: number) {
  return `${i}|${j}`;
}
