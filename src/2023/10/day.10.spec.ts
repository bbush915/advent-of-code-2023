import fs from "fs";

import { part1, part2 } from "./day.10";

describe("Day 10", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.10.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(4);
    });

    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync("./src/day.10.example.2.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(8);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(6717);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the third example", function () {
      const input = fs.readFileSync("./src/day.10.example.3.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(4);
    });

    it("should calculate the correct answer for the fourth example", function () {
      const input = fs.readFileSync("./src/day.10.example.4.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(8);
    });

    it("should calculate the correct answer for the fifth example", function () {
      const input = fs.readFileSync("./src/day.10.example.5.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(10);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(381);
    });
  });
});
