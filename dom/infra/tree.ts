import { insert, last, len, some, takewhile } from "../../deps.ts";
import { Entry } from "../../infra/data_structures/common.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";
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

  parent(node: T): Parent | null {
    return this.ref(node).parent;
  }

  children(node: T): OrderedSet<Child> {
    return this.ref(node).children;
  }

  firstChild(node: T): Child | null {
    return this.children(node)[0] ?? null;
  }

  lastChild(node: T): Child | null {
    const children = this.children(node);

    return children[children.size - 1] ?? null;
  }

  root(node: T): T {
    const ancestors = this.ancestors(node);

    return last(ancestors) ?? node;
  }

  previousSibling(node: T): Child | null {
    const parent = this.parent(node);

    if (!parent) return null;

    const index = this.index(node) - 1;
    return this.children(parent)[index] ?? null;
  }

  nextSibling(node: T): Child | null {
    const parent = this.parent(node);

    if (!parent) return null;

    const index = this.index(node) + 1;
    return this.children(parent)[index] ?? null;
  }

  precede(node: T): T | null {
    const previousSibling = this.previousSibling(node);

    if (previousSibling) return this.#prev(previousSibling);

    return this.parent(node);
  }

  *precedes(node: T): IterableIterator<T> {
    const precede = this.precede(node);

    if (precede) {
      yield precede;
      yield* this.precedes(precede);
    }
  }

  follow(node: T): T | null {
    const firstChild = this.firstChild(node);

    if (firstChild) return firstChild;

    const nextSibling = this.nextSibling(node);

    if (nextSibling) return nextSibling;

    const parent = this.parent(node);

    return parent ? this.#nextNodeDescendant(parent) : null;
  }

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

  index(node: T): number {
    const parent = this.parent(node);

    if (!parent) return 0;

    const parentChildren = this.children(parent);

    return len(takewhile(parentChildren, (child) => child !== node));
  }

  *ancestors(node: T): IterableIterator<Parent> {
    const parent = this.parent(node);

    if (parent) {
      yield parent;
      yield* this.ancestors(parent);
    }
  }

  *inclusiveAncestors(node: T): IterableIterator<T> {
    yield node;
    yield* this.ancestors(node);
  }

  *descendants(node: T): IterableIterator<Child> {
    for (const child of this.children(node)) {
      yield child;
      yield* this.descendants(child);
    }
  }

  /** Yield all inclusive descendants of {@linkcode node} with depth first order. O(n) */
  *inclusiveDescendants(node: T): IterableIterator<T> {
    yield node;
    yield* this.descendants(node);
  }

  *precedeSiblings(node: T): IterableIterator<Child> {
    const previousSibling = this.previousSibling(node);

    if (previousSibling) {
      yield previousSibling;
      yield* this.precedeSiblings(previousSibling);
    }
  }

  *followSiblings(node: T): IterableIterator<Child> {
    const nextSibling = this.nextSibling(node);

    if (nextSibling) {
      yield nextSibling;
      yield* this.followSiblings(nextSibling);
    }
  }

  #nextNodeDescendant(node: T): T | null {
    const nextSibling = this.nextSibling(node);

    if (nextSibling) return nextSibling;

    const parent = this.parent(node);

    return parent ? this.#nextNodeDescendant(parent) : null;
  }

  *siblings(node: T): IterableIterator<Child> {
    for (const sibling of this.inclusiveSiblings(node)) {
      if (node !== sibling) yield sibling;
    }
  }

  *inclusiveSiblings(node: T): IterableIterator<Child> {
    const parent = this.parent(node);

    if (parent) yield* this.children(parent);
  }

  isChild(target: T, of: unknown): boolean {
    return this.parent(target) === of;
  }

  isFollow(target: T, of: T): boolean {
    // A and B are in the same tree and A comes after B in tree order.
    if (target === of) return false;
    if (!this.isSameTree(target, of)) return false;

    return some(this.follows(of), (tree) => tree === target);
  }

  isSameTree(left: T, right: T): boolean {
    return left === right || this.root(left) === this.root(right);
  }

  isAncestor(target: T, of: T): boolean {
    return this.isDescendant(of, target);
  }

  isDescendant(target: T, of: T): boolean {
    return this.isChild(target, of) ||
      some(
        this.descendants(of),
        (descendant) => this.isChild(target, descendant),
      );
  }

  isInclusiveAncestor(target: T, of: T): boolean {
    return target === of || this.isAncestor(target, of);
  }

  isInclusiveDescendant(target: T, of: T): boolean {
    return target === of || this.isDescendant(target, of);
  }

  isPrecede(target: T, of: T): boolean {
    // A and B are in the same tree and A comes before B in tree order.
    if (target === of) return false;
    if (!this.isSameTree(target, of)) return false;

    return some(this.precedes(of), (tree) => tree === target);
  }
}
