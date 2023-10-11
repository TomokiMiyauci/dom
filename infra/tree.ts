import { insert, last, len, some, takewhile } from "../deps.ts";
import { Entry } from "../_internals/infra/data_structures/common.ts";
import { OrderedSet } from "../_internals/infra/data_structures/set.ts";
import { Steps } from "./applicable.ts";

class TrappedOrderedSet<T> extends OrderedSet<T> {
  insertionSteps: Steps<[T]> = new Steps();
  deletionSteps: Steps<[T]> = new Steps();

  override append(item: T): void {
    super.append(item);
    this.insertionSteps.run(item);
  }

  override prepend(item: T): void {
    super.prepend(item);
    this.insertionSteps.run(item);
  }

  override insert(index: number, item: T): boolean {
    const result = super.insert(index, item);

    if (result) this.insertionSteps.run(item);

    return result;
  }

  override remove(
    predicate: (item: T, index: number, list: this) => boolean,
  ): Entry<T>[] {
    const result = super.remove(predicate);

    result.forEach(([_, item]) => {
      this.deletionSteps.run(item);
    });

    return result;
  }
}

class TreeNode<Parent extends object = object, Child extends object = object> {
  parent: Parent | null = null;

  children: TrappedOrderedSet<Child> = new TrappedOrderedSet();
}

export class Tree<
  T extends object = object,
  Parent extends T = T,
  Child extends T = T,
