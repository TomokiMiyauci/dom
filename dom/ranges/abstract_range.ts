import type { Node } from "../nodes/node.ts";
import type { IAbstractRange } from "../../interface.d.ts";
import { BoundaryPoint } from "./boundary_point.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

Exposed(Window);
export abstract class AbstractRange implements IAbstractRange {
  /**
   * @see https://dom.spec.whatwg.org/#dom-range-startcontainer
   */
  get startContainer(): Node {
    // return this’s start node.
    return this._startNode;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-startoffset
   */
  get startOffset(): number {
    // return this’s start offset.
    return this._startOffset;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-endcontainer
   */
  get endContainer(): Node {
    // return this’s end node.
    return this._endNode;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-endoffset
   */
  get endOffset(): number {
    // return this’s end offset.
    return this._endOffset;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-collapsed
   */
  get collapsed(): boolean {
    // return true if this is collapsed; otherwise false.
    return this._collapsed;
  }

  // internal slots
  protected abstract start: BoundaryPoint;
  protected abstract end: BoundaryPoint;

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-start-node)
   */
  protected get _startNode(): Node {
    return this.start[0];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-start-offset)
   */
  protected get _startOffset(): number {
    return this.start[1];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-end-node)
   */
  protected get _endNode(): Node {
    return this.end[0];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#concept-range-end-offset)
   */
  protected get _endOffset(): number {
    return this.end[1];
  }

  /**
   * @see [DOM Living Standard](https://dom.spec.whatwg.org/#range-collapsed)
   */
  protected get _collapsed(): boolean {
    // its start node is its end node and its start offset is its end offset.
    return this._startNode === this._endNode &&
      this._startOffset === this._endOffset;
  }
}
