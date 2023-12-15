import fs from "fs";

import { part1, part2 } from "./day.8";

describe("Day 8", function () {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("Part 1", function () {
    it("should calculate the correct answer for the first example", function () {
      const input = fs.readFileSync("./src/day.8.example.1.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(2);
    });

    it("should calculate the correct answer for the second example", function () {
      const input = fs.readFileSync("./src/day.8.example.2.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part1();

      expect(answer).toBe(6);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part1();
      expect(answer).toBe(18673);
    });
  });

  describe("Part 2", function () {
    it("should calculate the correct answer for the third example", function () {
      const input = fs.readFileSync("./src/day.8.example.3.txt");
      jest.spyOn(fs, "readFileSync").mockImplementation(() => input);

      const answer = part2();

      expect(answer).toBe(6);
    });

    it("should calculate the correct answer for the challenge", function () {
      const answer = part2();
      expect(answer).toBe(17972669116327);
    });
  });
});
