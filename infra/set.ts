import { List } from "./list.ts";

/** An ordered set is a list with the additional semantic that it must not contain the same item twice.
 *
 * [Infra Living Standard](https://infra.spec.whatwg.org/#ordered-set)
 */
export class OrderedSet<T> extends List<T> {
  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-append)
   */
  override append(item: T): void {
    // If the set contains the given item, then do nothing; otherwise, perform the normal list append operation.
    if (!super.contains(item)) super.append(item);
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-prepend)
   */
  override prepend(item: T): void {
    // If the set contains the given item, then do nothing; otherwise, perform the normal list prepend operation.
    if (!super.contains(item)) super.prepend(item);
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-replace)
   */
  override replace(): void {
    // If set contains item or replacement, then replace the first instance of either with replacement and remove all other instances.
    throw new Error("unimplemented");
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
