/** A list is a specification type consisting of a finite ordered sequence of items.
 *
 * [Infra Living Standard](https://infra.spec.whatwg.org/#list)
 */
export class List<T> {
  readonly [index: number]: T;

  private list: T[] = [];

  constructor(iterable?: Iterable<T>) {
    if (iterable) for (const item of iterable) this.list.push(item);

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
  insert(index: number, item: T): void {
    if (this.isInRange(index)) {
      // To insert an item into a list before an index is to add the given item to the list between the given index − 1 and the given index. If the given index is 0, then prepend the given item to the list.
      this.list.splice(index, 0, item);
    }
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-replace)
   */
  replace(item: T, predicate: (item: T) => boolean): void {
    // To replace within a list that is not an ordered set is to replace all items from the list that match a given condition with the given item, or do nothing if none do.
    for (const [index, insertedItem] of this.list.entries()) {
      if (predicate(insertedItem)) {
        this.list[index] = item;
      }
    }
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#list-remove)
   */
  remove(predicate: (item: T) => boolean): void {
    // To remove zero or more items from a list is to remove all items from the list that match a given condition, or do nothing if none do.
    this.list = this.list.filter((value) => !predicate(value));
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
    for (const value of this.list) if (item === value) return true;

    return false;
  }

  /**
   * @see https://infra.spec.whatwg.org/#list-clone
   */
  clone(): this {
    // create a new list clone, of the same designation,
    const clone = new (this.constructor as typeof List<T>)() as this;

    // and, for each item of list, append item to clone, so that clone contains the same items, in the same order as list.
    for (const item of this) clone.append(item);

    return clone;
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

  /** Whether the {@linkcode index} is in range or not.
   */
  private isInRange(index: number): boolean {
    return 0 <= index && index < this.size;
  }
}
