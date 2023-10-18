import { is$CharacterData, isDocumentType } from "../../nodes/utils/type.ts";
import { DOMExceptionName } from "../../_internals/webidl/exception.ts";
import { DocumentFragment } from "../../nodes/document_fragment.ts";
import { nodeLength } from "../../nodes/utils/node_tree.ts";
import { appendNode } from "../../nodes/utils/mutation.ts";
import { substringData } from "../../nodes/utils/character_data.ts";
import { tree } from "../../internal.ts";
import { iter, last } from "../../deps.ts";
import { isCollapsed } from "./abstract_range.ts";
import * as RangeUtils from "./abstract_range.ts";
import { $CharacterData, $ChildNode, $Node } from "../../i.ts";
import * as $$ from "../../symbol.ts";
import { Range } from "../range.ts";
import { isContained, isPartiallyContained } from "./range.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-clone)
 */
export function cloneContents(range: Range): DocumentFragment {
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
    originalStartNode === originalEndNode && is$CharacterData(originalStartNode)
  ) {
    // 1. Let clone be a clone of original start node.
    const clone = originalStartNode.cloneNode() as $CharacterData;

    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original end offset minus original start offset.
    clone[$$.data] = substringData(
      originalStartNode,
      originalStartOffset,
      originalEndOffset - originalStartOffset,
    );

    // 3. Append clone to fragment.
    appendNode(clone, fragment);

    // 4. Return fragment.
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

  // 8. If original start node is not an inclusive ancestor of original end node,
  if (!tree.isInclusiveAncestor(originalStartNode, originalEndNode)) {
    // set first partially contained child to the first child of common ancestor that is partially contained in range.
    const children = tree.children(commonAncestor);
    const firstChild = iter(children).find((node) =>
      isPartiallyContained(node, range)
    );
    if (firstChild) firstPartiallyContainedChild = firstChild;
  }

  // 9. Let last partially contained child be null.
  let lastPartiallyContainedChild: $ChildNode | null = null;

  // 10. If original end node is not an inclusive ancestor of original start node,
  if (!tree.isInclusiveAncestor(originalEndNode, originalStartNode)) {
    // set last partially contained child to the last child of common ancestor that is partially contained in range.
    const children = tree.children(commonAncestor);
    const partiallyContained = iter(children).filter((node) =>
      isPartiallyContained(node, range)
    );
    const lastChild = last(partiallyContained);
    if (lastChild) lastPartiallyContainedChild = lastChild;
  }

  const children = tree.children(commonAncestor);
  // 11. Let contained children be a list of all children of common ancestor that are contained in range, in tree order.
  const containedChildren = iter(children).filter(contained);

  // 12. If any member of contained children is a doctype, then throw a "HierarchyRequestError" DOMException.
  if (containedChildren.some(isDocumentType)) {
    throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);
  }

  // 13. If first partially contained child is a CharacterData node, then:
  if (
    firstPartiallyContainedChild &&
    is$CharacterData(firstPartiallyContainedChild)
  ) {
    // 1. Let clone be a clone of original start node.
    // TODO use clone
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

    // 14. Otherwise, if first partially contained child is not null:
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

    // 4. Let subfragment be the result of cloning the contents of subrange.
    const subfragment = cloneContents(subrange);

    // 5. Append subfragment to clone.
    appendNode(subfragment, clone);
  }

  // 15. For each contained child in contained children:
  for (const containedChild of containedChildren) {
    // 1. Let clone be a clone of contained child with the clone children flag set.
    // TODO use clone
    const clone = containedChild.cloneNode(true);

    // 2. Append clone to fragment.
    appendNode(clone, fragment);
  }

  // 16. If last partially contained child is a CharacterData node, then:
  if (
    lastPartiallyContainedChild && is$CharacterData(lastPartiallyContainedChild)
  ) {
    // 1. Let clone be a clone of original end node.
    // TODO use clone
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

    // 17. Otherwise, if last partially contained child is not null:
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

    // 4. Let subfragment be the result of cloning the contents of subrange.
    const subfragment = cloneContents(subrange);

    // 5. Append subfragment to clone.
    appendNode(subfragment, clone);
  }

  // 18. Return fragment.
  return fragment;

  function contained(node: $Node): boolean {
    return isContained(node, range);
  }
}
