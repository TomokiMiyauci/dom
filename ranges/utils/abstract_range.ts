import type { $AbstractRange, $Node } from "../../i.ts";
import { end, start } from "../../symbol.ts";
import * as RangeUtils from "./abstract_range.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#range-collapsed)
 */
export function isCollapsed(range: $AbstractRange): boolean {
  const startNode = RangeUtils.startNode(range),
    startOffset = RangeUtils.startOffset(range),
    endNode = RangeUtils.endNode(range),
    endOffset = RangeUtils.endOffset(range);

  // its start node is its end node and its start offset is its end offset.
  return startNode === endNode &&
    startOffset === endOffset;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-start-node)
 */
export function startNode(range: $AbstractRange): $Node {
  return range[start][0];
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-start-offset)
 */
export function startOffset(range: $AbstractRange): number {
  return range[start][1];
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-start-node)
 */
export function endNode(range: $AbstractRange): $Node {
  return range[end][0];
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-start-offset)
 */
export function endOffset(range: $AbstractRange): number {
  return range[end][1];
}
