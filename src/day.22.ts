import fs from "fs";

type Support = {
  height: number;
  brick: number;
};

function parseInput() {
  return fs
    .readFileSync("src/day.22.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split("~").map((x) => x.split(",").map(Number)));
}

export function part1() {
  const bricks = parseInput().sort(
    (x, y) => Math.min(x[0][2], x[1][2]) - Math.min(y[0][2], y[1][2])
  );

  const maxX = Math.max(
    ...bricks.map((brick) => Math.max(brick[0][0], brick[1][0]))
  );
  const maxY = Math.max(
    ...bricks.map((brick) => Math.max(brick[0][1], brick[1][1]))
  );
  const maxZ = Math.max(
    ...bricks.map((brick) => Math.max(brick[0][2], brick[1][2]))
  );

  const tower: boolean[][][] = [];

  for (let z = 0; z <= maxZ; z++) {
    const layer: boolean[][] = [];

    for (let x = 0; x <= maxX; x++) {
      const row: boolean[] = [];

      for (let y = 0; y <= maxY; y++) {
        row.push(false);
      }

      layer.push(row);
    }

    tower.push(layer);
  }

  const supportLookup = new Map<number, Set<number>>();

  const supports: Support[][] = [...new Array(maxX + 1)].map(() =>
    [...new Array(maxY + 1)].map(() => ({ height: 0, brick: -1 }))
  );

  for (let brickIndex = 0; brickIndex < bricks.length; brickIndex++) {
    const brick = bricks[brickIndex];

    const dx = brick[1][0] - brick[0][0];
    const dy = brick[1][1] - brick[0][1];
    const dz = brick[1][2] - brick[0][2];

    const possibleBrickSupports: Support[] = [];

    for (let n = 0; n <= Math.max(Math.abs(dx), Math.abs(dy)); n++) {
      const x = brick[0][0] + Math.sign(dx) * n;
      const y = brick[0][1] + Math.sign(dy) * n;

      possibleBrickSupports.push(supports[x][y]);
    }

    const maxBrickHeight =
      Math.max(...possibleBrickSupports.map((x) => x.height)) + 1;

    const brickSupports: Support[] = possibleBrickSupports.filter(
      (x) => x.height === maxBrickHeight - 1
    );

    for (const support of brickSupports) {
      if (!supportLookup.has(brickIndex)) {
        supportLookup.set(brickIndex, new Set<number>());
      }

      supportLookup.get(brickIndex)!.add(support.brick);
    }

    for (
      let n = 0;
      n <= Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
      n++
    ) {
      const x = brick[0][0] + Math.sign(dx) * n;
      const y = brick[0][1] + Math.sign(dy) * n;
      const z = brick[0][2] + Math.sign(dz) * n;

      tower[maxBrickHeight + n][x][y] = true;

      supports[x][y] = {
        height: maxBrickHeight + n * Math.sign(dz),
        brick: brickIndex,
      };
    }
  }

  let count = 0;

  for (let i = 0; i < bricks.length; i++) {
    let canDisintegrate = true;

    for (let j = 0; j < bricks.length; j++) {
      if (i === j) {
        continue;
      }

      if (supportLookup.get(j)?.has(i) && supportLookup.get(j)?.size === 1) {
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
  const bricks = parseInput().sort(
    (x, y) => Math.min(x[0][2], x[1][2]) - Math.min(y[0][2], y[1][2])
  );

  const maxX = Math.max(
    ...bricks.map((brick) => Math.max(brick[0][0], brick[1][0]))
  );
  const maxY = Math.max(
    ...bricks.map((brick) => Math.max(brick[0][1], brick[1][1]))
  );
  const maxZ = Math.max(
    ...bricks.map((brick) => Math.max(brick[0][2], brick[1][2]))
  );

  const tower: boolean[][][] = [];

  for (let z = 0; z <= maxZ; z++) {
    const layer: boolean[][] = [];

    for (let x = 0; x <= maxX; x++) {
      const row: boolean[] = [];

      for (let y = 0; y <= maxY; y++) {
        row.push(false);
      }

      layer.push(row);
    }

    tower.push(layer);
  }

  const supportLookup = new Map<number, Set<number>>();

  const supports: Support[][] = [...new Array(maxX + 1)].map(() =>
    [...new Array(maxY + 1)].map(() => ({ height: 0, brick: -1 }))
  );

  for (let brickIndex = 0; brickIndex < bricks.length; brickIndex++) {
    const brick = bricks[brickIndex];

    const dx = brick[1][0] - brick[0][0];
    const dy = brick[1][1] - brick[0][1];
    const dz = brick[1][2] - brick[0][2];

    const possibleBrickSupports: Support[] = [];

    for (let n = 0; n <= Math.max(Math.abs(dx), Math.abs(dy)); n++) {
      const x = brick[0][0] + Math.sign(dx) * n;
      const y = brick[0][1] + Math.sign(dy) * n;

      possibleBrickSupports.push(supports[x][y]);
    }

    const maxBrickHeight =
      Math.max(...possibleBrickSupports.map((x) => x.height)) + 1;

    const brickSupports: Support[] = possibleBrickSupports.filter(
      (x) => x.brick >= 0 && x.height === maxBrickHeight - 1
    );

    for (const support of brickSupports) {
      if (!supportLookup.has(brickIndex)) {
        supportLookup.set(brickIndex, new Set<number>());
      }

      supportLookup.get(brickIndex)!.add(support.brick);
    }

    for (
      let n = 0;
      n <= Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz));
      n++
    ) {
      const x = brick[0][0] + Math.sign(dx) * n;
      const y = brick[0][1] + Math.sign(dy) * n;
      const z = brick[0][2] + Math.sign(dz) * n;

      tower[maxBrickHeight + n][x][y] = true;

      supports[x][y] = {
        height: maxBrickHeight + n * Math.sign(dz),
        brick: brickIndex,
      };
    }
  }

  let count = 0;

  for (let i = 0; i < bricks.length; i++) {
    const newSupportLookup = new Map(
      [...supportLookup.entries()].map(([brickIndex, supports]) => [
        brickIndex,
        new Set(supports),
      ])
    );

    const removals = [i];

    while (removals.length > 0) {
      const removal = removals.shift()!;

      for (let j = 0; j < bricks.length; j++) {
        if (i === j) {
          continue;
        }

        const lookup = newSupportLookup.get(j);

        if (!lookup) {
          continue;
        }

        if (lookup.has(removal)) {
          lookup.delete(removal);

          if (lookup.size === 0) {
            count++;
            removals.push(j);
          }
        }
      }
    }
  }

  return count;
}
