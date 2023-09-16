import type { IAbstractRange } from "../../interface.d.ts";
import { BoundaryPoint } from "./boundary_point.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

@Exposed(Window)
export abstract class AbstractRange implements IAbstractRange {
  /**
   * @see https://dom.spec.whatwg.org/#dom-range-startcontainer
   */
  get startContainer(): Node {
    // return this’s start node.
    return this._.startNode;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-startoffset
   */
  get startOffset(): number {
    // return this’s start offset.
    return this._.startOffset;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-endcontainer
   */
  get endContainer(): Node {
    // return this’s end node.
    return this._.endNode;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-endoffset
   */
  get endOffset(): number {
    // return this’s end offset.
    return this._.endOffset;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-collapsed
   */
  get collapsed(): boolean {
    // return true if this is collapsed; otherwise false.
    return this._.collapsed;
  }

  protected abstract _: AbstractRangeInternals;
}

export class AbstractRangeInternals {
  start: BoundaryPoint;
  end: BoundaryPoint;

  constructor(start: BoundaryPoint, end: BoundaryPoint) {
    this.start = start;
    this.end = end;
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-start-node)
   */
  get startNode(): Node {
    return this.start[0];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-start-offset)
   */
  get startOffset(): number {
    return this.start[1];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-end-node)
   */
  get endNode(): Node {
    return this.end[0];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-end-offset)
   */
  get endOffset(): number {
    return this.end[1];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#range-collapsed)
   */
  get collapsed(): boolean {
    // its start node is its end node and its start offset is its end offset.
    return this.startNode === this.endNode &&
      this.startOffset === this.endOffset;
  }
}
