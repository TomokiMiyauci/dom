/** Reference implementation of OrderSet.
 * The biggest difference with Build-in `Set` is that they can be index referenced.
 * @module
 */

import { Entry, ListCore } from "./common.ts";

/** An ordered set is a list with the additional semantic that it must not contain the same item twice.
 *
 * [Infra Living Standard](https://infra.spec.whatwg.org/#ordered-set)
 */
export class OrderedSet<T> extends ListCore<T, OrderedSet<T>> {
  #set: Set<T>;

  constructor(iterable?: Iterable<T>) {
    const set = new Set(iterable);
    super(set);

    this.#set = set;
  }

  /** Add item to end of set if the {@linkcode item} does not exist. O(1)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-append)
   */
  override append(item: T): void {
    // If the set contains the given item, then do nothing; otherwise, perform the normal list append operation.
    if (!this.contains(item)) {
      super.append(item);
      this.#set.add(item);
    }
  }

  /** Add item to begging of set if the {@linkcode item} does not exist. O(1)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-prepend)
   */
  override prepend(item: T): void {
    // If the set contains the given item, then do nothing; otherwise, perform the normal list prepend operation.
    if (!this.contains(item)) {
      super.prepend(item);
      this.#set.add(item);
    }
  }

  /** Whether the {@linkcode item} does exist or not. O(1)
   */
  override contains(item: T): boolean {
    return this.#set.has(item);
  }

  override insert(index: number, item: T): boolean {
    if (!this.contains(item)) {
      const result = super.insert(index, item);

      if (result) this.#set.add(item);
      return result;
    }

    return false;
  }

  protected override create(): OrderedSet<T> {
    return new OrderedSet();
  }

  /** Replace {@linkcode item} to {@linkcode replacement}. O(n)
   *
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-replace)
   */
  replace(item: T, replacement: T): void {
    if (item === replacement) return;

    const hasLeft = this.contains(item);

    if (!hasLeft) return;

    const hasRight = this.contains(replacement);

    this.#set.delete(item);
    this.#set.add(replacement);

    const leftIndex = this.list.findIndex((value) => value === item);

    if (!hasRight) {
      this.list[leftIndex] = replacement;
      return;
    }

    const rightIndex = this.list.findIndex((value) => value === replacement);

    if (leftIndex < rightIndex) {
      this.list.splice(rightIndex, 1);
      this.list[leftIndex] = replacement;
    } else this.list.splice(leftIndex, 1);
  }

  override remove(
    predicate: (item: T, index: number, list: this) => boolean,
  ): Entry<T>[] {
    const entries = super.remove(predicate);

    entries.forEach(([_, item]) => this.#set.delete(item));

    return entries;
  }
}

export function intersection<T>(
  left: OrderedSet<T>,
  right: OrderedSet<T>,
): OrderedSet<T> {
  const set = new OrderedSet<T>();

  for (const item of left) {
    if (right.contains(item)) set.append(item);
  }

  return set;
}
