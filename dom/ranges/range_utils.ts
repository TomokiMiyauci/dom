import {
  isCharacterData,
  isComment,
  isDocumentFragment,
  isDocumentType,
  isProcessingInstruction,
  isText,
} from "../nodes/utils.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { nodeLength } from "../nodes/node_trees/node_tree.ts";
import { substringData } from "../nodes/character_data.ts";
import {
  appendNode,
  ensurePreInsertionValidity,
  preInsertNode,
  removeNode,
} from "../nodes/node_trees/mutation.ts";
import { replaceData } from "../nodes/character_data_algorithm.ts";
import { splitText } from "../nodes/text.ts";
import { $, tree } from "../../internal.ts";
import { iter, last } from "../../deps.ts";
import { Position, position } from "./boundary_point.ts";
import { Range } from "./range.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-root)
 */
export function root(range: Range): Node {
  const { startNode } = $(range);

  // the root of its start node.
  return tree.root(startNode);
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#contained)
 */
export function isContained(node: Node, range: Range): boolean {
  // if node’s root is range’s root,
  return tree.root(node) === root(range) &&
    // and (node, 0) is after range’s start,
    position([node, 0], $(range).start) === Position.After &&
    // and (node, node’s length) is before range’s end.
    position([node, nodeLength(node)], $(range).end) === Position.Before;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#partially-contained)
 */
export function isPartiallyContained(node: Node, range: Range): boolean {
  const { startNode, endNode } = $(range);

  // if it’s an inclusive ancestor of the live range’s start node but not its end node, or vice versa.
  return (tree.isInclusiveAncestor(node, startNode) &&
    !tree.isInclusiveAncestor(node, endNode)) ||
    (!tree.isInclusiveAncestor(node, startNode) &&
      tree.isInclusiveAncestor(node, endNode));
}

export function nextNodeDescendant(node: Node | null): Node | null {
  while (node && tree.nextSibling(node)) {
    node = tree.parent(node);
  }

  if (!node) return null;

  return tree.nextSibling(node);
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-clone)
 */
export function cloneContents(range: Range): globalThis.DocumentFragment {
  // 1. Let fragment be a new DocumentFragment node whose node document is range’s start node’s node document.
  const fragment = DocumentFragment["create"]({
    nodeDocument: $($(range).startNode).nodeDocument,
  });

  // 2. If range is collapsed, then return fragment.
  if ($(range).collapsed) return fragment;

  // 3. Let original start node, original start offset, original end node, and original end offset be range’s start node, start offset, end node, and end offset, respectively.
  const originalStartNode = $(range).startNode,
    originalStartOffset = $(range).startOffset,
    originalEndNode = $(range).endNode,
    originalEndOffset = $(range).endOffset;

  // 4. If original start node is original end node and it is a CharacterData node, then:
  if (
    originalStartNode === originalEndNode && isCharacterData(originalStartNode)
  ) {
    // 1. Let clone be a clone of original start node.
    const clone = originalStartNode.cloneNode() as CharacterData;

    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original end offset minus original start offset.
    $(clone).data = substringData(
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
  let firstPartiallyContainedChild: ChildNode | null = null;

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
  let lastPartiallyContainedChild: ChildNode | null = null;

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
    isCharacterData(firstPartiallyContainedChild)
  ) {
    // 1. Let clone be a clone of original start node.
    // TODO use clone
    const clone = originalStartNode.cloneNode();

    const data = substringData(
      originalStartNode as CharacterData,
      originalStartOffset,
      nodeLength(originalStartNode) - originalStartOffset,
    );
    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original start node’s length − original start offset.
    $(clone as CharacterData).data = data;

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
    $(subrange).start = [originalStartNode, originalStartOffset],
      $(subrange).end = [
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
    lastPartiallyContainedChild && isCharacterData(lastPartiallyContainedChild)
  ) {
    // 1. Let clone be a clone of original end node.
    // TODO use clone
    const clone = originalEndNode.cloneNode();

    const data = substringData(
      originalEndNode as CharacterData,
      0,
      originalEndOffset,
    );
    // 2. Set the data of clone to the result of substringing data with node original end node, offset 0, and count original end offset.
    $(clone as CharacterData).data = data;

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
    $(subrange).start = [lastPartiallyContainedChild, 0],
      $(subrange).end = [originalEndNode, originalEndOffset];

    // 4. Let subfragment be the result of cloning the contents of subrange.
    const subfragment = cloneContents(subrange);

    // 5. Append subfragment to clone.
    appendNode(subfragment, clone);
  }

  // 18. Return fragment.
  return fragment;

  function contained(node: Node): boolean {
    return isContained(node, range);
  }
}

/**
 * @see https://dom.spec.whatwg.org/#concept-range-extract
 */
export function extract(range: Range): globalThis.DocumentFragment {
  // 1. Let fragment be a new DocumentFragment node whose node document is range’s start node’s node document.
  const fragment = DocumentFragment["create"]({
    nodeDocument: $($(range).startNode).nodeDocument,
  });

  // 2. If range is collapsed, then return fragment.
  if ($(range).collapsed) return fragment;

  // 3. Let original start node, original start offset, original end node, and original end offset be range’s start node, start offset, end node, and end offset, respectively.
  const {
    startNode: originalStartNode,
    startOffset: originalStartOffset,
    endNode: originalEndNode,
    endOffset: originalEndOffset,
  } = $(range);

  // 4. If original start node is original end node and it is a CharacterData node, then:
  if (
    originalStartNode === originalEndNode &&
    isCharacterData(originalStartNode)
  ) {
    // 1. Let clone be a clone of original start node.
    // TODO(miyauci): use internal method
    const clone = originalStartNode.cloneNode() as CharacterData;

    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original end offset minus original start offset.
    const data = substringData(
      originalStartNode,
      originalStartOffset,
      originalEndOffset - originalStartOffset,
    );
    $(clone).data = data;

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
  while (tree.isInclusiveAncestor(commonAncestor, originalEndNode)) {
    const parent = tree.parent(commonAncestor);

    if (!parent) break;

    commonAncestor = parent;
  }

  // 7. Let first partially contained child be null.
  let firstPartiallyContainedChild: ChildNode | null = null;

  function partiallyContained(node: Node): boolean {
    return isPartiallyContained(node, range);
  }

  function contained(node: Node): boolean {
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
  let lastPartiallyContainedChild: ChildNode | null = null;

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

  let newNode: Node, newOffset: number;

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
    isCharacterData(firstPartiallyContainedChild)
  ) {
    // TODO use clone
    // 1. Let clone be a clone of original start node.
    const clone = originalStartNode.cloneNode();

    const data = substringData(
      originalStartNode as CharacterData,
      originalStartOffset,
      nodeLength(originalStartNode) - originalStartOffset,
    );
    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original start node’s length − original start offset.
    $(clone as CharacterData).data = data;

    // 3. Append clone to fragment.
    appendNode(clone, fragment);

    // 4. Replace data with node original start node, offset original start offset, count original start node’s length − original start offset, and data the empty string.
    replaceData(
      originalStartNode as CharacterData,
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
    $(subrange).start = [originalStartNode, originalStartOffset],
      $(subrange).end = [
        firstPartiallyContainedChild,
        nodeLength(firstPartiallyContainedChild),
      ];

    // 4. Let subfragment be the result of extracting subrange.
    const subfragment = extract(subrange);

    // 5. Append subfragment to clone.
    appendNode(subfragment, clone);
  }

  // 17. For each contained child in contained children, append contained child to fragment.
  for (const containedChild of containedChildren) {
    appendNode(containedChild, fragment);
  }

  // 18. If last partially contained child is a CharacterData node, then:
  if (
    lastPartiallyContainedChild && isCharacterData(lastPartiallyContainedChild)
  ) {
    // TODO use clone
    // 1. Let clone be a clone of original end node.
    const clone = originalEndNode.cloneNode();

    const data = substringData(
      originalEndNode as CharacterData,
      0,
      originalEndOffset,
    );
    // 2. Set the data of clone to the result of substringing data with node original end node, offset 0, and count original end offset.
    $(clone as CharacterData).data = data;

    // 3. Append clone to fragment.
    appendNode(clone, fragment);

    // 4. Replace data with node original end node, offset 0, count original end offset, and data the empty string.
    replaceData(originalEndNode as CharacterData, 0, originalEndOffset, "");

    // 19. Otherwise, if last partially contained child is not null:
  } else if (lastPartiallyContainedChild) {
    // TODO use clone
    // 1. Let clone be a clone of last partially contained child.
    const clone = lastPartiallyContainedChild.cloneNode();

    // 2. Append clone to fragment.
    appendNode(clone, fragment);

    // 3. Let subrange be a new live range whose start is (last partially contained child, 0) and whose end is (original end node, original end offset).
    const subrange = new Range();
    $(subrange).start = [lastPartiallyContainedChild, 0],
      $(subrange).end = [originalEndNode, originalEndOffset];

    // 4. Let subfragment be the result of extracting subrange.
    const subfragment = extract(subrange);

    // 5. Append subfragment to clone.
    appendNode(subfragment, clone);
  }

  // 20. Set range’s start and end to (new node, new offset).
  $(range).start = [newNode, newOffset], $(range).end = [newNode, newOffset];

  // 21. Return fragment.
  return fragment;
}

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-insert)
 */
export function insert(node: Node, range: Range): void {
  const { startNode } = $(range);

  // 1. If range’s start node is a ProcessingInstruction or Comment node, is a Text node whose parent is null, or is node, then throw a "HierarchyRequestError" DOMException.
  if (
    isProcessingInstruction(startNode) || isComment(startNode) ||
    (isText(startNode) && !tree.parent(startNode)) ||
    startNode === node
  ) throw new DOMException("<message>", DOMExceptionName.HierarchyRequestError);

  // 2. Let referenceNode be null.
  let referenceNode: Node | null = null;

  // 3. If range’s start node is a Text node, set referenceNode to that Text node.
  if (isText(startNode)) referenceNode = startNode;
  // 4. Otherwise, set referenceNode to the child of start node whose index is start offset, and null if there is no such child.
  else {referenceNode = tree.children(startNode)[$(range).startOffset] ??
      null;}

  // 5. Let parent be range’s start node if referenceNode is null, and referenceNode’s parent otherwise.
  const parent = !referenceNode ? startNode : tree.parent(referenceNode);

  if (!parent) return;

  // 6. Ensure pre-insertion validity of node into parent before referenceNode.
  ensurePreInsertionValidity(node, parent, referenceNode);

  // 7. If range’s start node is a Text node, set referenceNode to the result of splitting it with offset range’s start offset.
  if (isText(startNode)) {
    referenceNode = splitText(startNode, $(range).startOffset);
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
  if ($(range).collapsed) $(range).end = [parent, newOffset];
}

/**
 * @see https://dom.spec.whatwg.org/#concept-range-select
 */
export function select(node: Node, range: Range): void {
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
  $(range).start = [parent, index];

  // 5. Set range’s end to boundary point (parent, index plus 1).
  $(range).end = [parent, index + 1];
}
