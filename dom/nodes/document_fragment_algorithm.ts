/** This is node's algorithm collection.
 * This is an intermediate module to prevent circular references.
 * The algorithm should always be in the same module as its node module if circular references do not occur.
 * @module
 */

import { tree } from "../../internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-host-including-inclusive-ancestor
 */
export function isHostIncludingInclusiveAncestorOf(
  target: Node,
  of: Node,
): boolean {
  if (tree.isInclusiveAncestor(target, of)) return true;

  const root = tree.root(of);

  return "_host" in root && root["_host"] !== null &&
    isHostIncludingInclusiveAncestorOf(target, root["_host"] as Node);
}
