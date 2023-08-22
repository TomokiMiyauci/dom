import { OrderedSet } from "../infra/data_structures/set.ts";
import { enumerate, some } from "../deps.ts";

export function hasParent<T>(
  tree: { _parent: T | null },
): tree is { _parent: T } {
  return tree._parent !== null;
}

export function isSibling(a: Tree, b: Tree): boolean {
  return a._parent !== null && a._parent === b._parent;
}

export interface TreeNode {
  _parent: TreeNode | null;
  _children: OrderedSet<TreeNode>;
}

export interface Tree<
  P extends TreeNode = TreeNode,
  C extends TreeNode = TreeNode,
> extends TreeNode {
  _parent: P | null;
  _children: OrderedSet<C>;
}

export function getFirstChild<C extends Tree>(
  tree: Tree<TreeNode, C>,
): C | null {
  return tree._children[0] ?? null;
}

export function getLastChild<C extends Tree>(
  tree: Tree<Tree, C>,
): C | null {
  return tree._children[tree._children.size - 1] ?? null;
}

export function getPreviousSibling<C extends Tree>(
  tree: Tree<Tree, C>,
): C | null {
  if (tree._parent) {
    const index = [...tree._parent._children].indexOf(
      tree as unknown as Tree,
    );
    if (index > 0) return (tree._parent._children[index - 1] as C) ?? null;
  }

  return null;
}

export function getNextSibling<C extends Tree>(
  tree: Tree<Tree, C>,
): C | null {
  if (tree._parent) {
    const index = [...tree._parent._children].indexOf(
      tree as unknown as Tree,
    );
    if (index > -1) return (tree._parent._children[index + 1] as C) ?? null;
  }

  return null;
}

export function getIndex(tree: Tree): number {
  if (tree._children) {
    for (const [index, item] of enumerate(tree._children)) {
      if (tree === item) return index;
    }
  }

  return 0;
}

export function getRoot<T extends Tree>(tree: T): T {
  if (tree._parent === null) return tree;

  return getRoot(tree._parent as T);
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
