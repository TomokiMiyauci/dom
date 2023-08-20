import { Constructor, enumerate, range } from "../deps.ts";

interface IndexedProperty {
  [k: number]: unknown;
  length: number;
}

/** Iterable mixin.
 */
export function iterable<T extends Constructor<IndexedProperty>>(Ctor: T) {
  abstract class Iterator extends Ctor implements Iterable<unknown> {
    *[Symbol.iterator](): IterableIterator<unknown> {
      for (const index of this.keys()) yield this[index];
    }

    *keys(): IterableIterator<number> {
      yield* range(0, this.length);
    }

    values(): IterableIterator<unknown> {
      return this[Symbol.iterator]();
    }

    *entries(): IterableIterator<[number, unknown]> {
      for (const [index, item] of enumerate(this.values())) yield [index, item];
    }

    forEach(
      callbackfn: (value: unknown, key: number, parent: this) => void,
    ): void {
      for (const [index, value] of this.entries()) {
        callbackfn(value, index, this);
      }
    }
  }

  return Iterator;
}

export interface Iterable<T> {
  [Symbol.iterator](): IterableIterator<T>;
  entries(): IterableIterator<[number, T]>;
  keys(): IterableIterator<number>;
  values(): IterableIterator<T>;
  forEach(callbackfn: (value: T, key: number, parent: this) => void): void;
}
