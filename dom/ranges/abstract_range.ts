import type { Node } from "../nodes/node.ts";
import type { IAbstractRange } from "../../interface.d.ts";
import { BoundaryPoint } from "./boundary_point.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";

Exposed(Window);
export abstract class AbstractRange implements IAbstractRange {
  protected abstract start: BoundaryPoint;
  protected abstract end: BoundaryPoint;

  /**
   * @see https://dom.spec.whatwg.org/#range-collapsed
   */
  private get isCollapsed(): boolean {
    // its start node is its end node and its start offset is its end offset.
    return this.start[0] === this.end[0] && this.start[1] === this.end[1];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-startcontainer
   */
  get startContainer(): Node {
    // return this’s start node.
    return this.start[0];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-startoffset
   */
  get startOffset(): number {
    // return this’s start offset.
    return this.start[1];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-endcontainer
   */
  get endContainer(): Node {
    // return this’s end node.
    return this.end[0];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-endoffset
   */
  get endOffset(): number {
    // return this’s end offset.
    return this.end[1];
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-collapsed
   */
  get collapsed(): boolean {
    // return true if this is collapsed; otherwise false.
    return this.isCollapsed;
  }
}
