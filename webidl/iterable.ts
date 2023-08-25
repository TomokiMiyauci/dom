import { Constructor } from "../deps.ts";

interface IndexedProperty<T = unknown> {
  [k: number]: T;
  length: number;
}

const { keys, values, entries, forEach } = Array.prototype;

/** Iterable mixin.
 */
export function iterable<T extends Constructor<IndexedProperty>>(Ctor: T) {
  abstract class Iterator extends Ctor implements Iterable {
    [Symbol.iterator] = values;
    keys = keys;
    values = values;
    entries = entries;
    forEach = forEach;
  }

  return Iterator;
}

export interface Iterable<T = unknown> extends
  IndexedProperty<T>,
  Pick<
    Array<T>,
    "entries" | "keys" | "values" | typeof Symbol.iterator
  > {
  forEach(
    callbackfn: (value: T, key: number, parent: this) => void,
    thisArg: any,
  ): void;
}
