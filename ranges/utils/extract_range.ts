import { Range } from "../range.ts";
import { DocumentFragment } from "../../nodes/document_fragment.ts";
import { is$CharacterData, isDocumentType } from "../../nodes/utils/type.ts";
import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { nodeLength } from "../../nodes/utils/node_tree.ts";
import { appendNode } from "../../nodes/utils/mutation.ts";
import {
  replaceData,
  substringData,
} from "../../nodes/utils/character_data.ts";
import { tree } from "../../internal.ts";
import { iter, last } from "../../deps.ts";
import { isCollapsed } from "./abstract_range.ts";
import * as RangeUtils from "./abstract_range.ts";
import { $CharacterData, $ChildNode, $Node } from "../../i.ts";
import * as $$ from "../../symbol.ts";
import { isContained, isPartiallyContained } from "./range.ts";

/**
 * @see https://dom.spec.whatwg.org/#concept-range-extract
 */
export function extractRange(range: Range): DocumentFragment {
  // 1. Let fragment be a new DocumentFragment node whose node document is range’s start node’s node document.
  const fragment = new DocumentFragment();
  fragment[$$.nodeDocument] = RangeUtils.startNode(range)[$$.nodeDocument];

  // 2. If range is collapsed, then return fragment.
  if (isCollapsed(range)) return fragment;

  // 3. Let original start node, original start offset, original end node, and original end offset be range’s start node, start offset, end node, and end offset, respectively.
  const originalStartNode = RangeUtils.startNode(range),
    originalStartOffset = RangeUtils.startOffset(range),
    originalEndNode = RangeUtils.endNode(range),
    originalEndOffset = RangeUtils.endOffset(range);

  // 4. If original start node is original end node and it is a CharacterData node, then:
  if (
    originalStartNode === originalEndNode &&
    is$CharacterData(originalStartNode)
  ) {
    // 1. Let clone be a clone of original start node.
    // TODO(miyauci): use internal method
    const clone = originalStartNode.cloneNode() as $CharacterData;

    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original end offset minus original start offset.
    const data = substringData(
      originalStartNode,
      originalStartOffset,
      originalEndOffset - originalStartOffset,
    );
    clone[$$.data] = data;

    // 3. Append clone to fragment.
    appendNode(clone, fragment);

    // 4. Replace data with node original start node, offset original start offset, count original end offset minus original start offset, and data the empty string.
    replaceData(
      originalStartNode,
      originalStartOffset,
      originalEndOffset - originalStartOffset,
      "",
    );

    // 5. Return fragment.
    return fragment;
  }

  // 5. Let common ancestor be original start node.
  let commonAncestor = originalStartNode;

  // 6. While common ancestor is not an inclusive ancestor of original end node, set common ancestor to its own parent.
  while (!tree.isInclusiveAncestor(commonAncestor, originalEndNode)) {
    const parent = tree.parent(commonAncestor);

    if (!parent) break;

    commonAncestor = parent;
  }

  // 7. Let first partially contained child be null.
  let firstPartiallyContainedChild: $ChildNode | null = null;

  function partiallyContained(node: $Node): boolean {
    return isPartiallyContained(node, range);
  }

  function contained(node: $Node): boolean {
    return isContained(node, range);
  }

  // 8. If original start node is not an inclusive ancestor of original end node,
  if (!tree.isInclusiveAncestor(originalStartNode, originalEndNode)) {
    const children = tree.children(commonAncestor);
    const first = iter(children).find(partiallyContained);
    // set first partially contained child to the first child of common ancestor that is partially contained in range.
    if (first) firstPartiallyContainedChild = first;
  }

  // 9. Let last partially contained child be null.
  let lastPartiallyContainedChild: $ChildNode | null = null;

  // 10. If original end node is not an inclusive ancestor of original start node,
  if (!tree.isInclusiveAncestor(originalEndNode, originalStartNode)) {
    const children = tree.children(commonAncestor);
    const partiallyContains = iter(children).filter(partiallyContained);
    const lastChild = last(partiallyContains);
    // set last partially contained child to the last child of common ancestor that is partially contained in range.
    if (lastChild) lastPartiallyContainedChild = lastChild;
  }

  const commonAncestorChildren = tree.children(commonAncestor);
  // 11. Let contained children be a list of all children of common ancestor that are contained in range, in tree order.
  const containedChildren = iter(commonAncestorChildren).filter(contained);

  // 12. If any member of contained children is a doctype, then throw a "HierarchyRequestError" DOMException.
  if (containedChildren.some(isDocumentType)) {
    throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);
  }

  let newNode: $Node, newOffset: number;

  // 13. If original start node is an inclusive ancestor of original end node, set new node to original start node and new offset to original start offset.
  if (tree.isInclusiveAncestor(originalStartNode, originalEndNode)) {
    newNode = originalStartNode, newOffset = originalStartOffset;
    // 14. Otherwise:
  } else {
    // 1. Let reference node equal original start node.
    let referenceNode = originalStartNode;

    // 2. While reference node’s parent is not null and is not an inclusive ancestor of original end node, set reference node to its parent.
    while (
      tree.parent(referenceNode) &&
      !tree.isInclusiveAncestor(tree.parent(referenceNode)!, originalEndNode)
    ) referenceNode = tree.parent(referenceNode)!;

    // 3. Set new node to the parent of reference node, and new offset to one plus reference node’s index.
    newNode = tree.parent(referenceNode)!,
      newOffset = tree.index(referenceNode) + 1;
  }

  // 15. If first partially contained child is a CharacterData node, then:
  if (
    firstPartiallyContainedChild &&
    is$CharacterData(firstPartiallyContainedChild)
  ) {
    // TODO use clone
    // 1. Let clone be a clone of original start node.
    const clone = originalStartNode.cloneNode() as $CharacterData;

    const data = substringData(
      originalStartNode as $CharacterData,
      originalStartOffset,
      nodeLength(originalStartNode) - originalStartOffset,
    );
    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original start node’s length − original start offset.
    clone[$$.data] = data;

    // 3. Append clone to fragment.
    appendNode(clone, fragment);

    // 4. Replace data with node original start node, offset original start offset, count original start node’s length − original start offset, and data the empty string.
    replaceData(
      originalStartNode as $CharacterData,
      originalStartOffset,
      nodeLength(originalStartNode) - originalStartOffset,
      "",
    );

    // 16. Otherwise, if first partially contained child is not null:
  } else if (firstPartiallyContainedChild) {
    // TODO use clone
    // 1. Let clone be a clone of first partially contained child.
    const clone = firstPartiallyContainedChild.cloneNode();

    // 2. Append clone to fragment.
    appendNode(clone, fragment);

    // 3. Let subrange be a new live range whose start is (original start node, original start offset) and whose end is (first partially contained child, first partially contained child’s length).
    const subrange = new Range();
    subrange[$$.start] = [originalStartNode, originalStartOffset],
      subrange[$$.end] = [
        firstPartiallyContainedChild,
        nodeLength(firstPartiallyContainedChild),
      ];

    // 4. Let subfragment be the result of extracting subrange.
    const subfragment = extractRange(subrange);

    // 5. Append subfragment to clone.
    appendNode(subfragment, clone);
  }

  // 17. For each contained child in contained children, append contained child to fragment.
  for (const containedChild of containedChildren) {
    appendNode(containedChild, fragment);
  }

  // 18. If last partially contained child is a CharacterData node, then:
  if (
    lastPartiallyContainedChild && is$CharacterData(lastPartiallyContainedChild)
  ) {
    // TODO use clone
    // 1. Let clone be a clone of original end node.
    const clone = originalEndNode.cloneNode() as $CharacterData;

    const data = substringData(
      originalEndNode as $CharacterData,
      0,
      originalEndOffset,
    );
    // 2. Set the data of clone to the result of substringing data with node original end node, offset 0, and count original end offset.
    clone[$$.data] = data;

    // 3. Append clone to fragment.
    appendNode(clone, fragment);

    // 4. Replace data with node original end node, offset 0, count original end offset, and data the empty string.
    replaceData(originalEndNode as $CharacterData, 0, originalEndOffset, "");

    // 19. Otherwise, if last partially contained child is not null:
  } else if (lastPartiallyContainedChild) {
    // TODO use clone
    // 1. Let clone be a clone of last partially contained child.
    const clone = lastPartiallyContainedChild.cloneNode();

    // 2. Append clone to fragment.
    appendNode(clone, fragment);

    // 3. Let subrange be a new live range whose start is (last partially contained child, 0) and whose end is (original end node, original end offset).
    const subrange = new Range();
    subrange[$$.start] = [lastPartiallyContainedChild, 0],
      subrange[$$.end] = [originalEndNode, originalEndOffset];

    // 4. Let subfragment be the result of extracting subrange.
    const subfragment = extractRange(subrange);

    // 5. Append subfragment to clone.
    appendNode(subfragment, clone);
  }

  // 20. Set range’s start and end to (new node, new offset).
  range[$$.start] = [newNode, newOffset], range[$$.end] = [newNode, newOffset];

  // 21. Return fragment.
  return fragment;
}
