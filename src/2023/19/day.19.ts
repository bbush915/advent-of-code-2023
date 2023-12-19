import fs from "fs";

import "../../utils/array";
import { clone } from "../../utils/common";

type Workflow = {
  name: string;
  rules: Rule[];
};

type Rule = {
  target: string;
  condition: Condition | null;
};

type Condition = {
  category: Categories;
  operation: Operations;
  value: number;
};

enum Categories {
  X,
  M,
  A,
  S,
}

enum Operations {
  LESS_THAN = "<",
  GREATER_THAN = ">",
}

type WorkflowIntervals = {
  name: string;
  intervals: number[][];
};

function parseInput() {
  const sections = fs
    .readFileSync("src/day.19.input.txt")
    .toString()
    .split("\n\n");

  const workflowLookup = sections[0]
    .split("\n")
    .map((line) => {
      const name = line.slice(0, line.indexOf("{"));

      const rules: Rule[] = line
        .slice(line.indexOf("{") + 1, -1)
        .split(",")
        .map((chunk) => {
          const parts = chunk.split(":");

          if (parts.length === 1) {
            return {
              target: parts[0],
              condition: null,
            };
          }

          const condition: Condition = {
            category:
              Categories[parts[0][0].toUpperCase() as keyof typeof Categories],
            operation: parts[0][1] as Operations,
            value: Number(parts[0].slice(2)),
          };

          return {
            target: parts[1],
            condition,
          };
        });

      return {
        name,
        rules,
      };
    })
    .reduce((lookup, workflow) => {
      lookup.set(workflow.name, workflow);
      return lookup;
    }, new Map<string, Workflow>());

  const parts = sections[1]
    .split("\n")
    .filter((x) => x)
    .map((x) => x.match(/\d+/g)!.map(Number));

  return {
    workflowLookup,
    parts,
  };
}

export function part1() {
  const { workflowLookup, parts } = parseInput();

  return parts
    .map((part) => {
      let currentWorkflow = workflowLookup.get("in")!;

      while (1) {
        let target: string;

        worflowLoop: for (const rule of currentWorkflow.rules) {
          if (!rule.condition) {
            target = rule.target;
            break;
          }

          switch (rule.condition.operation) {
            case Operations.LESS_THAN: {
              if (part[rule.condition.category] < rule.condition.value) {
                target = rule.target;
                break worflowLoop;
              }

              break;
            }

            case Operations.GREATER_THAN: {
              if (part[rule.condition.category] > rule.condition.value) {
                target = rule.target;
                break worflowLoop;
              }

              break;
            }
          }
        }

        switch (target!) {
          case "A": {
            return part.sum();
          }

          case "R": {
            return 0;
          }

          default: {
            currentWorkflow = workflowLookup.get(target!)!;
            break;
          }
        }
      }

      throw new Error();
    })
    .sum();
}

export function part2() {
  const { workflowLookup } = parseInput();

  const acceptedIntervals: number[][][] = [];

  const workflowIntervals: WorkflowIntervals[] = [
    {
      name: "in",
      intervals: [
        [1, 4000],
        [1, 4000],
        [1, 4000],
        [1, 4000],
      ],
    },
  ];

  while (workflowIntervals.length > 0) {
    const { name, intervals } = workflowIntervals.shift()!;

    if (name === "A") {
      acceptedIntervals.push(intervals);
      continue;
    } else if (name === "R") {
      continue;
    }

    const workflow = workflowLookup.get(name)!;

    for (const { target, condition } of workflow.rules) {
      if (!condition) {
        workflowIntervals.push({ name: target, intervals });
        break;
      }

      const { category, operation, value } = condition;

      const categoryInterval = intervals[category];

      const min = Math.min(...categoryInterval);
      const max = Math.max(...categoryInterval);

      switch (operation) {
        case Operations.LESS_THAN: {
          if (min >= value) {
            continue;
          }

          const intervals_ = clone(intervals);

          intervals_[category][0] = min;
          intervals_[category][1] = value - 1;

          workflowIntervals.push({ name: target, intervals: intervals_ });

          categoryInterval[0] = value;
          categoryInterval[1] = max;

          break;
        }

        case Operations.GREATER_THAN: {
          if (max <= value) {
            continue;
          }

          const intervals_ = clone(intervals);

          intervals_[category][0] = value + 1;
          intervals_[category][1] = max;

          workflowIntervals.push({ name: target, intervals: intervals_ });

          categoryInterval[0] = min;
          categoryInterval[1] = value;

          break;
        }
      }
    }
  }

  return acceptedIntervals
    .map((intervals) => intervals.map(([min, max]) => max - min + 1).product())
    .sum();
}
