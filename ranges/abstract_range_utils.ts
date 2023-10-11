import { $ } from "../internal.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#range-collapsed)
 */
export function isCollapsed(range: AbstractRange): boolean {
  const { startNode, endNode, startOffset, endOffset } = $(range);
  // its start node is its end node and its start offset is its end offset.
  return startNode === endNode &&
    startOffset === endOffset;
}
