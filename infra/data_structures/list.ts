import { ListCore } from "./common.ts";

/** A list is a specification type consisting of a finite ordered sequence of items.
 *
 * [Infra Living Standard](https://infra.spec.whatwg.org/#list)
 */
export class List<T> extends ListCore<T> {
  /** Replace with {@linkcode item} if condition matches.
   *
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

  protected override create(): this {
    return Object.assign(new List());
  }
}
