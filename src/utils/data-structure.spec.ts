import { MaxPriorityQueue, MinPriorityQueue } from "./data-structure";

describe("utils", function () {
  describe("data-structure", function () {
    describe("min-priority-queue", function () {
      it("should return the correct element", function () {
        const priorityQueue = new MinPriorityQueue();

        priorityQueue.insert("A", 10);
        priorityQueue.insert("B", 25);
        priorityQueue.insert("C", 5);
        priorityQueue.insert("D", 20);

        const element = priorityQueue.pop();

        expect(element).toBeDefined();
        expect(element!.key).toEqual("C");
      });

      it("should handle updating priority", function () {
        const priorityQueue = new MinPriorityQueue();

        priorityQueue.insert("A", 10);
        priorityQueue.insert("B", 25);
        priorityQueue.insert("C", 5);
        priorityQueue.insert("D", 20);

        priorityQueue.update("C", 50);

        const element = priorityQueue.pop();

        expect(element).toBeDefined();
        expect(element!.key).toEqual("A");
      });
    });

    describe("max-priority-queue", function () {
      it("should return the correct element", function () {
        const priorityQueue = new MaxPriorityQueue();

        priorityQueue.insert("A", 10);
        priorityQueue.insert("B", 25);
        priorityQueue.insert("C", 5);
        priorityQueue.insert("D", 20);

        const element = priorityQueue.pop();

        expect(element).toBeDefined();
        expect(element!.key).toEqual("B");
      });

      it("should handle updating priority", function () {
        const priorityQueue = new MaxPriorityQueue();

        priorityQueue.insert("A", 10);
        priorityQueue.insert("B", 25);
        priorityQueue.insert("C", 5);
        priorityQueue.insert("D", 20);

        priorityQueue.update("B", 1);

        const element = priorityQueue.pop();

        expect(element).toBeDefined();
        expect(element!.key).toEqual("D");
      });
    });
  });
});
