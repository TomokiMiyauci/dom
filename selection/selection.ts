import type { ISelection } from "../interface.d.ts";
import { Exposed } from "../webidl/extended_attribute.ts";
import { convert, DOMString, unsignedLong } from "../webidl/types.ts";
import { $, internalSlots, tree } from "../internal.ts";
import {
  BoundaryPoint,
  Position,
  position,
} from "../dom/ranges/boundary_point.ts";
import { DOMExceptionName } from "../webidl/exception.ts";
import { nodeLength } from "../dom/nodes/node_trees/node_tree.ts";
import { root, setStartOrEnd } from "../dom/ranges/range_utils.ts";
import { Range } from "../dom/ranges/range.ts";

@Exposed(Window)
export class Selection implements ISelection {
  constructor() {
    const internal = new SelectionInternals();

    internalSlots.extends<Selection>(this, internal);
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-anchornode)
   */
  get anchorNode(): Node | null {
    return this.#_.anchor?.[0] ?? null;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-anchoroffset)
   */
  get anchorOffset(): number {
    return this.#_.anchor?.[1] ?? 0;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-focusnode)
   */
  get focusNode(): Node | null {
    return this.#_.focus?.[0] ?? null;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-focusoffset)
   */
  get focusOffset(): number {
    return this.#_.focus?.[1] ?? 0;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-iscollapsed)
   */
  get isCollapsed(): boolean {
    const { anchor, focus } = this.#_;

    return anchor === focus;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-rangecount)
   */
  get rangeCount(): 0 | 1 {
    return this.#isEmpty ? 0 : 1;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-iscollapsed)
   */
  get type(): string {
    if (this.#isEmpty) return "None";
    else if (this.#_.range!.collapsed) return "Caret";
    else return "Range";
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-getrangeat)
   */
  @convert
  getRangeAt(@unsignedLong index: number): globalThis.Range {
    const { range } = this.#_;
    if (index !== 0 || this.#isEmpty || !range) {
      throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
    }

    return range;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-addrange)
   */
  addRange(range: Range): void {
    // 1. If the root of the range's boundary points are not the document associated with this, abort these steps.
    // TODO

    // 2. If rangeCount is not 0, abort these steps.
    if (this.rangeCount !== 0) return;

    // 3. Set this's range to range by a strong reference (not by making a copy).
    this.#_.range = range;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-removerange)
   */
  removeRange(range: Range): void {
    if (range !== this.#_.range) {
      throw new DOMException("<message>", DOMExceptionName.NotFoundError);
    }

    this.#makeEmpty();
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-removeallranges)
   */
  removeAllRanges(): void {
    this.#makeEmpty();
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-empty)
   */
  empty(): void {
    this.removeAllRanges();
  }

  /**
   * @throws {DOMException}
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-collapse)
   */
  @convert
  collapse(node: Node | null, @unsignedLong offset = 0): void {
    // 1. If node is null, this method must behave identically as removeAllRanges() and abort these steps.
    if (node === null) {
      this.removeAllRanges();
      return;
    }

    // 2. The method must throw an IndexSizeError exception if offset is longer than node's length and abort these steps.
    if (offset > nodeLength(node)) {
      throw new DOMException("<message>", DOMExceptionName.IndexSizeError);
    }

    // 3. If document associated with this is not a shadow-including inclusive ancestor of node, abort these steps.
    // TODO

    // 4. Otherwise, let newRange be a new range.
    const newRange = new Range();

    // 5. Set the start the start and the end of newRange to (node, offset).
    setStartOrEnd("start", newRange, [node, offset]),
      setStartOrEnd("end", newRange, [node, offset]);

    // 6 Set this's range to newRange.
    this.#_.range = newRange;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-setposition)
   */
  @convert
  setPosition(node: Node | null, @unsignedLong offset = 0): void {
    // be an alias, and behave identically, to collapse().
    this.collapse(node, offset);
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-collapsetostart)
   */
  collapseToStart(): void {
    // The method must throw InvalidStateError exception if the this is empty.
    if (this.#isEmpty) {
      throw new DOMException("<message>", DOMExceptionName.InvalidStateError);
    }

    // Otherwise, it must create a new range,
    const newRange = new Range();
    const { start } = $(this.#_.range!);

    // set the start both its start and end to the start of this's range,
    setStartOrEnd("start", newRange, start),
      setStartOrEnd("end", newRange, start);

    // and then set this's range to the newly-created range.
    this.#_.range = newRange;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-collapsetoend)
   */
  collapseToEnd(): void {
    // The method must throw InvalidStateError exception if the this is empty.
    if (this.#isEmpty) {
      throw new DOMException("<message>", DOMExceptionName.InvalidStateError);
    }

    // Otherwise, it must create a new range,
    const newRange = new Range();
    const { end } = $(this.#_.range!);

    // set the start both its start and end to the end of this's range,
    setStartOrEnd("start", newRange, end), setStartOrEnd("end", newRange, end);

    // and then set this's range to the newly-created range.
    this.#_.range = newRange;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-extend)
   */
  extend(node: Node, @unsignedLong offset = 0): void {
    // 1. If the document associated with this is not a shadow-including inclusive ancestor of node, abort these steps.
    // if (nodeRoot(node) !== implForWrapper(this._globalObject._document)) {
    //   return;
    // }

    // 2. If this is empty, throw an InvalidStateError exception and abort these steps.
    if (this.#isEmpty) {
      throw new DOMException("<message>", DOMExceptionName.InvalidStateError);
    }

    // 3. Let oldAnchor and oldFocus be the this's anchor and focus, and let newFocus be the boundary point (node, offset).
    const oldAnchor = this.#_.anchor!,
      oldFocus = this.#_.focus,
      newFocus: BoundaryPoint = [node, offset];

    // 4. Let newRange be a new range.
    const newRange = new Range();

    // 5. If node's root is not the same as the this's range's root,
    if (tree.root(node) !== root(this.#_.range!)) {
      // set the start newRange's start and end to newFocus.
      setStartOrEnd("start", newRange, newFocus),
        setStartOrEnd("end", newRange, newFocus);

      // 6. Otherwise, if oldAnchor is before or equal to newFocus,
    } else if (position(oldAnchor, newFocus) !== Position.After) {
      // set the start newRange's start to oldAnchor, then set its end to newFocus.
      setStartOrEnd("start", newRange, oldAnchor), $(newRange).end = newFocus;
    } else {
      // 7. Otherwise, set the start newRange's start to newFocus, then set its end to oldAnchor.
      setStartOrEnd("start", newRange, newFocus), $(newRange).end = oldAnchor;
    }

    // 8. Set this's range to newRange.
    this.#_.range = newRange;

    // 9. If newFocus is before oldAnchor, set this's direction to backwards. Otherwise, set it to forwards.
    this.#_.direction = position(newFocus, oldAnchor) === Position.Before
      ? Direction.Backwards
      : Direction.Forwards;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-setbaseandextent)
   */
  @convert
  setBaseAndExtent(
    anchorNode: Node,
    @unsignedLong anchorOffset: number,
    focusNode: Node,
    @unsignedLong focusOffset: number,
  ): void {
    // 1. If anchorOffset is longer than anchorNode's length or if focusOffset is longer than focusNode's length, throw an IndexSizeError exception and abort these steps.
    if (
      anchorOffset > nodeLength(anchorNode) ||
      focusOffset > nodeLength(focusNode)
    ) throw new DOMException("<message>", DOMExceptionName.IndexSizeError);

    // 2. If document associated with this is not a shadow-including inclusive ancestor of anchorNode or focusNode, abort these steps.
    // TODO

    // 3. Let anchor be the boundary point (anchorNode, anchorOffset) and let focus be the boundary point (focusNode, focusOffset).
    const anchor: BoundaryPoint = [anchorNode, anchorOffset],
      focus: BoundaryPoint = [focusNode, focusOffset];

    // 4. Let newRange be a new range.
    const newRange = new Range();

    // 5. If anchor is before focus, set the start the newRange's start to anchor and its end to focus. Otherwise, set the start them to focus and anchor respectively.
    if (position(anchor, focus) === Position.Before) {
      setStartOrEnd("start", newRange, anchor), $(newRange).end = focus;
    } else {
      setStartOrEnd("start", newRange, focus), $(newRange).end = anchor;
    }

    // 6. Set this's range to newRange.
    this.#_.range = newRange;

    // 7. If focus is before anchor, set this's direction to backwards. Otherwise, set it to forwards
    this.#_.direction = position(focus, anchor) === Position.Before
      ? Direction.Backwards
      : Direction.Forwards;
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-selectallchildren)
   */
  selectAllChildren(node: Node): void {
    // 1. If node's root is not the document associated with this, abort these steps.
    // TODO

    // 2. Let newRange be a new range and childCount be the number of children of node.
    const newRange = new Range(), childCount = tree.children(node).size;

    // 3. Set newRange's start to (node, 0).
    $(newRange).start = [node, 0];

    // 4. Set newRange's end to (node, childCount).
    $(newRange).end = [node, childCount];

    // 5. Set this's range to newRange.
    this.#_.range = newRange;

    // 6. Set this's direction to forwards.
    this.#_.direction = Direction.Forwards;
  }

  /**
   * @see [Selection API]()
   */
  @convert
  modify(
    @DOMString alter?: string,
    @DOMString direction?: string,
    @DOMString granularity?: string,
  ): void {
  }

  /**
   * @see [Selection API](https://w3c.github.io/selection-api/#dom-selection-deletefromdocument)
   */
  deleteFromDocument(): void {
    // The method must invoke deleteContents() on this's range if this is not empty and both focus and anchor are in the document tree. Otherwise the method must do nothing.
    if (!this.#isEmpty) this.#_.range!.deleteContents();
  }

  /**
   * @see [Selection API]()
   */
  containsNode(node: Node, allowPartialContainment = false): boolean {
    throw new Error("contains");
  }

  /**
   * @see [Selection API]()
   */
  toString(): string {
    // TODO
    // The stringification must return the string, which is the concatenation of the rendered text if there is a range associated with this.

    // If the selection is within a textarea or input element, it must return the selected substring in its value.
    return "";
  }

  get #isEmpty(): boolean {
    return isEmpty(this);
  }

  #makeEmpty(): void {
    this.#_.range = null;
  }

  get #_(): SelectionInternals {
    return $<Selection>(this);
  }
}

enum Direction {
  Forwards,
  Backwards,
  Directionless,
}

export class SelectionInternals {
  range: globalThis.Range | null = null;
  direction: Direction = Direction.Directionless;

  get anchor(): BoundaryPoint | null {
    const { range } = this;
    if (!range) return null;

    switch (this.direction) {
      case Direction.Forwards:
        return $(range).start;
      default:
        return $(range).end;
    }
  }

  get focus(): BoundaryPoint | null {
    const { range } = this;
    if (!range) return null;

    switch (this.direction) {
      case Direction.Forwards:
        return $(range).end;
      default:
        return $(range).start;
    }
  }
}

export function isEmpty(selection: globalThis.Selection): boolean {
  return !$(selection).range;
}
