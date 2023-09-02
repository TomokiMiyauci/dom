import type { Node } from "../nodes/node.ts";
import {
  getIndex,
  isAncestorOf,
  isChildOf,
  isFollowOf,
} from "../trees/tree.ts";

export enum Position {
  Before = "before",
  Equal = "equal",
  After = "after",
}

/**
 * @see https://dom.spec.whatwg.org/#concept-range-bp
 */
export class BoundaryPoint {
  0: Node;
  1: number;

  constructor({ node, offset }: { node: Node; offset: number }) {
    this[0] = node;
    this[1] = offset;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-range-bp-position
   */
  positionOf(other: BoundaryPoint): Position {
    // 1. Assert: nodeA and nodeB have the same root.
    const nodeA = this[0],
      offsetA = this[1],
      nodeB = other[0],
      offsetB = other[1];

    // 2. If nodeA is nodeB, then return equal if offsetA is offsetB, before if offsetA is less than offsetB, and after if offsetA is greater than offsetB.
    if (nodeA === nodeB) {
      if (offsetA === offsetB) return Position.Equal;
      if (offsetA < offsetB) return Position.Before;
      if (offsetA > offsetB) return Position.After;
    }

    // 3. If nodeA is following nodeB, then if the position of (nodeB, offsetB) relative to (nodeA, offsetA) is before, return after, and if it is after, return before.
    if (isFollowOf(nodeA, nodeB)) {
      const position = new BoundaryPoint({ node: nodeB, offset: offsetB })
        .positionOf(new BoundaryPoint({ node: nodeA, offset: offsetA }));

      switch (position) {
        case Position.Before:
          return Position.After;
        case Position.After:
          return Position.Before;
      }
    }

    // 4. If nodeA is an ancestor of nodeB:
    if (isAncestorOf(nodeA, nodeB)) {
      // 1. Let child be nodeB.
      let child = nodeB;

      // 2. While child is not a child of nodeA, set child to its parent.
      while (!isChildOf(child, nodeA)) {
        const parent = child._parent;
        if (!parent) break;

        child = parent;
      }

      // 3. If child’s index is less than offsetA, then return after.
      if (getIndex(child) < offsetA) return Position.After;
    }

    // 5. Return before.
    return Position.Before;
  }
}
