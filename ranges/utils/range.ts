import {
  isDocumentFragment,
  isDocumentType,
  isMyText,
  isText,
} from "../../nodes/utils/type.ts";
import { isProcessingInstruction } from "../../nodes/utils/type.ts";
import { isComment } from "../../nodes/utils/type.ts";
import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { nodeLength } from "../../nodes/utils/node_tree.ts";
import {
  ensurePreInsertionValidity,
  preInsertNode,
  removeNode,
} from "../../nodes/utils/mutation.ts";
import { tree } from "../../internal.ts";
import { Position, position } from "../boundary_point.ts";
import { isCollapsed } from "./abstract_range.ts";
import * as RangeUtils from "./abstract_range.ts";
import { splitText } from "../../nodes/utils/split_text.ts";
import { $Node, $Range, BoundaryPoint } from "../../i.ts";
import * as $$ from "../../symbol.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-root)
 */
export function root(range: $Range): $Node {
  // the root of its start node.
  return tree.root(RangeUtils.startNode(range));
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#contained)
 */
export function isContained(node: $Node, range: $Range): boolean {
  // if node’s root is range’s root,
  return tree.root(node) === root(range) &&
    // and (node, 0) is after range’s start,
    position([node, 0], range[$$.start]) === Position.After &&
    // and (node, node’s length) is before range’s end.
    position([node, nodeLength(node)], range[$$.end]) === Position.Before;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#partially-contained)
 */
export function isPartiallyContained(node: $Node, range: $Range): boolean {
  const startNode = RangeUtils.startNode(range),
    endNode = RangeUtils.endNode(range);

  // if it’s an inclusive ancestor of the live range’s start node but not its end node, or vice versa.
  return (tree.isInclusiveAncestor(node, startNode) &&
    !tree.isInclusiveAncestor(node, endNode)) ||
    (!tree.isInclusiveAncestor(node, startNode) &&
      tree.isInclusiveAncestor(node, endNode));
}

/**
 * @see https://dom.spec.whatwg.org/#concept-range-bp-set
 */
export function setStartOrEnd(
  step: "start" | "end",
  range: $Range,
  boundaryPoint: BoundaryPoint,
): void {
  const node = boundaryPoint[0], offset = boundaryPoint[1];
  // 1. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
  if (isDocumentType(node)) {
    throw new DOMException(
      "<message>",
      DOMExceptionName.InvalidNodeTypeError,
    );
  }

  // 2. If offset is greater than node’s length, then throw an "IndexSizeError" DOMException.
  if (offset > nodeLength(node)) {
    throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
  }

  // 3. Let bp be the boundary point (node, offset).
  const bp: BoundaryPoint = [node, offset];

  // 4.
  switch (step) {
    // If these steps were invoked as "set the start"
    case "start": {
      // If range’s root is not equal to node’s root, or if bp is after the range’s end,
      if (
        root(range) !== tree.root(node) ||
        position(bp, range[$$.end]) === Position.After
        // set range’s end to bp.
      ) range[$$.end] = bp;

      // 2. Set range’s start to bp.
      range[$$.start] = bp;
      break;
    }

    // If these steps were invoked as "set the end"
    case "end": {
      // 1. If range’s root is not equal to node’s root, or if bp is before the range’s start,
      if (
        root(range) !== tree.root(node) ||
        position(bp, range[$$.start]) === Position.Before
        // set range’s start to bp.
      ) range[$$.start] = bp;

      // 2. Set range’s end to bp.
      range[$$.end] = bp;
    }
  }
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-insert)
 */
export function insert(node: $Node, range: $Range): void {
  const startNode = RangeUtils.startNode(range);

  // 1. If range’s start node is a ProcessingInstruction or Comment node, is a Text node whose parent is null, or is node, then throw a "HierarchyRequestError" DOMException.
  if (
    isProcessingInstruction(startNode) || isComment(startNode) ||
    (isText(startNode) && !tree.parent(startNode)) ||
    startNode === node
  ) throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);

  // 2. Let referenceNode be null.
  let referenceNode: $Node | null = null;

  // 3. If range’s start node is a Text node, set referenceNode to that Text node.
  if (isText(startNode)) referenceNode = startNode;
  // 4. Otherwise, set referenceNode to the child of start node whose index is start offset, and null if there is no such child.
  else {referenceNode =
      tree.children(startNode)[RangeUtils.startOffset(range)] ??
        null;}

  // 5. Let parent be range’s start node if referenceNode is null, and referenceNode’s parent otherwise.
  const parent = !referenceNode ? startNode : tree.parent(referenceNode)!; // maybe ensure parent

  // 6. Ensure pre-insertion validity of node into parent before referenceNode.
  ensurePreInsertionValidity(node, parent, referenceNode);

  // 7. If range’s start node is a Text node, set referenceNode to the result of splitting it with offset range’s start offset.
  if (isMyText(startNode)) {
    referenceNode = splitText(startNode, RangeUtils.startOffset(range));
  }

  // 8. If node is referenceNode, set referenceNode to its next sibling.
  if (node === referenceNode) referenceNode = tree.nextSibling(node);

  // 9. If node’s parent is non-null, then remove node.
  if (tree.parent(node)) removeNode(node);

  // 10. Let newOffset be parent’s length if referenceNode is null; otherwise referenceNode’s index.
  let newOffset = !referenceNode
    ? nodeLength(parent)
    : tree.index(referenceNode);

  // 11. Increase newOffset by node’s length if node is a DocumentFragment node; otherwise 1.
  newOffset += isDocumentFragment(node) ? nodeLength(node) : 1;

  // 12. Pre-insert node into parent before referenceNode.
  preInsertNode(node, parent, referenceNode);

  // 13. If range is collapsed, then set range’s end to (parent, newOffset).
  if (isCollapsed(range)) range[$$.end] = [parent, newOffset];
}

/**
 * @see https://dom.spec.whatwg.org/#concept-range-select
 */
export function select(node: $Node, range: $Range): void {
  // 1. Let parent be node’s parent.
  const parent = tree.parent(node);

  // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
  if (!parent) {
    throw new DOMException(
      "<message>",
      DOMExceptionName.InvalidNodeTypeError,
    );
  }

  // 3. Let index be node’s index.
  const index = tree.index(node);

  // 4. Set range’s start to boundary point (parent, index).
  range[$$.start] = [parent, index];

  // 5. Set range’s end to boundary point (parent, index plus 1).
  range[$$.end] = [parent, index + 1];
}

export function* containedNodes(
  range: $Range,
): IterableIterator<$Node> {
  const startNode = RangeUtils.startNode(range),
    endNode = RangeUtils.endNode(range);
  const endOfNode = tree.nextDescendant(endNode);

  let current = startNode;

  while (current !== endOfNode) {
    if (isContained(current, range)) yield current;

    const following = tree.follow(current);
    if (!following) break;

    current = following;
  }
}
