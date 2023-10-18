import { filter } from "../traversal.ts";
import { NodeFilter } from "../node_filter.ts";
import { dropwhile, first, last, takewhile } from "../../deps.ts";
import {
  iteratorCollection,
  pointerBeforeReference,
  reference,
} from "../../symbol.ts";
import type { $NodeIterator } from "../../i.ts";

export enum Direction {
  Next,
  Previous,
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-nodeiterator-traverse)
 */
export function traverse(
  iterator: $NodeIterator,
  direction: Direction,
): Node | null {
  // 1. Let node be iterator’s reference.
  let node = iterator[reference];

  // 2. Let beforeNode be iterator’s pointer before reference.
  let beforeNode = iterator[pointerBeforeReference];

  // 3. While true:
  while (true) {
    // 1. Branch on direction:
    switch (direction) {
      // next
      case Direction.Next: {
        // If beforeNode is false, then set node to the first node following node in iterator’s iterator collection. If there is no such node, then return null.
        if (!beforeNode) {
          const following = dropwhile(
            iterator[iteratorCollection],
            (_, prev) => node !== prev,
          );
          const firstNode = first(following);

          if (!firstNode) return null;
          node = firstNode;
        }

        // If beforeNode is true, then set it to false.
        if (beforeNode) beforeNode = false;
        break;
      }

      // previous
      case Direction.Previous: {
        // If beforeNode is true, then set node to the first node preceding node in iterator’s iterator collection. If there is no such node, then return null.
        if (beforeNode) {
          const preceding = takewhile(
            iterator[iteratorCollection],
            (other) => node !== other,
          );
          const lastNode = last(preceding);

          if (!lastNode) return null;

          node = lastNode;
        }

        // If beforeNode is false, then set it to true.
        if (!beforeNode) beforeNode = true;
      }
    }

    // 2. Let result be the result of filtering node within iterator.
    const result = filter(node, iterator);

    // 3. If result is FILTER_ACCEPT, then break.
    if (result === NodeFilter.FILTER_ACCEPT) break;
  }

  // 4. Set iterator’s reference to node.
  iterator[reference] = node;

  // 5. Set iterator’s pointer before reference to beforeNode.
  iterator[pointerBeforeReference] = beforeNode;

  // 6. Return node.
  return node;
}
