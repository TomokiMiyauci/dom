import type { Node } from "../nodes/node.ts";
import { getIndex, isAncestorOf, isChildOf } from "../trees/tree.ts";

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

  private positionOf(other: BoundaryPoint): Position {
    const nodeA = this[0],
      offsetA = this[1],
      nodeB = other[0],
      offsetB = other[1];

    if (nodeA === nodeB) {
      if (offsetA === offsetB) return Position.Equal;
      if (offsetA < offsetB) return Position.Before;
      if (offsetA > offsetB) return Position.After;
    }

    if (isAncestorOf(nodeA, nodeB)) {
      let child = nodeB;

      while (!isChildOf(child, nodeA)) {
        const parent = child._parent;
        if (!parent) break;

        child = parent;
      }

      if (getIndex(child) < offsetA) return Position.After;
    }

    return Position.Before;
  }
}
