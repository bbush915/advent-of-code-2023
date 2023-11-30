import { getIntersection, Point, Segment } from "./geometry";

describe("utils", function () {
  describe("geometry", function () {
    describe("intersection", function () {
      it("should handle segments intersecting at a single point", function () {
        const s1: Segment = [
          { x: 1, y: 1 },
          { x: 3, y: 2 },
        ];

        const s2: Segment = [
          { x: 1, y: 4 },
          { x: 2, y: -1 },
        ];

        const intersection = getIntersection(s1, s2);

        expect(intersection).not.toBeNull();

        const point = intersection as Point;

        expect(point.x).toBe(17 / 11);
        expect(point.y).toBe(14 / 11);
      });

      it("should handle non-intersecting segments", function () {
        const s1: Segment = [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ];

        const s2: Segment = [
          { x: 0, y: 1 },
          { x: 1, y: 2 },
        ];

        const intersection = getIntersection(s1, s2);

        expect(intersection).toBeNull();
      });
    });
  });
});
