import type { IAbstractRange } from "../interface.d.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import {
  endNode,
  endOffset,
  isCollapsed,
  startNode,
  startOffset,
} from "./utils/abstract_range.ts";
import type { AbstractRangeInternals as _, BoundaryPoint } from "../i.ts";
import { end, start } from "../symbol.ts";

@Exposed("Window", "AbstractRange")
export abstract class AbstractRange implements IAbstractRange, _ {
  /**
   * @see https://dom.spec.whatwg.org/#dom-range-startcontainer
   */
  get startContainer(): Node {
    // return this’s start node.
    return startNode(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-startoffset
   */
  get startOffset(): number {
    // return this’s start offset.
    return startOffset(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-endcontainer
   */
  get endContainer(): Node {
    // return this’s end node.
    return endNode(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-endoffset
   */
  get endOffset(): number {
    // return this’s end offset.
    return endOffset(this);
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-range-collapsed
   */
  get collapsed(): boolean {
    // return true if this is collapsed; otherwise false.
    return isCollapsed(this);
  }

  abstract [start]: BoundaryPoint;
  abstract [end]: BoundaryPoint;
}
