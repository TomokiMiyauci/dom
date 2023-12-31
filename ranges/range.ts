import type { IRange } from "../interface.d.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { Const, constant } from "../_internals/webidl/idl.ts";
import { AbstractRange } from "./abstract_range.ts";
import { Position, position } from "./boundary_point.ts";
import {
  is$CharacterData,
  isDocument,
  isDocumentFragment,
  isDocumentType,
  isMyText,
  isText,
} from "../nodes/utils/type.ts";
import { DOMExceptionName } from "../_internals/webidl/exception.ts";
import { nodeLength } from "../nodes/utils/node_tree.ts";
import {
  substringCodeUnitByPositions,
  substringCodeUnitToEnd,
} from "../_internals/infra/string.ts";
import {
  convert,
  unsignedLong,
  unsignedShort,
} from "../_internals/webidl/types.ts";
import { Range_CSSOM } from "../_internals/cssom/range.ts";
import { Range_DOMParsing } from "../_internals/domparsing/range.ts";
import { tree } from "../internal.ts";
import {
  containedNodes,
  insert,
  isContained,
  root,
  select,
  setStartOrEnd,
} from "./utils/range.ts";
import { extractRange } from "./utils/extract_range.ts";
import { cloneContents } from "./utils/clone_contents.ts";
import { isCollapsed } from "./utils/abstract_range.ts";
import * as RangeUtils from "./utils/abstract_range.ts";
import { replaceData } from "../nodes/utils/character_data.ts";
import { iter } from "../deps.ts";
import {
  appendNode,
  removeNode,
  replaceAllNode,
} from "../nodes/utils/mutation.ts";
import { data, end, start } from "../symbol.ts";
import { $Document, $Node, BoundaryPoint } from "../i.ts";

