/**
 * Clones an object.
 *
 * @template T
 * @param {T} obj The object.
 * @return {T} The clone.
 */
export function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Memoizes a function
 *
 * @param {any} func The function.
 * @return {any} The memoized function.
 */
export function memoize<T>(func: (...args: any[]) => T): (...args: any[]) => T {
  const lookup = new Map<string, any>();

  return function () {
    const key = [...arguments].map((x) => JSON.stringify(x)).join("|");

    if (lookup.has(key)) {
      return lookup.get(key);
    }

    const result = func(...arguments);

    lookup.set(key, result);

    return result;
  };
}
