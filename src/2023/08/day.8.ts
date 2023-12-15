import fs from "fs";

import { gcd } from "../../utils/number";

type Node = {
  label: string;
  left: string;
  right: string;
};

function parseInput() {
  const sections = fs
    .readFileSync("src/day.8.input.txt")
    .toString()
    .split("\n\n");

  const instructions = sections[0].split("");

  const network = sections[1]
    .split("\n")
    .filter((x) => x)
    .map<Node>((x) => {
      const [label, left, right] = x.match(/[A-Z0-9]{3}/g)!;

      return {
        label,
        left,
        right,
      };
    })
    .reduce<Record<string, Node>>((lookup, node) => {
      lookup[node.label] = node;
      return lookup;
    }, {});

  return {
    instructions,
    network,
  };
}

export function part1() {
  const { instructions, network } = parseInput();

  let position = "AAA";
  let count = 0;

  while (position !== "ZZZ") {
    const direction = instructions[count % instructions.length];

    position =
      direction === "L" ? network[position].left : network[position].right;

    count++;
  }

  return count;
}

export function part2() {
  const { instructions, network } = parseInput();

  return Object.values(network)
    .filter((x) => x.label.endsWith("A"))
    .map(({ label }) => {
      let position = label;
      let count = 0;

      while (!position.endsWith("Z")) {
        const direction = instructions[count % instructions.length];

        position =
          direction === "L" ? network[position].left : network[position].right;

        count++;
      }

      return count;
    })
    .reduce((lcm, period) => {
      return (lcm * period) / gcd(lcm, period);
    }, 1);
}
