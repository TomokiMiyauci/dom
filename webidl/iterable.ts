import { Constructor } from "../deps.ts";
import { CreateMethodProperty } from "../ecma/abstract_operations.ts";

interface IndexedProperty<T = unknown> {
  [k: number]: T;
  length: number;
}

const { keys, values, entries, forEach } = Array.prototype;

/** Iterable decorator. */
export function iterable<T extends Constructor<IndexedProperty>>(Ctor: T) {
  CreateMethodProperty(Ctor.prototype, Symbol.iterator, values);
  CreateMethodProperty(Ctor.prototype, "values", values);
  CreateMethodProperty(Ctor.prototype, "keys", keys);
  CreateMethodProperty(Ctor.prototype, "entries", entries);
  CreateMethodProperty(Ctor.prototype, "forEach", forEach);
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
