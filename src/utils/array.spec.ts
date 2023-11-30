import { cartesian, isArray } from "./array";

describe("utils", function () {
  describe("array", function () {
    describe("sum", function () {
      it("should add an array of numbers correctly", function () {
        const values = [1, 2, 3, 4, 5];
        const sum = values.sum();

        expect(sum).toBe(15);
      });

      it("should return 0 for an empty array", function () {
        const values: number[] = [];
        const sum = values.sum();

        expect(sum).toBe(0);
      });
    });

    describe("product", function () {
      it("should multiply an array of numbers", function () {
        const values = [1, 2, 3, 4, 5];
        const sum = values.product();

        expect(sum).toBe(120);
      });

      it("should return 1 for an empty array", function () {
        const values: number[] = [];
        const sum = values.product();

        expect(sum).toBe(1);
      });
    });

    describe("isArray", function () {
      it("should return true for an array", function () {
        expect(isArray([])).toBe(true);
      });

      it("should return false for string", function () {
        expect(isArray("")).toBe(false);
      });

      it("should return false for number", function () {
        expect(isArray(0)).toBe(false);
      });

      it("should return false for object", function () {
        expect(isArray({})).toBe(false);
      });
    });

    describe("cartesian", function () {
      it("should calculate the cartesian product of a single array with a single item", function () {
        expect(cartesian([1])).toEqual([[1]]);
      });

      it("should calculate the cartesian product of a single array with multiple items", function () {
        expect(cartesian([1, 2])).toEqual([[1], [2]]);
      });

      it("should calculate the cartesian product of two numeric arrays", function () {
        expect(cartesian([1, 2], [3, 4])).toEqual([
          [1, 3],
          [1, 4],
          [2, 3],
          [2, 4],
        ]);
      });

      it("should calculate the cartesian product of two mixed arrays", function () {
        expect(cartesian([1, "a"], [2, "b"])).toEqual([
          [1, 2],
          [1, "b"],
          ["a", 2],
          ["a", "b"],
        ]);
      });

      it("should calculate the cartesian product of three numeric arrays", function () {
        expect(cartesian([1, 2], [3, 4], [5, 6])).toEqual([
          [1, 3, 5],
          [1, 3, 6],
          [1, 4, 5],
          [1, 4, 6],
          [2, 3, 5],
          [2, 3, 6],
          [2, 4, 5],
          [2, 4, 6],
        ]);
      });
    });
  });
});
