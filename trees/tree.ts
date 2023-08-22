import { OrderedSet } from "../infra/set.ts";
import { type Constructor, enumerate, some } from "../deps.ts";

export function hasParent<T>(
  tree: { _parent: T | null },
): tree is { _parent: T } {
  return tree._parent !== null;
}

export function isSibling(a: Tree, b: Tree): boolean {
  return a._parent !== null && a._parent === b._parent;
}

export function previousSibling<T extends Tree>(tree: T): T | null {
  if (!tree._parent) return null;

  let prev: T | null = null;
  for (const item of tree._parent._children) {
    if (tree === item) return prev;

    prev = item as T;
  }

  return null;
}

export function nextSibling<T extends Tree>(tree: T): T | null {
  if (!tree._parent) return null;

  let hit = false;
  for (const item of tree._parent._children) {
    if (tree === item) {
      hit = true;
      continue;
    }

    if (hit) return item as T;
  }

  return null;
}

export function Treeable<T extends Constructor>(Ctor: T) {
  abstract class Mixin extends Ctor implements Tree {
    _parent: this | null = null;

    #children: OrderedSet<Tree> = new OrderedSet();

    get _children(): OrderedSet<Tree> {
      return this.#children;
    }

    get _firstChild(): Tree | null {
      return this._children[0] ?? null;
    }

    get _lastChild(): Tree | null {
      return this._children[this._children.size - 1] ?? null;
    }

    get _previousSibling(): Tree | null {
      return previousSibling(this);
    }

    get _nextSibling(): Tree | null {
      return nextSibling(this);
    }

    get _index(): number {
      if (this._children) {
        for (const [index, item] of enumerate(this._children)) {
          if (this === item) return index;
        }
      }

      return 0;
    }
  }

  return Mixin;
}

export interface Tree extends TreeAlgorithm {
  _parent: Tree | null;
  _children: OrderedSet<Tree>;
}

interface TreeAlgorithm {
  get _firstChild(): Tree | null;
  get _lastChild(): Tree | null;
  get _previousSibling(): Tree | null;
  get _nextSibling(): Tree | null;
  get _index(): number;
}

export function getRoot<T extends Tree>(tree: T): T {
  if (tree._parent === null) return tree;

  return getRoot<T>(tree._parent as T);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-order
 */
export function* orderTree<T extends Tree>(tree: T): IterableIterator<T> {
  yield tree;
  yield* descendant(tree);
}

export function* orderTreeChildren<T extends Tree>(
  iterable: Iterable<T>,
): IterableIterator<T> {
  for (const child of iterable) yield* orderTree(child);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-descendant
 */
export function* descendant<T extends Tree>(tree: T): IterableIterator<T> {
  for (const child of tree._children) yield* orderTree<T>(child as T);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor
 */
export function isInclusiveAncestorOf(target: Tree, of: Tree): boolean {
  return target === of || isAncestorOf(target, of);
}

export function isAncestorOf(target: Tree, of: Tree): boolean {
  return isDescendantOf(of, target);
}

export function isDescendantOf(target: Tree, of: Tree): boolean {
  return isChildOf(target, of) ||
    some(descendant(of), (descendant) => isChildOf(target, descendant));
}

export function isChildOf(target: Tree, of: Tree): boolean {
  return target._parent === of;
}

export function isSameTree(left: Tree, right: Tree): boolean {
  return left === right || getRoot(left) === getRoot(right);
}
