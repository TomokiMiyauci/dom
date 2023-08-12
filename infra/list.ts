function eq(left: unknown, right: unknown): boolean {
  return left === right;
}

/** A list is a specification type consisting of a finite ordered sequence of items.
 *
 * [Infra Living Standard](https://infra.spec.whatwg.org/#list)
 */
export class List<T> {
  readonly [index: number]: T;

  private equals: (left: T, right: T) => boolean;
  private list: T[] = [];

  constructor() {
    this.equals = eq;

    return new Proxy(this, {
      get: (target, prop) => {
        if (typeof prop === "string") {
          const indexLike = Number(prop);

          if (Number.isInteger(indexLike)) return target.list[indexLike];
        }

        return target[prop as never];
      },
    });
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-append)
   */
  append(item: T): void {
    // To append to a list that is not an ordered set is to add the given item to the end of the list.
    this.list.push(item);
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-extend)
   */
  extend(other: List<T>): void {
    // To extend a list A with a list B, for each item of B, append item to A.
    for (const item of other) this.append(item);
  }

  // extend(others: List<T>): void;

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-prepend)
   */
  prepend(item: T): void {
    // To prepend to a list that is not an ordered set is to add the given item to the beginning of the list.
    this.list.unshift(item);
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-insert)
   */
  insert(item: T, index: number): void {
    // To insert an item into a list before an index is to add the given item to the list between the given index − 1 and the given index. If the given index is 0, then prepend the given item to the list.
    this.list.splice(index, 0, item);
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-replace)
   */
  replace(item: T, replacement: T): void {
    // To replace within a list that is not an ordered set is to replace all items from the list that match a given condition with the given item, or do nothing if none do.
    for (const [index, insertedItem] of this.list.entries()) {
      if (this.equals(insertedItem, item)) {
        this.list[index] = replacement;
      }
    }
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-remove)
   */
  remove(item: T): void {
    // To remove zero or more items from a list is to remove all items from the list that match a given condition, or do nothing if none do.
    this.list = this.list.filter((value) => this.equals(value, item));
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-empty)
   */
  empty(): void {
    /** To empty a list is to remove all of its items. */
    this.list.length = 0;
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-contain)
   */
  contains(item: T): boolean {
    // A list contains an item if it appears in the list. We can also denote this by saying that, for a list list and an index index, "list[index] exists".
    for (const value of this.list) {
      if (this.equals(value, item)) return true;
    }

    return false;
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-iterate)
   */
  *[Symbol.iterator](): IterableIterator<T> {
    // To iterate over a list, performing a set of steps on each item in order, use phrasing of the form "For each item of list", and then operate on item in the subsequent prose.
    yield* this.list;
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-size)
   */
  get size(): number {
    // A list’s size is the number of items the list contains.
    return this.list.length;
  }
}
