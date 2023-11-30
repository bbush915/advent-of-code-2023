import { MinPriorityQueue } from "./data-structure";

export type DistanceFunction = (x: string, y: string) => number;

const DefaultGetDistance: DistanceFunction = (_x, _y) => 1;

export type HeuristicFunction = (key: string) => number;

const DefaultGetHeuristic: HeuristicFunction = (_key) => 0;

export function search(
  getNeighbors: (key: string) => string[],
  source: string,
  target?: string,
  getDistance: DistanceFunction = DefaultGetDistance,
  getHeuristic: HeuristicFunction = DefaultGetHeuristic
) {
  const distanceLookup = new Map();
  distanceLookup.set(source, 0);

  const predecessorLookup = new Map();
  predecessorLookup.set(source, undefined);

  const priorityQueue = new MinPriorityQueue();
  priorityQueue.insert(source, getHeuristic(source));

  while (priorityQueue.size > 0) {
    const { key } = priorityQueue.pop()!;

    if (key === target) {
      break;
    }

    for (const neighborKey of getNeighbors(key)) {
      const distance = distanceLookup.get(key) + getDistance(key, neighborKey);

      if (
        distance < (distanceLookup.get(neighborKey) ?? Number.POSITIVE_INFINITY)
      ) {
        distanceLookup.set(neighborKey, distance);
        predecessorLookup.set(neighborKey, key);

        const heuristic = distance + getHeuristic(neighborKey);

        if (priorityQueue.includes(neighborKey)) {
          priorityQueue.update(neighborKey, heuristic);
        } else {
          priorityQueue.insert(neighborKey, heuristic);
        }
      }
    }
  }

  return { distanceLookup, predecessorLookup };
}
