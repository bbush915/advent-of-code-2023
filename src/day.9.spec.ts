import fs from "fs";

import { part1, part2 } from "./day.9";

describe("Day 9", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.9.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(114);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(1581679977);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.9.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(2);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(889);
    });
  });
});
