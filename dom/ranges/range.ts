import type { Node } from "../nodes/node.ts";
import type { CharacterData } from "../nodes/character_data.ts";
import type { Document } from "../nodes/documents/document.ts";
import type { IRange } from "../../interface.d.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";
import { Const, constant } from "../../webidl/idl.ts";
import {
  getFollow,
  getIndex,
  getNextSibling,
  getRoot,
  isInclusiveAncestorOf,
} from "../trees/tree.ts";
import { AbstractRange } from "./abstract_range.ts";
import { BoundaryPoint, Position } from "./boundary_point.ts";
import { isCharacterData, isDocumentType, isText } from "../nodes/utils.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { DocumentFragment } from "../nodes/document_fragment.ts";
import { nodeLength } from "../nodes/node_trees/node_tree.ts";
import { $create, $data, $nodeDocument } from "../nodes/internal.ts";
import { substringData } from "../nodes/character_data.ts";
import { appendNode } from "../nodes/mutation.ts";
import { replaceData } from "../nodes/character_data_algorithm.ts";
import {
  substringCodeUnitByPositions,
  substringCodeUnitToEnd,
} from "../../infra/string.ts";
import { convert, unsignedLong, unsignedShort } from "../../webidl/types.ts";

Exposed(Window);
export class Range extends AbstractRange implements IRange {
  createContextualFragment(fragment: string): DocumentFragment {
    throw new Error("createContextualFragment");
  }

  getClientRects(): DOMRectList {
    throw new Error("getClientRects");
  }

  getBoundingClientRect(): DOMRect {
    throw new Error("getBoundingClientRect");
  }

  protected override start: BoundaryPoint;
  protected override end: BoundaryPoint;

