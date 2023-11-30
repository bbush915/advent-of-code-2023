type Element = {
  key: string;
  value: number;
};

type Comparator = (x: Element, y: Element) => number;

class PriorityQueue {
  private readonly comparator: Comparator;
  private readonly indexLookup: Map<string, number>;
  private readonly elements: Element[];

  constructor(comparator: (x: Element, y: Element) => number) {
    this.comparator = comparator;
    this.indexLookup = new Map<string, number>();

    // NOTE - Pad with empty element to simplify heap operations.
    this.elements = [null as unknown as Element];
  }

  get size() {
    return this.elements.length - 1;
  }

  peek() {
    return this.elements[1];
  }

  pop() {
    if (this.size === 0) {
      return null;
    }

    this._swap(1, this.size);

    const element = this.elements.pop() as Element;
    this.indexLookup.delete(element.key);

    this._heapifyDown(1);

    return element;
  }

  includes(key: string) {
    return this.indexLookup.has(key);
  }

  insert(key: string, value: number) {
    this.elements.push({ key, value });
    this.indexLookup.set(key, this.size);

    this._heapifyUp(this.size);
  }

  update(key: string, value: number) {
    let i = this.indexLookup.get(key);

    if (i === undefined) {
      return;
    }

    this.elements[i].value = value;

    this._heapifyDown(i);
  }

  private _heapifyUp(i: number) {
    let parent = this._parent(i);

    while (
      i > 1 &&
      this.comparator(this.elements[parent], this.elements[i]) < 0
    ) {
      this._swap(parent, i);

      i = parent;
      parent = this._parent(i);
    }
  }

  private _heapifyDown(i: number) {
    let max = i;

    const left = this._left(i);

    if (
      left <= this.size &&
      this.comparator(this.elements[left], this.elements[i]) > 0
    ) {
      max = left;
    }

    const right = this._right(i);

    if (
      right <= this.size &&
      this.comparator(this.elements[right], this.elements[i]) > 0 &&
      this.comparator(this.elements[right], this.elements[max]) > 0
    ) {
      max = right;
    }

    if (max !== i) {
      this._swap(max, i);

      this._heapifyDown(max);
    }
  }

  private _swap(i: number, j: number) {
    this.indexLookup.set(this.elements[i].key, j);
    this.indexLookup.set(this.elements[j].key, i);

    [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
  }

  private _parent(i: number) {
    return i >> 1;
  }

  private _left(i: number) {
    return i << 1;
  }

  private _right(i: number) {
    return (i << 1) + 1;
  }
}

export class MinPriorityQueue extends PriorityQueue {
  constructor() {
    super((x, y) => y.value - x.value);
  }
}

export class MaxPriorityQueue extends PriorityQueue {
  constructor() {
    super((x, y) => x.value - y.value);
  }
}