> {
  #map: WeakMap<object, TreeNode<Parent, Child>> = new WeakMap();

  protected ref(object: T): TreeNode<Parent, Child> {
    return insert(this.#map, object, () => {
      const tree = new TreeNode<Parent, Child>();

      tree.children.insertionSteps.define((child) => {
        this.ref(child).parent = object as Parent;
      });

      tree.children.deletionSteps.define((child) => {
        this.ref(child).parent = null;
      });

      return tree;
    });
  }

  /** Return parent of {@linkcode node}. O(1)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-parent)
   */
  parent(node: T): Parent | null {
    return this.ref(node).parent;
  }

  /** Return children of {@linkcode node}. O(1)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-child)
   */
  children(node: T): OrderedSet<Child> {
    return this.ref(node).children;
  }

  /** Return first child of {@linkcode node}. O(1)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-first-child)
   */
  firstChild(node: T): Child | null {
    return this.children(node)[0] ?? null;
  }

  /** Return last child of {@linkcode node}. O(1)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-last-child)
   */
  lastChild(node: T): Child | null {
    const children = this.children(node);

    return children[children.size - 1] ?? null;
  }

  /** Return root of {@linkcode node}. O(n)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-root)
   */
  root(node: T): T {
    const ancestors = this.ancestors(node);

    return last(ancestors) ?? node;
  }

  /** Return previous sibling of {@linkcode node}.
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-previous-sibling)
   */
  previousSibling(node: T): Child | null {
    const parent = this.parent(node);

    if (!parent) return null;

    const index = this.index(node) - 1;
    return this.children(parent)[index] ?? null;
  }

  /** Return next sibling of {@linkcode node}.
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-next-sibling)
   */
  nextSibling(node: T): Child | null {
    const parent = this.parent(node);

    if (!parent) return null;

    const index = this.index(node) + 1;
    return this.children(parent)[index] ?? null;
  }

  /** Return preceding node of {@linkcode node}. */
  precede(node: T): T | null {
    const previousSibling = this.previousSibling(node);

    if (previousSibling) return this.#prev(previousSibling);

    return this.parent(node);
  }

  /** Yield preceding nodes of {@linkcode node}. */
  *precedes(node: T): IterableIterator<T> {
    const precede = this.precede(node);

    if (precede) {
      yield precede;
      yield* this.precedes(precede);
    }
  }

  /** Return following node of {@linkcode node}. */
  follow(node: T): T | null {
    const firstChild = this.firstChild(node);

    if (firstChild) return firstChild;

    const nextSibling = this.nextSibling(node);

    if (nextSibling) return nextSibling;

    const parent = this.parent(node);

    return parent ? this.nextDescendant(parent) : null;
  }

  /** Yield following nodes of {@linkcode node}. */
  *follows(node: T): IterableIterator<T> {
    const follow = this.follow(node);

    if (follow) {
      yield follow;
      yield* this.follows(follow);
    }
  }

  #prev(node: T): T {
    const lastChild = this.lastChild(node);

    return lastChild ? this.#prev(lastChild) : node;
  }

  /** Return index of {@linkcode node}.
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-index)
   */
  index(node: T): number {
    const parent = this.parent(node);

    if (!parent) return 0;

    const parentChildren = this.children(parent);

    return len(takewhile(parentChildren, (child) => child !== node));
  }

  /** Yield ancestors of {@linkcode node} in order of proximity. O(n) */
  *ancestors(node: T): IterableIterator<Parent> {
    const parent = this.parent(node);

    if (parent) {
      yield parent;
      yield* this.ancestors(parent);
    }
  }

  /** Yield inclusive ancestors of {@linkcode node} in order of proximity. O(n) */
  *inclusiveAncestors(node: T): IterableIterator<T> {
    yield node;
    yield* this.ancestors(node);
  }

  /** Yield descendant of {@linkcode node} in depth first order. O(n) */
  *descendants(node: T): IterableIterator<Child> {
    for (const child of this.children(node)) {
      yield child;
      yield* this.descendants(child);
    }
  }

  /** Yield inclusive descendants of {@linkcode node} in depth first order. O(n) */
  *inclusiveDescendants(node: T): IterableIterator<T> {
    yield node;
    yield* this.descendants(node);
  }

  /** Yield previous siblings of {@linkcode node} in order of proximity. O(n) */
  *precedeSiblings(node: T): IterableIterator<Child> {
    const previousSibling = this.previousSibling(node);

    if (previousSibling) {
      yield previousSibling;
      yield* this.precedeSiblings(previousSibling);
    }
  }

  /** Yield following siblings of {@linkcode node} in tree order. O(n) */
  *followSiblings(node: T): IterableIterator<Child> {
    const nextSibling = this.nextSibling(node);

    if (nextSibling) {
      yield nextSibling;
      yield* this.followSiblings(nextSibling);
    }
  }

  /** Return next {@linkcode node} descendant. */
  nextDescendant(node: T): T | null {
    const nextSibling = this.nextSibling(node);

    if (nextSibling) return nextSibling;

    const parent = this.parent(node);

    return parent ? this.nextDescendant(parent) : null;
  }

  /** Yield siblings of {@linkcode node} in tree order. O(n) */
  *siblings(node: T): IterableIterator<Child> {
    for (const sibling of this.inclusiveSiblings(node)) {
      if (node !== sibling) yield sibling;
    }
  }

  /** Yield inclusive siblings of {@linkcode node} in tree order. O(n) */
  *inclusiveSiblings(node: T): IterableIterator<Child> {
    const parent = this.parent(node);

    if (parent) yield* this.children(parent);
  }

  /** Whether the {@linkcode target} is child of {@linkcode of} or not. O(1)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-child)
   */
  isChild(target: T, of: unknown): boolean {
    return this.parent(target) === of;
  }

  /** Whether the {@linkcode target} is descendant of {@linkcode of} or not. O(n)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-descendant)
   */
  isDescendant(target: T, of: T): boolean {
    // if either A is a child of B or A is a child of an object C that is a descendant of B.
    return this.isChild(target, of) ||
      some(this.children(of), (child) => this.isDescendant(target, child));
  }

  /** Whether the {@linkcode target} is inclusive descendant of {@linkcode of} or not. O(n)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-inclusive-descendant)
   */
  isInclusiveDescendant(target: T, of: T): boolean {
    return target === of || this.isDescendant(target, of);
  }

  /** Whether the {@linkcode target} is ancestor of {@linkcode of} or not. O(n)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-ancestor)
   */
  isAncestor(target: T, of: T): boolean {
    return this.isDescendant(of, target);
  }

  /** Whether the {@linkcode target} is inclusive ancestor of {@linkcode of} or not. O(n)
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor)
   */
  isInclusiveAncestor(target: T, of: T): boolean {
    return target === of || this.isAncestor(target, of);
  }

  /** Whether the {@linkcode target} is preceding of {@linkcode of} or not.
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-preceding)
   */
  isPreceding(target: T, of: T): boolean {
    // A and B are in the same tree and A comes before B in tree order.
    if (target === of) return false;
    if (!this.isSameTree(target, of)) return false;

    return some(this.precedes(of), (tree) => tree === target);
  }

  /** Whether the {@linkcode target} is following of {@linkcode of} or not.
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-tree-following)
   */
  isFollowing(target: T, of: T): boolean {
    // A and B are in the same tree and A comes after B in tree order.
    if (target === of) return false;
    if (!this.isSameTree(target, of)) return false;

    return some(this.follows(of), (tree) => tree === target);
  }

  isSameTree(left: T, right: T): boolean {
    return left === right || this.root(left) === this.root(right);
  }
}
