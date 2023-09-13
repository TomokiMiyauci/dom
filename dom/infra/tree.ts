import { insert, last, some } from "../../deps.ts";
import { tree } from "../../internal.ts";

export class Tree<
  T extends object = object,
  Parent extends T = T,
  Child extends T = T,
> {
  #map: WeakMap<T, TreeNode<T, Parent, Child>> = new WeakMap();

  #ref(object: T): TreeNode<T, Parent, Child> {
    const node = insert(this.#map, object, () => new TreeNode());

    return node;
  }

  /** Return first child of {@linkcode node}. O(1) */
  firstChild(node: T): Child | null {
    return this.#ref(node).firstChild;
  }

  /** Return last child of {@linkcode node}. O(1) */
  lastChild(node: T): Child | null {
    return this.#ref(node).lastChild;
  }

  /** Return previous sibling of {@linkcode node}. O(1) */
  previousSibling(node: T): Child | null {
    return this.#ref(node).previousSibling;
  }

  /** Return next sibling of {@linkcode node}. O(1) */
  nextSibling(node: T): Child | null {
    return this.#ref(node).nextSibling;
  }

  /** Return parent of {@linkcode node}. O(1) */
  parent(node: T): Parent | null {
    return this.#ref(node).parent;
  }

  /** Return root of {@linkcode node}. O(n) */
  root(node: T): T {
    const ancestors = this.ancestors(node);

    return last(ancestors) ?? node;
  }

  insertAfter(referenceNode: T, newObject: Child): Child {
    const newNode = this.#ref(newObject);

    assertNotParticipate(newNode, "newObject already present in Tree");

    const refTree = this.#ref(referenceNode);
    const nextNode = refTree.nextSibling
      ? this.#ref(refTree.nextSibling)
      : null;
    const parentNode = refTree.parent ? this.#ref(refTree.parent) : null;

    newNode.parent = refTree.parent;
    newNode.previousSibling = referenceNode as any;
    newNode.nextSibling = refTree.nextSibling;
    refTree.nextSibling = newObject;

    if (nextNode) nextNode.previousSibling = newObject;

    if (parentNode && parentNode.lastChild === referenceNode) {
      parentNode.lastChild = newObject;
    }

    return newObject;
  }

  insertBefore(referenceNode: T, newObject: Child): Child {
    const newNode = this.#ref(newObject);

    assertNotParticipate(newNode, "newObject already present in Tree");

    const refTree = this.#ref(referenceNode);
    const prevNode = refTree.previousSibling
      ? this.#ref(refTree.previousSibling)
      : null;
    const parentNode = refTree.parent ? this.#ref(refTree.parent) : null;

    newNode.parent = refTree.parent;
    newNode.previousSibling = refTree.previousSibling;
    newNode.nextSibling = referenceNode as any;
    refTree.previousSibling = newObject;

    if (prevNode) prevNode.nextSibling = newObject;

    if (parentNode && parentNode.firstChild === referenceNode) {
      parentNode.firstChild = newObject;
    }

    return newObject;
  }

  /** Yield all child of {@linkcode node}. O(n) */
  *children(node: T): IterableIterator<Child> {
    let current = this.firstChild(node);

    while (current) {
      yield current;

      current = this.nextSibling(current);
    }
  }

  /** Yield all ancestors of {@linkcode node} in order of proximity. O(n) */
  *ancestors(node: T): IterableIterator<T> {
    const { parent } = this.#ref(node);

    if (parent) {
      yield parent;
      yield* this.ancestors(parent);
    }
  }

  /** Yield all inclusive ancestors of {@linkcode node} in order of proximity. O(n) */
  *inclusiveAncestors(node: T): IterableIterator<T> {
    yield node;
    yield* this.ancestors(node);
  }

  /** Yield all descendant of {@linkcode node} with depth first order. O(n) */
  *descendants(node: T): IterableIterator<T> {
    const children = this.children(node);

    for (const child of children) {
      yield child;
      yield* this.descendants(child);
    }
  }

  /** Yield all inclusive descendants of {@linkcode node} with depth first order. O(n) */
  *inclusiveDescendants(node: T): IterableIterator<T> {
    yield node;
    yield* this.descendants(node);
  }

  *siblings(node: T): IterableIterator<T> {
    for (const sibling of this.inclusiveSiblings(node)) {
      if (node !== sibling) yield sibling;
    }
  }

  *inclusiveSiblings(node: T): IterableIterator<T> {
    const parent = this.parent(node);

    if (parent) yield* this.children(parent);
  }

  /** Yield all previous siblings of {@linkcode node} in order of proximity. O(n) */
  *previousSiblings(node: T): IterableIterator<T> {
    const { previousSibling } = this.#ref(node);

    if (previousSibling) {
      yield previousSibling;
      yield* this.previousSiblings(previousSibling);
    }
  }

  /** Yield all next siblings of {@linkcode node} in order of proximity. O(n) */
  *nextSiblings(node: T): IterableIterator<T> {
    const { nextSibling } = this.#ref(node);

    if (nextSibling) {
      yield nextSibling;
      yield* this.nextSiblings(nextSibling);
    }
  }

  precede(node: T): T | null {
    const { previousSibling, parent } = this.#ref(node);

    if (previousSibling) return this.#prev(previousSibling);

    return parent;
  }

  #prev(node: T): T {
    const lastChild = this.lastChild(node);

    return lastChild ? this.#prev(lastChild) : node;
  }

  *precedes(node: T): IterableIterator<T> {
    const precede = this.precede(node);

    if (precede) {
      yield precede;
      yield* this.precedes(precede);
    }
  }

  follow(node: T): T | null {
    const { nextSibling, parent, firstChild } = this.#ref(node);

    if (firstChild) return firstChild;
    if (nextSibling) return nextSibling;

    return parent ? this.#nextNodeDescendant(parent) : null;
  }

  /** Yield all following nodes of {@linkcode node}. O(n) */
  *follows(node: T): IterableIterator<T> {
    const follow = this.follow(node);

    if (follow) {
      yield follow;
      yield* this.follows(follow);
    }
  }

  #nextNodeDescendant(node: T): T | null {
    let current: T | null = node;

    while (current) {
      const { nextSibling, parent } = this.#ref(current);

      if (!nextSibling) current = parent;
      else break;
    }

    if (!current) return null;
    return this.#ref(current).nextSibling;
  }

  appendChild(referenceNode: T, newObject: Child): Child {
    const newNode = this.#ref(newObject);

    assertNotParticipate(
      newNode,
      "Given object is already present in this SymbolTree, remove it first",
    );

    const refTree = this.#ref(referenceNode);

    if (refTree.hasChild) {
      this.insertAfter(refTree.lastChild!, newObject);
    } else {
      newNode.parent = referenceNode as any;
      refTree.firstChild = newObject;
      refTree.lastChild = newObject;
    }

    return newObject;
  }

  prependChild(reference: T, newObject: Child): Child {
    const newNode = this.#ref(newObject);

    assertNotParticipate(
      newNode,
      "Given object is already present in this SymbolTree, remove it first",
    );

    const referenceNode = this.#ref(reference);

    if (referenceNode.hasChild) {
      this.insertBefore(referenceNode.firstChild!, newObject);
    } else {
      newNode.parent = reference as any;
      referenceNode.firstChild = newObject;
      referenceNode.lastChild = newObject;
    }

    return newObject;
  }

  remove(node: T): T {
    const treeNode = this.#ref(node);
    const { parent, nextSibling, previousSibling } = treeNode;
    const parentNode = parent ? this.#ref(parent) : null;

    if (parentNode) {
      if (parentNode.firstChild === node) parentNode.firstChild = nextSibling;
      if (parentNode.lastChild === node) parentNode.lastChild = previousSibling;
    }

    const prevNode = previousSibling ? this.#ref(previousSibling) : null;

    if (prevNode) prevNode.nextSibling = nextSibling;

    const nextNode = nextSibling ? this.#ref(nextSibling) : null;

    if (nextNode) nextNode.previousSibling = previousSibling;

    treeNode.parent = null;
    treeNode.previousSibling = null;
    treeNode.nextSibling = null;
    treeNode.firstChild = null;
    treeNode.lastChild = null;

    return node;
  }

  index(node: T): number {
    const childNode = this.#ref(node);
    const parentNode = childNode.parent ? this.#ref(childNode.parent) : null;

    if (!parentNode) return 0;

    let index = 0;
    let object = parentNode.firstChild;

    while (object) {
      const nodeTree = this.#ref(object);

      if (object === node) break;

      ++index;
      object = nodeTree.nextSibling;
    }

    return index;
  }
}

