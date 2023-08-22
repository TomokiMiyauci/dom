import { enumerate, reduce } from "../deps.ts";
import { Indexer } from "./utils.ts";

export type Entry<T = unknown> = [index: number, item: T];

export abstract class ListCore<T> extends Indexer<T | undefined> {
  readonly [index: number]: T;

  protected list: T[];

  constructor(iterable?: Iterable<T>) {
    const list: T[] = [];
    super((index) => list[index]);

    if (iterable) for (const item of iterable) list.push(item);

    this.list = list;
  }

  protected abstract create(): this;

  /** Add item to end of list. O(1)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-append)
   */
  append(item: T): void {
    // To append to a list that is not an ordered set is to add the given item to the end of the list.
    this.list.push(item);
  }

  /** Add {@linkcode other} items to end of list. O(n)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-extend)
   */
  extend(other: this): void {
    // To extend a list A with a list B, for each item of B, append item to A.
    for (const item of other) this.append(item);
  }

  /** Add item to beginning of list. O(1)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-prepend)
   */
  prepend(item: T): void {
    // To prepend to a list that is not an ordered set is to add the given item to the beginning of the list.
    this.list.unshift(item);
  }

  /** Add item between {@linkcode index} - 1 and {@linkcode index}. O(1)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-insert)
   */
  insert(index: number, item: T): boolean {
    if (!this.isInRange(index)) return false;

    // To insert an item into a list before an index is to add the given item to the list between the given index − 1 and the given index. If the given index is 0, then prepend the given item to the list.
    if (!index) this.prepend(item);
    else this.list.splice(index, 0, item);
    return true;
  }

  /** Remove all items that match the condition. O(n)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-remove)
   */
  remove(
    predicate: (item: T, index: number, list: this) => boolean,
  ): Entry<T>[] {
    const indexed = enumerate(this.list);
    const reducer = (acc: Entry<T>[], [index, item]: Entry<T>): Entry<T>[] => {
      if (predicate(item, index, this)) return acc.concat([[index, item]]);

      return acc;
    };
    const matched = reduce(indexed, reducer, [] as Entry<T>[]);

    // To remove zero or more items from a list is to remove all items from the list that match a given condition, or do nothing if none do.
    matched.forEach(([index], i) => {
      const targetIndex = index - i;

      this.list.splice(targetIndex, 1);
    });

    return matched;
  }

  /** To be empty list. O(n)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-empty)
   */
  empty(): void {
    /** To empty a list is to remove all of its items. */
    this.remove(T);
  }

  /** Whether the {@linkcode item} included in list or not. O(n)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-contain)
   */
  contains(item: T): boolean {
    // A list contains an item if it appears in the list. We can also denote this by saying that, for a list list and an index index, "list[index] exists".
    for (const value of this.list) if (item === value) return true;

    return false;
  }

  /** Return shallow copied list. O(n)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-clone)
   */
  clone(): this {
    // create a new list clone, of the same designation,
    const clone = this.create();

    // and, for each item of list, append item to clone, so that clone contains the same items, in the same order as list.
    for (const item of this) clone.append(item);

    return clone;
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-iterate)
   */
  [Symbol.iterator](): IterableIterator<T> {
    // To iterate over a list, performing a set of steps on each item in order, use phrasing of the form "For each item of list", and then operate on item in the subsequent prose.
    return this.list[Symbol.iterator]();
  }

  /** Return list size. O(1)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-size)
   */
  get size(): number {
    // A list’s size is the number of items the list contains.
    return this.list.length;
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-is-empty)
   */
  get isEmpty(): boolean {
    // if its size is zero.
    return !this.size;
  }

  /** Whether the {@linkcode index} is in range or not. O(1)
   */
  private isInRange(index: number): boolean {
    return 0 <= index && index < this.size;
  }
}

function T(): true {
  return true;
}
