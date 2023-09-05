import { DOMExceptionName } from "../../webidl/exception.ts";
import { type NodeIterator } from "./node_iterator.ts";
import { type TreeWalker } from "./tree_walker.ts";
import { NodeFilter } from "./node_filter.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-filter)
 */
export function filter(
  node: Node,
  traverser: NodeIterator | TreeWalker,
): number {
  // for types
  traverser = traverser as NodeIterator;

  // 1. If traverser’s active flag is set, then throw an "InvalidStateError" DOMException.
  if (traverser["_activeFlag"]) {
    throw new DOMException("<message>", DOMExceptionName.InvalidStateError);
  }

  // 2. Let n be node’s nodeType attribute value − 1.
  const n = node.nodeType - 1;

  // 3. If the nth bit (where 0 is the least significant bit) of traverser’s whatToShow is not set, then return FILTER_SKIP.
  if (!((1 << n) & traverser["_whatToShow"])) return NodeFilter.FILTER_SKIP;

  // 4. If traverser’s filter is null, then return FILTER_ACCEPT.
  if (!traverser["_filter"]) return NodeFilter.FILTER_ACCEPT;

  // 5. Set traverser’s active flag.
  traverser["_activeFlag"] = true;

  let result: number;
  // 6. Let result be the return value of call a user object’s operation with traverser’s filter, "acceptNode", and « node ».
  try {
    const filter = typeof traverser["_filter"] === "function"
      ? traverser["_filter"]
      : traverser["_filter"].acceptNode;

    // TODO: call a user object’s operation
    result = filter.apply(traverser, [node]);

    // TODO: use unsigned long converter
    result = Number(result);

    // If this throws an exception, then unset traverser’s active flag and rethrow the exception.
  } catch (e) {
    traverser["_activeFlag"] = null;
    throw e;
  }

  // 7. Unset traverser’s active flag.
  traverser["_activeFlag"] = null;

  // 8. Return result.
  return result;
}