  constructor() {
    super();

    // set this’s start and end to (current global object’s associated Document, 0).
    this.start = new BoundaryPoint({
      node: globalThis.document as Document,
      offset: 0,
    });
    this.end = new BoundaryPoint({
      node: globalThis.document as Document,
      offset: 0,
    });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-commonancestorcontainer
   */
  get commonAncestorContainer(): Node {
    // 1. Let container be start node.
    let container = this.start[0];
    const endNode = this.end[0];

    // 2. While container is not an inclusive ancestor of end node, let container be container’s parent.
    while (!isInclusiveAncestorOf(container, endNode)) {
      const parent = container._parent;

      if (!parent) break;

      container = parent;
    }

    // 3. Return container.
    return container;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setstart
   */
  setStart(node: Node, offset: number): void {
    // set the start of this to boundary point (node, offset).
    this.#setStartOrEnd("start", this, new BoundaryPoint({ node, offset }));
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setend
   */
  setEnd(node: Node, offset: number): void {
    // set the end of this to boundary point (node, offset).
    this.#setStartOrEnd("end", this, new BoundaryPoint({ node, offset }));
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setstartbefore
   */
  setStartBefore(node: Node): void {
    // 1. Let parent be node’s parent.
    const parent = node._parent;

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Set the start of this to boundary point (parent, node’s index).
    this.#setStartOrEnd(
      "start",
      this,
      new BoundaryPoint({ node: parent, offset: getIndex(node) }),
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setstartafter
   */
  setStartAfter(node: Node): void {
    // 1. Let parent be node’s parent.
    const parent = node._parent;

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Set the start of this to boundary point (parent, node’s index plus 1).
    this.#setStartOrEnd(
      "start",
      this,
      new BoundaryPoint({ node: parent, offset: getIndex(node) + 1 }),
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setendbefore
   */
  setEndBefore(node: Node): void {
    // 1. Let parent be node’s parent.
    const parent = node._parent;

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Set the end of this to boundary point (parent, node’s index).
    this.#setStartOrEnd(
      "end",
      this,
      new BoundaryPoint({ node: parent, offset: getIndex(node) }),
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-setendafter
   */
  setEndAfter(node: Node): void {
    // 1. Let parent be node’s parent.
    const parent = node._parent;

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Set the end of this to boundary point (parent, node’s index plus 1).
    this.#setStartOrEnd(
      "end",
      this,
      new BoundaryPoint({ node: parent, offset: getIndex(node) + 1 }),
    );
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-collapse
   */
  collapse(toStart?: boolean): void {
    // if toStart is true, set end to start; otherwise set start to end.
    if (toStart) this.end = this.start;
    else this.start = this.end;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-range-select
   */
  #select(node: Node, range: Range): void {
    // 1. Let parent be node’s parent.
    const parent = node._parent;

    // 2. If parent is null, then throw an "InvalidNodeTypeError" DOMException.
    if (!parent) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    // 3. Let index be node’s index.
    const index = getIndex(node);

    // 4. Set range’s start to boundary point (parent, index).
    range.start = new BoundaryPoint({ node: parent, offset: index });

    // 5. Set range’s end to boundary point (parent, index plus 1).
    range.end = new BoundaryPoint({ node: parent, offset: index + 1 });
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-selectnode
   */
  selectNode(node: Node): void {
    // select node within this.
    this.#select(node, this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-selectnodecontents
   */
  selectNodeContents(node: Node): void {
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
    this.start = new BoundaryPoint({ node, offset: 0 });

    // 4. Set end to the boundary point (node, length).
    this.end = new BoundaryPoint({ node, offset: length });
  }

  @constant
  static readonly START_TO_START: 0;

  @constant
  static readonly START_TO_END: 1;

  @constant
  static readonly END_TO_END: 2;

  @constant
  static readonly END_TO_START: 3;

  @convert
  compareBoundaryPoints(
    @unsignedShort how: number,
    sourceRange: Range,
  ): number {
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

    if (this.#root !== sourceRange.#root) {
      throw new DOMException("<message>", DOMExceptionName.WrongDocumentError);
    }

    const { point, otherPoint } = how === Range.START_TO_START
      ? { point: this.start, otherPoint: sourceRange.start }
      : how === Range.START_TO_END
      ? { point: this.end, otherPoint: sourceRange.start }
      : how === Range.END_TO_START
      ? { point: this.end, otherPoint: sourceRange.end }
      : { point: this.start, otherPoint: sourceRange.end };

    const position = point.positionOf(otherPoint);

    switch (position) {
      case Position.Before:
        return -1;
      case Position.Equal:
        return 0;
      case Position.After:
        return 1;
    }
  }

  deleteContents(): void {
    throw new Error("deleteContents");
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-range-extract
   */
  private extract(range: Range): DocumentFragment {
    // 1. Let fragment be a new DocumentFragment node whose node document is range’s start node’s node document.
    const fragment = DocumentFragment[$create]({
      nodeDocument: range.start[0][$nodeDocument],
    });

    // 2. If range is collapsed, then return fragment.
    if (range["isCollapsed"]) return fragment;

    // 3. Let original start node, original start offset, original end node, and original end offset be range’s start node, start offset, end node, and end offset, respectively.
    const originalStartNode = range.start[0],
      originalStartOffset = range.start[1],
      originalEndNode = range.end[0],
      originalEndOffset = range.end[1];

    // 4. If original start node is original end node and it is a CharacterData node, then:
    if (
      originalStartNode === originalEndNode &&
      isCharacterData(originalStartNode)
    ) {
      // 1. Let clone be a clone of original start node.
      // TODO(miyauci): use internal method
      const clone = originalStartNode.cloneNode() as never as CharacterData;

      // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original end offset minus original start offset.
      const data = substringData(
        originalStartNode,
        originalStartOffset,
        originalEndOffset - originalStartOffset,
      );
      clone[$data] = data;

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
    while (isInclusiveAncestorOf(commonAncestor, originalEndNode)) {
      const parent = commonAncestor._parent;

      if (!parent) break;

      commonAncestor = parent;
    }

    // 7. Let first partially contained child be null.
    let firstPartiallyContainedChild = null;

    // 8. If original start node is not an inclusive ancestor of original end node, set first partially contained child to the first child of common ancestor that is partially contained in range.
    if (isInclusiveAncestorOf(originalStartNode, originalEndNode)) {}

    // 9. Let last partially contained child be null.
    let lastPartiallyContainedChild = null;

    // 10. If original end node is not an inclusive ancestor of original start node, set last partially contained child to the last child of common ancestor that is partially contained in range.

    // 11. Let contained children be a list of all children of common ancestor that are contained in range, in tree order.

    // 12. If any member of contained children is a doctype, then throw a "HierarchyRequestError" DOMException.

    // 13. If original start node is an inclusive ancestor of original end node, set new node to original start node and new offset to original start offset.

    // 14. Otherwise:
    // 1. Let reference node equal original start node.
    // 2. While reference node’s parent is not null and is not an inclusive ancestor of original end node, set reference node to its parent.
    // 3. Set new node to the parent of reference node, and new offset to one plus reference node’s index.

    // 15. If first partially contained child is a CharacterData node, then:
    if (isCharacterData(firstPartiallyContainedChild as any)) {
      // 1. Let clone be a clone of original start node.

      // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original start node’s length − original start offset.

      // 3. Append clone to fragment.

      // 4. Replace data with node original start node, offset original start offset, count original start node’s length − original start offset, and data the empty string.
    }

    // 16. Otherwise, if first partially contained child is not null:
    // 1. Let clone be a clone of first partially contained child.
    // 2. Append clone to fragment.
    // 3. Let subrange be a new live range whose start is (original start node, original start offset) and whose end is (first partially contained child, first partially contained child’s length).
    // 4. Let subfragment be the result of extracting subrange.
    // 5. Append subfragment to clone.

    // 17. For each contained child in contained children, append contained child to fragment.
    // 18. If last partially contained child is a CharacterData node, then:

    // 1. Let clone be a clone of original end node.
    // 2. Set the data of clone to the result of substringing data with node original end node, offset 0, and count original end offset.
    // 3. Append clone to fragment.
    // 4. Replace data with node original end node, offset 0, count original end offset, and data the empty string.
    // 19. Otherwise, if last partially contained child is not null:
    // 1. Let clone be a clone of last partially contained child.
    // 2. Append clone to fragment.
    // 3. Let subrange be a new live range whose start is (last partially contained child, 0) and whose end is (original end node, original end offset).
    // 4. Let subfragment be the result of extracting subrange.
    // 5. Append subfragment to clone.

    // 20. Set range’s start and end to (new node, new offset).
    // 21. Return fragment.
    return fragment;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-extractcontents
   */
  extractContents(): DocumentFragment {
    // return the result of extracting this.
    return this.extract(this);
  }

  #cloneContents(range: Range): DocumentFragment {
    throw new Error("cloneContents");
    // 1. Let fragment be a new DocumentFragment node whose node document is range’s start node’s node document.

    // 2. If range is collapsed, then return fragment.

    // 3. Let original start node, original start offset, original end node, and original end offset be range’s start node, start offset, end node, and end offset, respectively.
    // 4. If original start node is original end node and it is a CharacterData node, then:

    // 1. Let clone be a clone of original start node.
    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original end offset minus original start offset.
    // 3. Append clone to fragment.
    // 4. Return fragment.

    // 5. Let common ancestor be original start node.
    // 6. While common ancestor is not an inclusive ancestor of original end node, set common ancestor to its own parent.
    // 7. Let first partially contained child be null.
    // 8. If original start node is not an inclusive ancestor of original end node, set first partially contained child to the first child of common ancestor that is partially contained in range.
    // 9. Let last partially contained child be null.
    // 10. If original end node is not an inclusive ancestor of original start node, set last partially contained child to the last child of common ancestor that is partially contained in range.
    // 11. Let contained children be a list of all children of common ancestor that are contained in range, in tree order.
    // 12. If any member of contained children is a doctype, then throw a "HierarchyRequestError" DOMException.

    // 13. If first partially contained child is a CharacterData node, then:

    // 1. Let clone be a clone of original start node.
    // 2. Set the data of clone to the result of substringing data with node original start node, offset original start offset, and count original start node’s length − original start offset.
    // 3. Append clone to fragment.

    // 14. Otherwise, if first partially contained child is not null:

    // 1. Let clone be a clone of first partially contained child.
    // 2. Append clone to fragment.
    // 3. Let subrange be a new live range whose start is (original start node, original start offset) and whose end is (first partially contained child, first partially contained child’s length).
    // 4. Let subfragment be the result of cloning the contents of subrange.
    // 5. Append subfragment to clone.

    // 15. For each contained child in contained children:
    // 1. Let clone be a clone of contained child with the clone children flag set.
    // 2. Append clone to fragment.

    // 16. If last partially contained child is a CharacterData node, then:

    // 1. Let clone be a clone of original end node.
    // 2. Set the data of clone to the result of substringing data with node original end node, offset 0, and count original end offset.
    // 3. Append clone to fragment.

    // 17. Otherwise, if last partially contained child is not null:
    // 1. Let clone be a clone of last partially contained child.
    // 2. Append clone to fragment.
    // 3. Let subrange be a new live range whose start is (last partially contained child, 0) and whose end is (original end node, original end offset).
    // 4. Let subfragment be the result of cloning the contents of subrange.
    // 5. Append subfragment to clone.

    // 18. Return fragment.
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-clonecontents
   */
  cloneContents(): DocumentFragment {
    // return the result of cloning the contents of this.
    return this.#cloneContents(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-range-insert
   */
  #insert(node: Node, range: Range): void {
    throw new Error("insert");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-insertnode
   */
  insertNode(node: Node): void {
    // insert node into this.
    this.#insert(node, this);
  }

  surroundContents(newParent: Node): void {
    throw new Error("surroundContents");
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-clonerange
   */
  cloneRange(): Range {
    const range = new Range();
    range.start = this.start, range.end = this.end;

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
  isPointInRange(node: Node, @unsignedLong offset: number): boolean {
    // 1. If node’s root is different from this’s root, return false.
    if (getRoot(node) !== this.#root) return false;

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

    const bp = new BoundaryPoint({ node, offset });
    // 4. If (node, offset) is before start or after end, return false.
    if (
      bp.positionOf(this.start) === Position.Before ||
      bp.positionOf(this.end) === Position.After
    ) return false;

    // 5. Return true.
    return true;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-comparepoint
   */
  @convert
  comparePoint(node: Node, @unsignedLong offset: number): number {
    // 1. If node’s root is different from this’s root, then throw a "WrongDocumentError" DOMException.
    if (getRoot(node) !== this.#root) {
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

    const bp = new BoundaryPoint({ node, offset });

    // 4. If (node, offset) is before start, return −1.
    if (bp.positionOf(this.start) === Position.Before) return -1;

    // 5. If (node, offset) is after end, return 1.
    if (bp.positionOf(this.end) === Position.After) return 1;

    // 6. Return 0.
    return 0;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-intersectsnode
   */
  intersectsNode(node: Node): boolean {
    console.log(node);
    // 1. If node’s root is different from this’s root, return false.
    if (getRoot(node) !== this.#root) return false;

    // 2. Let parent be node’s parent.
    const parent = node._parent;

    // 3. If parent is null, return true.
    if (!parent) return true;

    // 4. Let offset be node’s index.
    const offset = getIndex(node);
    const startBp = new BoundaryPoint({ node: parent, offset });
    const endBp = new BoundaryPoint({ node: parent, offset: offset + 1 });

    // 5. If (parent, offset) is before end and (parent, offset plus 1) is after start, return true.
    if (
      startBp.positionOf(this.end) === Position.Before &&
      endBp.positionOf(this.start) === Position.After
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

    const startNode = this.start[0],
      endNode = this.end[0],
      startOffset = this.start[1],
      endOffset = this.end[1];

    // 2. If this’s start node is this’s end node and it is a Text node, then return the substring of that Text node’s data beginning at this’s start offset and ending at this’s end offset.
    if (startNode === endNode && isText(startNode)) {
      return substringCodeUnitByPositions(
        startNode[$data],
        startOffset,
        endOffset,
      );
    }

    // 3. If this’s start node is a Text node, then append the substring of that node’s data from this’s start offset until the end to s.
    if (isText(startNode)) {
      s += substringCodeUnitToEnd(startNode[$data], startOffset);
    }

    // @see https://github.com/capricorn86/happy-dom/blob/61dd11d4887fec939f16bdf09a2e693f7ceffdb9/packages/happy-dom/src/range/Range.ts#L1034C3-L1046
    // TODO(miyauci): Follow spec
    let currentNode: Node | null = startNode;
    const end = nextNodeDescendant(endNode);

    while (currentNode && currentNode !== end) {
      if (isText(currentNode) && this.#contained(currentNode, this)) {
        // 4. Append the concatenation of the data of all Text nodes that are contained in this, in tree order, to s.
        s += currentNode.data;
      }

      currentNode = getFollow(currentNode) as Node | null;
    }

    // 5. If this’s end node is a Text node, then append the substring of that node’s data from its start until this’s end offset to s.
    if (isText(endNode)) {
      s += substringCodeUnitByPositions(endNode[$data], 0, endOffset);
    }

    // 6. Return s.
    return s;
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-range-bp-set
   */
  #setStartOrEnd(
    step: "start" | "end",
    range: Range,
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
    const bp = new BoundaryPoint({ node, offset });

    // 4.
    switch (step) {
      // If these steps were invoked as "set the start"
      case "start": {
        // If range’s root is not equal to node’s root, or if bp is after the range’s end, set range’s end to bp.
        if (
          range.#root !== getRoot(node) ||
          bp.positionOf(range.end) === Position.After
        ) range.end = bp;

        // 2. Set range’s start to bp.
        range.start = bp;
        break;
      }

      // If these steps were invoked as "set the end"
      case "end": {
        // 1. If range’s root is not equal to node’s root, or if bp is before the range’s start, set range’s start to bp.
        if (
          range.#root !== getRoot(node) ||
          bp.positionOf(range.start) === Position.Before
        ) range.start = bp;

        // 2. Set range’s end to bp.
        range.end = bp;
      }
    }
  }

  /**
   * @see https://dom.spec.whatwg.org/#concept-range-root
   */
  get #root(): Node {
    const startNode = this.start[0];

    // the root of its start node.
    return getRoot(startNode);
  }

  #contained(node: Node, range: Range): boolean {
    return getRoot(node) === range.#root &&
      new BoundaryPoint({ node, offset: 0 }).positionOf(range.start) ===
        Position.After &&
      new BoundaryPoint({ node, offset: nodeLength(node) }).positionOf(
          range.end,
        ) === Position.Before;
  }
}

function nextNodeDescendant(node: Node | null): Node | null {
  while (node && getNextSibling(node)) {
    node = node._parent;
  }

  if (!node) return null;

  return getNextSibling(node);
}

export interface Range
  extends
    Const<"START_TO_START", 0>,
    Const<"START_TO_END", 1>,
    Const<"END_TO_END", 2>,
    Const<"END_TO_START", 3> {}
