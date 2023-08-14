import { ListCore } from "./list.ts";

/** An ordered set is a list with the additional semantic that it must not contain the same item twice.
 *
 * [Infra Living Standard](https://infra.spec.whatwg.org/#ordered-set)
 */
export class OrderedSet<T> extends ListCore<T> {
  #set: Set<T>;

  constructor(iterable?: Iterable<T>) {
    const set = new Set(iterable);
    super(set);

    this.#set = set;
  }
  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-append)
   */
  override append(item: T): void {
    // If the set contains the given item, then do nothing; otherwise, perform the normal list append operation.
    if (!this.contains(item)) {
      super.append(item);
      this.#set.add(item);
    }
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-prepend)
   */
  override prepend(item: T): void {
    // If the set contains the given item, then do nothing; otherwise, perform the normal list prepend operation.
    if (!this.contains(item)) {
      super.prepend(item);
      this.#set.add(item);
    }
  }

  override contains(item: T): boolean {
    return this.#set.has(item);
  }

  protected override create(): this {
    return Object.assign(new OrderedSet());
  }

  /**
   * [Infra Living Standard](https://infra.spec.whatwg.org/#set-replace)
   */
  replace(item: T, replacement: T): void {
    const newList: T[] = [];
    let step: Step = Step.Detecting;

    for (const exist of this.list) {
      switch (step) {
        case Step.Detecting: {
          if (exist === item) {
            step = Step.MatchingLeft;
            newList.push(replacement);
            continue;
          } else if (exist === replacement) {
            step = Step.MatchingRight;
            newList.push(replacement);
            continue;
          }

          newList.push(exist);

          continue;
        }

        case Step.MatchingLeft: {
          if (replacement === exist) continue;

          newList.push(exist);

          continue;
        }

        case Step.MatchingRight: {
          if (exist === item) continue;

          newList.push(exist);

          continue;
        }
      }
    }

    this.list = newList;
  }
}

const enum Step {
  Detecting,
  MatchingLeft,
  MatchingRight,
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
