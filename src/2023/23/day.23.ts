import fs from "fs";

type TilePath = {
  current: string;
  tileLookup: Set<string>;
};

type JunctionPath = {
  current: string;
  junctionLookup: Set<string>;
  totalDistance: number;
};

type Junction = {
  tile: string;
  distance: number;
};

function parseInput() {
  const map = fs
    .readFileSync("src/day.23.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map((x) => x.split(""));

  const start = toKey(
    0,
    map[0].findIndex((x) => x === ".")
  );

  const finish = toKey(
    map.length - 1,
    map[map.length - 1].findIndex((x) => x === ".")
  );

  return {
    map,
    start,
    finish,
  };
}

export function part1() {
  return getLongestHike(getNeighbors1);
}

export function part2() {
  return getLongestHike(getNeighbors2);
}

function getLongestHike(
  getNeighbors: (map: string[][], path: TilePath) => string[]
) {
  const { map, start, finish } = parseInput();
  const junctionLookup = getJunctionLookup(map, start, finish, getNeighbors);

  const paths: JunctionPath[] = [
    {
      current: start,
      junctionLookup: new Set<string>([start]),
      totalDistance: 0,
    },
  ];

  const hikes: JunctionPath[] = [];

  while (paths.length > 0) {
    const path = paths.shift()!;

    if (path.current === finish) {
      hikes.push(path);
      continue;
    }

    if (!canReachFinish(junctionLookup, path, finish)) {
      continue;
    }

    for (const connectedJunction of junctionLookup.get(path.current)!) {
      if (path.junctionLookup.has(connectedJunction.tile)) {
        continue;
      }

      paths.push({
        current: connectedJunction.tile,
        junctionLookup: new Set<string>([
          ...path.junctionLookup,
          connectedJunction.tile,
        ]),
        totalDistance: path.totalDistance + connectedJunction.distance,
      });
    }
  }

  return Math.max(...hikes.map((x) => x.totalDistance));
}

function canReachFinish(
  junctionLookup: Map<string, Junction[]>,
  path: JunctionPath,
  finish: string
) {
  const paths: JunctionPath[] = [
    {
      current: path.current,
      junctionLookup: new Set<string>(path.junctionLookup),
      totalDistance: path.totalDistance,
    },
  ];

  while (paths.length > 0) {
    const path = paths.pop()!;

    if (path.current === finish) {
      return true;
    }

    for (const connectedJunction of junctionLookup.get(path.current)!) {
      if (path.junctionLookup.has(connectedJunction.tile)) {
        continue;
      }

      paths.push({
        current: connectedJunction.tile,
        junctionLookup: new Set<string>([
          ...path.junctionLookup,
          connectedJunction.tile,
        ]),
        totalDistance: path.totalDistance + connectedJunction.distance,
      });
    }
  }

  return false;
}

function getJunctionLookup(
  map: string[][],
  start: string,
  finish: string,
  getNeighbors: (map: string[][], path: TilePath) => string[]
) {
  const junctionLookup = new Map<string, Junction[]>();

  const junctions: Junction[] = [{ tile: start, distance: 0 }];

  while (junctions.length > 0) {
    const source = junctions.shift()!;

    const connectedJunctions = getConnectedJunctions(
      map,
      finish,
      getNeighbors,
      source
    );

    junctionLookup.set(
      source.tile,
      connectedJunctions.map((junction) => ({
        tile: junction.tile,
        distance: junction.distance,
      }))
    );

    junctions.push(
      ...connectedJunctions.filter(
        (junction) =>
          !junctionLookup.has(junction.tile) && junction.tile !== finish
      )
    );
  }

  return junctionLookup;
}

function getConnectedJunctions(
  map: string[][],
  finish: string,
  getNeighbors: (map: string[][], path: TilePath) => string[],
  source: Junction
) {
  const connectedJunctions: Junction[] = [];

  const paths: TilePath[] = [
    {
      current: source.tile,
      tileLookup: new Set<string>([source.tile]),
    },
  ];

  while (paths.length > 0) {
    const path = paths.shift()!;

    if (path.current === finish) {
      connectedJunctions.push({
        tile: finish,
        distance: path.tileLookup.size - 1,
      });

      continue;
    }

    const neighbors = getNeighbors(map, path);

    if (neighbors.length === 1 || path.current === source.tile) {
      paths.push(
        ...neighbors.map((neighbor) => ({
          current: neighbor,
          tileLookup: new Set<string>([...path.tileLookup, neighbor]),
        }))
      );

      continue;
    }

    if (neighbors.length > 1) {
      connectedJunctions.push({
        tile: path.current,
        distance: path.tileLookup.size - 1,
      });

      continue;
    }
  }

  return connectedJunctions;
}

function getNeighbors1(map: string[][], path: TilePath) {
  const [i, j] = fromKey(path.current);

  return [
    [i - 1, j],
    [i, j - 1],
    [i, j + 1],
    [i + 1, j],
  ]
    .filter(([i_, j_]) => {
      // NOTE - Check bounds.
      if (i_ < 0 || i_ > map.length - 1 || j_ < 0 || j_ > map[0].length - 1) {
        return false;
      }

      // NOTE - Check forest.
      if (map[i_][j_] === "#") {
        return false;
      }

      // NOTE - Check path.
      if (path.tileLookup.has(toKey(i_, j_))) {
        return false;
      }

      // NOTE - Check slopes.
      switch (map[i][j]) {
        case "<": {
          if (j_ !== j - 1) {
            return false;
          }

          break;
        }

        case "^": {
          if (i_ !== i - 1) {
            return false;
          }

          break;
        }

        case ">": {
          if (j_ !== j + 1) {
            return false;
          }

          break;
        }

        case "v": {
          if (i_ !== i + 1) {
            return false;
          }

          break;
        }
      }

      return true;
    })
    .map(([i, j]) => toKey(i, j));
}

function getNeighbors2(map: string[][], path: TilePath) {
  const [i, j] = fromKey(path.current);

  return [
    [i - 1, j],
    [i, j - 1],
    [i, j + 1],
    [i + 1, j],
  ]
    .filter(([i, j]) => {
      // NOTE - Check bounds.
      if (i < 0 || i > map.length - 1 || j < 0 || j > map[0].length - 1) {
        return false;
      }

      // NOTE - Check forest.
      if (map[i][j] === "#") {
        return false;
      }

      // NOTE - Check path.
      if (path.tileLookup.has(toKey(i, j))) {
        return false;
      }

      return true;
    })
    .map(([i, j]) => toKey(i, j));
}

function toKey(i: number, j: number) {
  return `${i}|${j}`;
}

function fromKey(key: string) {
  return key.split("|").map(Number);
}
