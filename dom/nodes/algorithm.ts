/** This is node's algorithm collection.
 * This is an intermediate module to prevent circular references.
 * The algorithm should always be in the same module as its node module if circular references do not occur.
 * @module
 */

import { getRoot, isInclusiveAncestorOf, Tree } from "../trees/tree.ts";
import { $host } from "./internal.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-tree-host-including-inclusive-ancestor
 */
export function isHostIncludingInclusiveAncestorOf(
  target: Tree,
  of: Tree,
): boolean {
  if (isInclusiveAncestorOf(target, of)) return true;

  const root = getRoot(of);

  return $host in root && root[$host] !== null &&
    isHostIncludingInclusiveAncestorOf(target, root[$host] as Tree);
}
