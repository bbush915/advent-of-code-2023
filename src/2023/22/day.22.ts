import fs from "fs";

type Support = {
  z: number;
  i: number;
};

function parseInput() {
  return fs
    .readFileSync("src/day.22.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("~").map((x) => x.split(",").map(Number)))
    .sort((x, y) => Math.min(x[0][2], x[1][2]) - Math.min(y[0][2], y[1][2]));
}

export function part1() {
  const brickSupportLookup = getBrickSupportLookup();

  let count = 0;

  for (let i = 0; i < brickSupportLookup.size; i++) {
    let canDisintegrate = true;

    for (let j = 0; j < brickSupportLookup.size; j++) {
      if (i === j) {
        continue;
      }

      if (
        brickSupportLookup.get(j)?.has(i) &&
        brickSupportLookup.get(j)?.size === 1
      ) {
        canDisintegrate = false;
        break;
      }
    }

    if (canDisintegrate) {
      count++;
    }
  }

  return count;
}

export function part2() {
  const brickSupportLookup = getBrickSupportLookup();

  let count = 0;

  for (let i = 0; i < brickSupportLookup.size; i++) {
    const brickSupportLookup_ = clone(brickSupportLookup);

    const disintegrations = [i];

    while (disintegrations.length > 0) {
      const disintegration = disintegrations.shift()!;

      for (let j = 0; j < brickSupportLookup.size; j++) {
        if (i === j) {
          continue;
        }

        const brickSupports = brickSupportLookup_.get(j);

        if (!brickSupports) {
          continue;
        }

        if (brickSupports.has(disintegration)) {
          brickSupports.delete(disintegration);

          if (brickSupports.size === 0) {
            disintegrations.push(j);

            count++;
          }
        }
      }
    }
  }

  return count;
}

function getBrickSupportLookup() {
  const bricks = parseInput();

  const maxX = Math.max(
    ...bricks.map((brick) => Math.max(brick[0][0], brick[1][0]))
  );

  const maxY = Math.max(
    ...bricks.map((brick) => Math.max(brick[0][1], brick[1][1]))
  );

  const supports: Support[][] = [...new Array(maxX + 1)].map(() =>
    [...new Array(maxY + 1)].map(() => ({ z: 0, i: -1 }))
  );

  const brickSupportLookup = new Map<number, Set<number>>();

  for (let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];

    const dx = brick[1][0] - brick[0][0];
    const dy = brick[1][1] - brick[0][1];
    const dz = brick[1][2] - brick[0][2];

    const possibleSupports: Support[] = [];

    for (let n = 0; n <= Math.max(Math.abs(dx), Math.abs(dy)); n++) {
      const x = brick[0][0] + Math.sign(dx) * n;
      const y = brick[0][1] + Math.sign(dy) * n;

      possibleSupports.push(supports[x][y]);
    }

    const maxZ = Math.max(...possibleSupports.map((x) => x.z)) + 1;

    for (const support of possibleSupports.filter(
      (support) => support.z === maxZ - 1
    )) {
      if (!brickSupportLookup.has(i)) {
        brickSupportLookup.set(i, new Set<number>());
      }

      brickSupportLookup.get(i)!.add(support.i);
    }

    for (
      let n = 0;
      n <= Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
      n++
    ) {
      const x = brick[0][0] + Math.sign(dx) * n;
      const y = brick[0][1] + Math.sign(dy) * n;

      supports[x][y] = {
        z: maxZ + n * Math.sign(dz),
        i,
      };
    }
  }

  return brickSupportLookup;
}

function clone(brickSupportLookup: Map<number, Set<number>>) {
  return new Map(
    [...brickSupportLookup.entries()].map(([i, brickSupports]) => [
      i,
      new Set(brickSupports),
    ])
  );
}
