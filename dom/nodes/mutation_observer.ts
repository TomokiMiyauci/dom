import type { Node } from "./node.ts";
import type { Child } from "./types.ts";
import { OrderedSet } from "../../infra/data_structures/set.ts";

/**
 * @see https://dom.spec.whatwg.org/#queue-a-tree-mutation-record
 */
export function queueTreeMutationRecord(
  target: Node,
  addedNodes: OrderedSet<Node>,
  removedNodes: OrderedSet<Node>,
  previousSibling: Child,
  nextSibling: Child,
): void {
  // 1. Assert: either addedNodes or removedNodes is not empty.

  // 2. Queue a mutation record of "childList" for target with null, null, null, addedNodes, removedNodes, previousSibling, and nextSibling.
  queueMutationRecord(
    "childList",
    target,
    null,
    null,
    null,
    addedNodes,
    removedNodes,
    previousSibling,
    nextSibling,
  );
}

/**
 * @see https://dom.spec.whatwg.org/#queueing-a-mutation-record
 */
export function queueMutationRecord(
  type: string,
  target: Node | null,
  name: string | null,
  namespace: string | null,
  oldValue: string | null,
  addedNodes: OrderedSet<Node>,
  removedNodes: OrderedSet<Node>,
  previousSibling: Child,
  nextSibling: Child,
) {}
