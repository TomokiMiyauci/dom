import { OrderedSet } from "../infra/set.ts";

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

function* enumerate<T>(
  iterable: Iterable<T>,
  start = 0,
): Iterable<[index: number, item: T]> {
  for (const item of iterable) {
    yield [start++, item];
  }
}

type Constructor = new (...args: any[]) => {};

export function Tree<T extends Constructor>(Ctor: T) {
  return class Treeable extends Ctor {
    _parent: Tree<T> | null = null;

    _children: OrderedSet<Tree<T>> = new OrderedSet();

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
