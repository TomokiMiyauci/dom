import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { NodeFilter } from "./node_filter.ts";
import { $ } from "../../internal.ts";
import { callUserObjectOperation } from "../../_internals/webidl/ecmascript_bindings/callback_interface.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-node-filter)
 */
export function filter(
  node: Node,
  traverser: NodeIterator | TreeWalker,
): number {
  // 1. If traverser’s active flag is set, then throw an "InvalidStateError" DOMException.
  if ($(traverser).activeFlag) {
    throw new DOMException("<message>", DOMExceptionName.InvalidStateError);
  }

  // 2. Let n be node’s nodeType attribute value − 1.
  const n = node.nodeType - 1;

  // 3. If the nth bit (where 0 is the least significant bit) of traverser’s whatToShow is not set, then return FILTER_SKIP.
  if (!((1 << n) & $(traverser).whatToShow)) return NodeFilter.FILTER_SKIP;

  // 4. If traverser’s filter is null, then return FILTER_ACCEPT.
  if (!$(traverser).filter) return NodeFilter.FILTER_ACCEPT;

  // 5. Set traverser’s active flag.
  $(traverser).activeFlag = true;

  let result: number;
  // 6. Let result be the return value of call a user object’s operation with traverser’s filter, "acceptNode", and « node ».
  try {
    const operationResult = callUserObjectOperation(
      $(traverser).filter,
      "acceptNode",
      [
        node,
      ],
    );

    // TODO: use unsigned long converter
    result = Number(operationResult);

    // If this throws an exception, then unset traverser’s active flag and rethrow the exception.
  } catch (e) {
    $(traverser).activeFlag = false;
    throw e;
  }

  // 7. Unset traverser’s active flag.
  $(traverser).activeFlag = false;

  // 8. Return result.
  return result;
}
