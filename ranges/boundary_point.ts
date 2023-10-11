import { tree } from "../internal.ts";

export enum Position {
  /**
   * @see [DOM Living standard](https://dom.spec.whatwg.org/#concept-range-bp-before)
   */
  Before = "before",

  /**
   * @see [DOM Living standard](https://dom.spec.whatwg.org/#concept-range-bp-equal)
   */
  Equal = "equal",

  /**
   * @see [DOM Living standard](https://dom.spec.whatwg.org/#concept-range-bp-after)
   */
  After = "after",
}

/**
 * @see [DOM Living standard](https://dom.spec.whatwg.org/#concept-range-bp)
 */
export type BoundaryPoint = [node: Node, offset: number];

/**
 * @see [DOM Living standard](https://dom.spec.whatwg.org/#concept-range-bp-position)
 */
export function position(
  of: BoundaryPoint,
  relativeTo: BoundaryPoint,
): Position {
  const [nodeA, offsetA] = of, [nodeB, offsetB] = relativeTo;
  // 1. Assert: nodeA and nodeB have the same root.

  // 2. If nodeA is nodeB, then return equal if offsetA is offsetB, before if offsetA is less than offsetB, and after if offsetA is greater than offsetB.
  if (nodeA === nodeB) {
    if (offsetA === offsetB) return Position.Equal;
    if (offsetA < offsetB) return Position.Before;
    if (offsetA > offsetB) return Position.After;
  }

  // 3. If nodeA is following nodeB, then if the position of (nodeB, offsetB) relative to (nodeA, offsetA) is before, return after, and if it is after, return before.
  if (tree.isFollowing(nodeA, nodeB)) {
    const pos = position([nodeB, offsetB], [nodeA, offsetA]);

    switch (pos) {
      case Position.Before:
        return Position.After;
      case Position.After:
        return Position.Before;
    }
  }

  // 4. If nodeA is an ancestor of nodeB:
  if (tree.isAncestor(nodeA, nodeB)) {
    // 1. Let child be nodeB.
    let child = nodeB;

    // 2. While child is not a child of nodeA, set child to its parent.
    while (!tree.isChild(child, nodeA)) {
      const parent = tree.parent(child);
      if (!parent) break;

      child = parent;
    }

    // 3. If child’s index is less than offsetA, then return after.
    if (tree.index(child) < offsetA) return Position.After;
  }

  // 5. Return before.
  return Position.Before;
}
