import fs from "fs";

import "./utils/array";

type Module = {
  name: string;
  type: ModuleTypes;
  connections: string[];
};

enum ModuleTypes {
  BROADCAST,
  FLIP_FLOP,
  CONJUNCTION,
  TERMINATION,
}

type Pulse = {
  src: string;
  dst: string;
  type: PulseTypes;
};

enum PulseTypes {
  HI,
  LO,
}

function parseInput() {
  const modules = fs
    .readFileSync("src/day.20.input.txt")
    .toString()
    .split("\n")
    .filter((x) => x)
    .map<Module>((x) => {
      const parts = x.split(" -> ");

      const [name, type] = parseModuleNameAndType(parts[0])!;
      const connections = parts[1].split(", ");

      return {
        name,
        type,
        connections,
      };
    });

  modules.push({ name: "rx", type: ModuleTypes.TERMINATION, connections: [] });

  const moduleLookup = modules.reduce((lookup, module) => {
    lookup.set(module.name, module);
    return lookup;
  }, new Map<string, Module>());

  const srcLookup = modules
    .flatMap((module) =>
      module.connections.map((connection) => [module.name, connection])
    )
    .reduce((lookup, [src, dst]) => {
      if (!lookup.has(dst)) {
        lookup.set(dst, []);
      }

      lookup.get(dst)!.push(src);

      return lookup;
    }, new Map<string, string[]>());

  const dstLookup = modules.reduce((lookup, module) => {
    if (!lookup.has(module.name)) {
      lookup.set(module.name, []);
    }

    lookup.get(module.name)!.push(...module.connections);

    return lookup;
  }, new Map<string, string[]>());

  return { modules, moduleLookup, srcLookup, dstLookup };
}

function parseModuleNameAndType(value: string): [string, ModuleTypes] {
  if (value === "broadcaster") {
    return [value, ModuleTypes.BROADCAST];
  } else {
    switch (value[0]) {
      case "%": {
        return [value.slice(1), ModuleTypes.FLIP_FLOP];
      }

      case "&": {
        return [value.slice(1), ModuleTypes.CONJUNCTION];
      }
    }
  }

  throw new Error();
}

export function part1() {
  const { moduleLookup, srcLookup } = parseInput();

  let loCount = 0;
  let hiCount = 0;

  const flipFlopMemoryLookup = new Map<string, boolean>(
    [...moduleLookup.values()]
      .filter(({ type }) => type === ModuleTypes.FLIP_FLOP)
      .map(({ name }) => [name, false])
  );

  const conjunctionMemoryLookup = new Map<string, Map<string, PulseTypes>>(
    [...moduleLookup.values()]
      .filter(({ type }) => type === ModuleTypes.CONJUNCTION)
      .map(({ name }) => [
        name,
        new Map<string, PulseTypes>(
          srcLookup.get(name)!.map((src) => [src, PulseTypes.LO])
        ),
      ])
  );

  for (let n = 0; n < 1_000; n++) {
    const pulses: Pulse[] = [
      { src: "button", dst: "broadcaster", type: PulseTypes.LO },
    ];

    while (pulses.length > 0) {
      const pulse = pulses.shift()!;

      switch (pulse.type) {
        case PulseTypes.LO: {
          loCount++;
          break;
        }

        case PulseTypes.HI: {
          hiCount++;
          break;
        }
      }

      const module = moduleLookup.get(pulse.dst)!;

      switch (module?.type) {
        case ModuleTypes.BROADCAST: {
          pulses.push(
            ...module.connections.map((connection) => ({
              src: module.name,
              dst: connection,
              type: pulse.type,
            }))
          );

          break;
        }

        case ModuleTypes.FLIP_FLOP: {
          if (pulse.type === PulseTypes.HI) {
            break;
          }

          const memory = flipFlopMemoryLookup.get(module.name)!;
          flipFlopMemoryLookup.set(module.name, !memory);

          pulses.push(
            ...module.connections.map((connection) => ({
              src: module.name,
              dst: connection,
              type: memory ? PulseTypes.LO : PulseTypes.HI,
            }))
          );

          break;
        }

        case ModuleTypes.CONJUNCTION: {
          const memory = conjunctionMemoryLookup.get(module.name)!;
          memory.set(pulse.src, pulse.type);

          pulses.push(
            ...module.connections.map((connection) => ({
              src: module.name,
              dst: connection,
              type: [...memory.values()].every((x) => x === PulseTypes.HI)
                ? PulseTypes.LO
                : PulseTypes.HI,
            }))
          );

          break;
        }
      }
    }
  }

  return loCount * hiCount;
}

export function part2() {
  const { moduleLookup, srcLookup, dstLookup } = parseInput();

  return 0;
}
