import { OrderedSet } from "../infra/data_structures/set.ts";
import {
  dropwhile,
  enumerate,
  first,
  islice,
  last,
  some,
  takewhile,
} from "../deps.ts";

export function hasParent<T>(
  tree: { _parent: T | null },
): tree is { _parent: T } {
  return tree._parent !== null;
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

export function getPreviousSibling<C extends TreeNode>(
  tree: Tree<Tree<TreeNode, C>>,
): C | null {
  return last(getPrecedingSiblings(tree)) ?? null;
}

export function getNextSibling<C extends Tree>(
  tree: Tree<Tree<TreeNode, C>>,
): C | null {
  return first(getFollowingSiblings(tree)) ?? null;
}

export function getIndex(tree: Tree): number {
  if (tree._children) {
    for (const [index, item] of enumerate(tree._children)) {
      if (tree === item) return index;
    }
  }

  return 0;
}

export function getSiblings<C extends TreeNode>(
  tree: Tree<Tree<TreeNode, C>>,
): OrderedSet<C> {
  if (!tree._parent) return new OrderedSet();

  return tree._parent._children;
}

export function getPrecedingSiblings<C extends TreeNode>(
  tree: Tree<Tree<Tree, C>>,
): Iterable<C> {
  const siblings = getSiblings(tree);

  return takewhile(siblings, (value) => value !== tree);
}

export function getFollowingSiblings<C extends TreeNode>(
  tree: Tree<Tree<Tree, C>>,
): Iterable<C> {
  const siblings = getSiblings(tree);
  const inclusiveNextSiblings = dropwhile(siblings, (value) => value !== tree);

  return islice(inclusiveNextSiblings, 1, Infinity);
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

export function isInclusiveDescendantOf(target: Tree, of: Tree): boolean {
  return target === of || isDescendantOf(target, of);
}

export function isChildOf(target: Tree, of: Tree): boolean {
  return target._parent === of;
}

export function isSameTree(left: Tree, right: Tree): boolean {
  return left === right || getRoot(left) === getRoot(right);
}

export function isSiblingOf(target: Tree, of: Tree): boolean {
  return !!target._parent && target._parent === of._parent;
}

export function isInclusiveSiblingOf(target: Tree, of: Tree): boolean {
  return target === of || isSiblingOf(target, of);
}

export function getPrecedings<T extends Tree>(tree: T): Iterable<T> {
  const root = getRoot(tree);

  return takewhile(orderTree(root), (value) => value !== tree);
}

export function getFollows<T extends Tree>(tree: T): Iterable<T> {
  const root = getRoot(tree);
  const inclusiveFollows = dropwhile(
    orderTree(root),
    (value) => value !== tree,
  );

  return islice(inclusiveFollows, 1, Infinity);
}
