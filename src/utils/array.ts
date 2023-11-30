declare global {
  interface Array<T> {
    /**
     * Calculates the sum of an array of numbers.
     *
     * @param {number[]} this The array of values.
     * @return {number} The sum, or 0 if the array is empty.
     */
    sum(this: number[]): number;

    /**
     * Calculates the product of an array of numbers.
     *
     * @param {number[]} this The array of values.
     * @return {number} The product, or 1 if the array is empty.
     */
    product(this: number[]): number;
  }
}

Object.defineProperty(Array.prototype, "sum", {
  configurable: true,
  writable: true,
  enumerable: false,
  value: function (this: number[]) {
    return this.reduce((sum, value) => (sum += value), 0);
  },
});

Object.defineProperty(Array.prototype, "product", {
  configurable: true,
  writable: true,
  enumerable: false,
  value: function (this: number[]) {
    return this.reduce((product, value) => (product *= value), 1);
  },
});

/**
 * Determines whether the given value is an array.
 *
 * @param {*} value The value.
 * @return {boolean} A value indicating whether the value is an array.
 */
export function isArray(value: any): boolean {
  return Array.isArray(value);
}

/**
 * Returns the cartesian product of the given arrays.
 *
 * @template T
 * @param {T[][]} arrays The arrays.
 * @return {T[][]} The cartesian product of the given arrays.
 */
export function cartesian<T>(...arrays: T[][]): T[][] {
  return arrays.reduce(
    (productArrays, array) =>
      productArrays.flatMap((productArray) =>
        array.map((value) => [...productArray, value])
      ),
    [[]] as T[][]
  );
}