@Range_CSSOM
@Range_DOMParsing
@Exposed("Window", "Range")
export class Range extends AbstractRange implements IRange {
  constructor() {
    super();

    // set this’s start and end to (current global object’s associated Document, 0).
    this[start] = [globalThis.document as $Document, 0],
      this[end] = [globalThis.document as $Document, 0];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-commonancestorcontainer
   */
  get commonAncestorContainer(): Node {
    // 1. Let container be start node.
    let container = RangeUtils.startNode(this);
    const endNode = RangeUtils.endNode(this);

    // 2. While container is not an inclusive ancestor of end node, let container be container’s parent.
    while (!tree.isInclusiveAncestor(container, endNode)) {
      const parent = tree.parent(container);

      if (!parent) break;

      container = parent;
    }

    // 3. Return container.
    return container;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setstart
   */
  @convert
  setStart(node: $Node, @unsignedLong offset: number): void {
    // set the start of this to boundary point (node, offset).
    setStartOrEnd("start", this, [node, offset]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setend
   */
  @convert
  setEnd(node: $Node, @unsignedLong offset: number): void {
    // set the end of this to boundary point (node, offset).
    setStartOrEnd("end", this, [node, offset]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setstartbefore
   */
  setStartBefore(node: $Node): void {
    // 1. Let parent be node’s parent.
    const parent = tree.parent(node);

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Set the start of this to boundary point (parent, node’s index).
    setStartOrEnd("start", this, [parent, tree.index(node)]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setstartafter
   */
  setStartAfter(node: $Node): void {
    // 1. Let parent be node’s parent.
    const parent = tree.parent(node);

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Set the start of this to boundary point (parent, node’s index plus 1).
    setStartOrEnd("start", this, [parent, tree.index(node) + 1]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setendbefore
   */
  setEndBefore(node: $Node): void {
    // 1. Let parent be node’s parent.
    const parent = tree.parent(node);

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Set the end of this to boundary point (parent, node’s index).
    setStartOrEnd("end", this, [parent, tree.index(node)]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setendafter
   */
  setEndAfter(node: $Node): void {
    // 1. Let parent be node’s parent.
    const parent = tree.parent(node);

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Set the end of this to boundary point (parent, node’s index plus 1).
    setStartOrEnd("end", this, [parent, tree.index(node) + 1]);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-collapse
   */
  collapse(toStart = false): void {
    // if toStart is true, set end to start; otherwise set start to end.
    if (toStart) this[end] = this[start];
    else this[start] = this[end];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-selectnode
   */
  selectNode(node: $Node): void {
    // select node within this.
    select(node, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-selectnodecontents
   */
  selectNodeContents(node: $Node): void {
    // 1. If node is a doctype, throw an "InvalidNodeTypeError" DOMException.
    if (isDocumentType(node)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 2. Let length be the length of node.
    const length = nodeLength(node);

    // 3. Set start to the boundary point (node, 0).
    this[start] = [node, 0];

    // 4. Set end to the boundary point (node, length).
    this[end] = [node, length];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-range-start_to_start)
   */
  @constant
  static readonly START_TO_START: 0;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-range-start_to_end)
   */
  @constant
  static readonly START_TO_END: 1;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-range-end_to_end)
   */
  @constant
  static readonly END_TO_END: 2;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-range-end_to_start)
   */
  @constant
  static readonly END_TO_START: 3;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-range-compareboundarypoints)
   */
  @convert
  compareBoundaryPoints(
    @unsignedShort how: number,
    sourceRange: Range,
  ): number {
    // 1. If how is not one of
    switch (how) {
      case Range.START_TO_START:
      case Range.START_TO_END:
      case Range.END_TO_START:
      case Range.END_TO_END:
        break;
        // If how is not one of
      default:
        // then throw a "NotSupportedError" DOMException.
        throw new DOMException("<message>", DOMExceptionName.NotSupportedError);
    }

    // 2. If this’s root is not the same as sourceRange’s root, then throw a "WrongDocumentError" DOMException.
    if (this.#root !== sourceRange.#root) {
      throw new DOMException("<message>", DOMExceptionName.WrongDocumentError);
    }

    // 3. If how is:
    const { point, otherPoint } = how === Range.START_TO_START
      ? { point: this[start], otherPoint: sourceRange[start] }
      : how === Range.START_TO_END
      ? { point: this[end], otherPoint: sourceRange[start] }
      : how === Range.END_TO_START
      ? { point: this[end], otherPoint: sourceRange[end] }
      : { point: this[start], otherPoint: sourceRange[end] };

    // 4. If the position of this point relative to other point is
    switch (position(point, otherPoint)) {
      case Position.Before:
        return -1;
      case Position.Equal:
        return 0;
      case Position.After:
        return 1;
    }
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-range-deletecontents)
   */
  deleteContents(): void {
    // 1. If this is collapsed, then return.
    if (isCollapsed(this)) return;

    // 2. Let original start node, original start offset, original end node, and original end offset be this’s start node, start offset, end node, and end offset, respectively.
    const originalStartNode = RangeUtils.startNode(this),
      originalStartOffset = RangeUtils.startOffset(this),
      originalEndNode = RangeUtils.endNode(this),
      originalEndOffset = RangeUtils.endOffset(this);

    // 3. If original start node is original end node and it is a CharacterData node,
    if (
      originalStartNode === originalEndNode &&
      is$CharacterData(originalStartNode)
    ) {
      // then replace data with node original start node, offset original start offset, count original end offset minus original start offset, and data the empty string,
      replaceData(
        originalStartNode,
        originalStartOffset,
        originalEndOffset - originalStartOffset,
        "",
      );
      // and then return.
      return;
    }

    const nodeParentIsNotContained = (node: $Node): boolean => {
      const parent = tree.parent(node);

      return !!parent && !isContained(parent, this);
    };
    // 4. Let nodes to remove be a list of all the nodes that are contained in this, in tree order, omitting any node whose parent is also contained in this.
    const nodesToRemove = iter(containedNodes(this)).filter(
      nodeParentIsNotContained,
    );

    let newNode: $Node, newOffset: number;

    // 5. If original start node is an inclusive ancestor of original end node, set new node to original start node and new offset to original start offset.
    if (tree.isInclusiveAncestor(originalStartNode, originalEndNode)) {
      newNode = originalStartNode, newOffset = originalStartOffset;

      // 6. Otherwise:
    } else {
      // 1. Let reference node equal original start node.
      let referenceNode = originalStartNode;

      do {
        const parent = tree.parent(referenceNode);

        // reference node’s parent is not null and is not an inclusive ancestor of original end node,
        if (parent && !tree.isInclusiveAncestor(parent, originalEndNode)) {
          // set reference node to its parent.
          referenceNode = parent;
        } else break;
        // 2. While
      } while (true);

      // 3. Set new node to the parent of reference node, and new offset to one plus the index of reference node.
      newNode = tree.parent(referenceNode)!,
        newOffset = 1 + tree.index(referenceNode);
    }

    // 7. If original start node is a CharacterData node,
    if (is$CharacterData(originalStartNode)) {
      // then replace data with node original start node, offset original start offset, count original start node’s length − original start offset, data the empty string.
      replaceData(
        originalStartNode,
        originalStartOffset,
        nodeLength(originalStartNode) - originalStartOffset,
        "",
      );
    }

    // 8. For each node in nodes to remove, in tree order, remove node.
    for (const node of nodesToRemove) removeNode(node);

    // 9. If original end node is a CharacterData node,
    if (is$CharacterData(originalEndNode)) {
      // then replace data with node original end node, offset 0, count original end offset and data the empty string.
      replaceData(originalEndNode, 0, originalEndOffset, "");
    }

    // 10. Set start and end to (new node, new offset).
    this[start] = [newNode, newOffset], this[end] = [newNode, newOffset];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-extractcontents
   */
  extractContents(): DocumentFragment {
    // return the result of extracting this.
    return extractRange(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-clonecontents
   */
  cloneContents(): DocumentFragment {
    // return the result of cloning the contents of this.
    return cloneContents(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-insertnode
   */
  insertNode(node: $Node): void {
    // insert node into this.
    insert(node, this);
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#dom-range-surroundcontents)
   */
  surroundContents(newParent: $Node): void {
    // 1. If a non-Text node is partially contained in this, then throw an "InvalidStateError" DOMException.

    // 2. If newParent is a Document, DocumentType, or DocumentFragment node, then throw an "InvalidNodeTypeError" DOMException.
    if (
      isDocument(newParent) ||
      isDocumentType(newParent) ||
      isDocumentFragment(newParent)
    ) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Let fragment be the result of extracting this.
    const fragment = extractRange(this);

    // 4. If newParent has children, then replace all with null within newParent.
    if (fragment.hasChildNodes()) replaceAllNode(null, newParent);

    // 5. Insert newParent into this.
    insert(newParent, this);

    // 6. Append fragment to newParent.
    appendNode(fragment, newParent);

    // 7. Select newParent within this.
    select(newParent, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-clonerange
   */
  cloneRange(): Range {
    const range = new Range();
    range[start] = this[start], range[end] = this[end];

    // return a new live range with the same start and end as this.
    return range;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-detach
   */
  detach(): void {
    // do nothing.
  }

  @convert
  isPointInRange(node: $Node, @unsignedLong offset: number): boolean {
    // 1. If node’s root is different from this’s root, return false.
    if (tree.root(node) !== this.#root) return false;

    // 2. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
    if (isDocumentType(node)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. If offset is greater than node’s length, then throw an "IndexSizeError" DOMException.
    if (offset > nodeLength(node)) {
      throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
    }

    const bp: BoundaryPoint = [node, offset];
    // 4. If (node, offset) is before start or after end, return false.
    if (
      position(bp, this[start]) === Position.Before ||
      position(bp, this[end]) === Position.After
    ) return false;

    // 5. Return true.
    return true;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-comparepoint
   */
  @convert
  comparePoint(node: $Node, @unsignedLong offset: number): number {
    // 1. If node’s root is different from this’s root, then throw a "WrongDocumentError" DOMException.
    if (tree.root(node) !== this.#root) {
      throw new DOMException("<message>", DOMExceptionName.WrongDocumentError);
    }

    // 2. If node is a doctype, then throw an "InvalidNodeTypeError" DOMException.
    if (isDocumentType(node)) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. If offset is greater than node’s length, then throw an "IndexSizeError" DOMException.
    if (offset > nodeLength(node)) {
      throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
    }

    const bp: BoundaryPoint = [node, offset];

    // 4. If (node, offset) is before start, return −1.
    if (position(bp, this[start]) === Position.Before) return -1;

    // 5. If (node, offset) is after end, return 1.
    if (position(bp, this[end]) === Position.After) return 1;

    // 6. Return 0.
    return 0;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-intersectsnode
   */
  intersectsNode(node: $Node): boolean {
    // 1. If node’s root is different from this’s root, return false.
    if (tree.root(node) !== this.#root) return false;

    // 2. Let parent be node’s parent.
    const parent = tree.parent(node);

    // 3. If parent is null, return true.
    if (!parent) return true;

    // 4. Let offset be node’s index.
    const offset = tree.index(node);
    const startBp: BoundaryPoint = [parent, offset];
    const endBp: BoundaryPoint = [parent, offset + 1];

    // 5. If (parent, offset) is before end and (parent, offset plus 1) is after start, return true.
    if (
      position(startBp, this[end]) === Position.Before &&
      position(endBp, this[start]) === Position.After
    ) return true;

    // 6. Return false.
    return false;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-stringifier
   */
  override toString(): string {
    // 1. Let s be the empty string.
    let s = "";

    const startNode = RangeUtils.startNode(this),
      endNode = RangeUtils.endNode(this),
      startOffset = RangeUtils.startOffset(this),
      endOffset = RangeUtils.endOffset(this);

    // 2. If this’s start node is this’s end node and it is a Text node, then return the substring of that Text node’s data beginning at this’s start offset and ending at this’s end offset.
    if (startNode === endNode && isMyText(startNode)) {
      return substringCodeUnitByPositions(
        startNode[data],
        startOffset,
        endOffset,
      );
    }

    // 3. If this’s start node is a Text node, then append the substring of that node’s data from this’s start offset until the end to s.
    if (isMyText(startNode)) {
      s += substringCodeUnitToEnd(startNode[data], startOffset);
    }

    // @see https://github.com/capricorn86/happy-dom/blob/61dd11d4887fec939f16bdf09a2e693f7ceffdb9/packages/happy-dom/src/range/Range.ts#L1034C3-L1046
    // TODO(miyauci): Follow spec
    let currentNode: $Node | null = startNode;
    const end = tree.nextDescendant(endNode);

    while (currentNode && currentNode !== end) {
      if (isText(currentNode) && this.#contained(currentNode)) {
        // 4. Append the concatenation of the data of all Text nodes that are contained in this, in tree order, to s.
        s += currentNode.data;
      }

      currentNode = tree.follow(currentNode);
    }

    // 5. If this’s end node is a Text node, then append the substring of that node’s data from its start until this’s end offset to s.
    if (isMyText(endNode)) {
      s += substringCodeUnitByPositions(endNode[data], 0, endOffset);
    }

    // 6. Return s.
    return s;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-range-root
   */
  get #root(): Node {
    return root(this);
  }

  #contained(node: $Node): boolean {
    return isContained(node, this);
  }

  [start]: BoundaryPoint;
  [end]: BoundaryPoint;
}

export interface Range
  extends
    Const<"START_TO_START", 0>,
    Const<"START_TO_END", 1>,
    Const<"END_TO_END", 2>,
    Const<"END_TO_START", 3>,
    Range_CSSOM,
    Range_DOMParsing {}
