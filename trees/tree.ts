import { OrderedSet } from "../infra/set.ts";
import { type Constructor, enumerate } from "../utils.ts";

function isChild(source: Tree, target: Tree): boolean {
  return source.parent === target;
}
export function isDescendant(source: Tree, target: Tree): boolean {
  if (isChild(source, target)) return true;

  for (const item of target.children) {
    return isDescendant(source, item);
  }

  return false;
}

export function isSibling(source: Tree, target: Tree) {
  return source.parent !== null && source.parent === target.parent;
}

export function previousSibling(tree: Tree): Tree | null {
  if (!tree.parent) return null;

  let prev: Tree | null = null;
  for (const item of tree.parent.children) {
    if (tree === item) return prev;

    prev = item;
  }

  return null;
}

export function nextSibling(tree: Tree): Tree | null {
  if (!tree.parent) return null;

  let hit = false;
  for (const item of tree.parent.children) {
    if (tree === item) {
      hit = true;
      continue;
    }

    if (hit) return item;
  }

  return null;
}

export function Treeable<T extends Constructor>(Ctor: T) {
  return class extends Ctor implements Tree {
    _parent: Tree<T> | null = null;

    #children: OrderedSet<Tree<T>> = new OrderedSet();

    get _children(): OrderedSet<Tree<T>> {
      return this.#children;
    }

    get _firstChild(): this | null {
      return this._children[0] ?? null;
    }

    get _lastChild(): this | null {
      return this._children[this._children.size - 1] ?? null;
    }

    get _previousSibling() {
      return;
    }

    get _nextSibling() {
      return;
    }

    get _index(): number {
      if (this._children) {
        for (const [index, item] of enumerate(this._children)) {
          if (this === item) return index;
        }
      }

      return 0;
    }
  };
}

export interface Tree {
  _parent: Tree<T> | null;
  _children: OrderedSet<Tree<T>>;
}

export function getRoot(tree: Tree): Tree {
  if (tree._parent === null) return tree;

  return getRoot(tree._parent);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-order
 */
export function* orderTree<T extends Tree>(tree: T): IterableIterator<T> {
  yield tree;

  for (const child of tree._children) {
    yield* orderTree(child);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-descendant
 */
export function* descendant<T extends Tree>(tree: T): IterableIterator<T> {
  for (const child of tree._children) yield* orderTree(child);
}