export class TreeNode<
  T extends object = object,
  Parent extends T = T,
  Child extends T = T,
> {
  parent: Parent | null = null;
  firstChild: Child | null = null;
  lastChild: Child | null = null;
  previousSibling: Child | null = null;
  nextSibling: Child | null = null;

  get isAttached(): boolean {
    return !!(this.parent || this.previousSibling || this.nextSibling);
  }

  get hasChild(): boolean {
    return !!this.firstChild;
  }
}

export function assertNotParticipate(
  node: TreeNode,
  message: string,
): void {
  if (node.isAttached) throw new Error(message);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-inclusive-ancestor
 */
export function isInclusiveAncestorOf(target: Node, of: Node): boolean {
  return target === of || isAncestorOf(target, of);
}

export function isAncestorOf(target: Node, of: Node): boolean {
  return isDescendantOf(of, target);
}

export function isDescendantOf(target: Node, of: Node): boolean {
  return isChildOf(target, of) ||
    some(tree.descendants(of), (descendant) => isChildOf(target, descendant));
}

export function isInclusiveDescendantOf(target: Node, of: Node): boolean {
  return target === of || isDescendantOf(target, of);
}

export function isChildOf(target: Node, of: unknown): boolean {
  return tree.parent(target) === of;
}

export function isSameTree(left: Node, right: Node): boolean {
  return left === right || tree.root(left) === tree.root(right);
}

export function isSiblingOf(target: Node, of: Node): boolean {
  const parent = tree.parent(target);
  return !!parent && parent === tree.parent(of);
}

export function isInclusiveSiblingOf(target: Node, of: Node): boolean {
  return target === of || isSiblingOf(target, of);
}

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-preceding
 */
export function isPrecedeOf(target: Node, of: Node): boolean {
  // A and B are in the same tree and A comes before B in tree order.
  if (target === of) return false;
  if (!isSameTree(target, of)) return false;

  return some(tree.precedes(of), (tree) => tree === target);
}

export function isFollowOf(target: Node, of: Node): boolean {
  // A and B are in the same tree and A comes after B in tree order.
  if (target === of) return false;
  if (!isSameTree(target, of)) return false;

  return some(tree.follows(of), (tree) => tree === target);
}
