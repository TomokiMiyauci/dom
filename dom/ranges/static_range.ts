import type { IStaticRange } from "../../interface.d.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";
import { isAttr, isDocumentType } from "../nodes/utils.ts";
import { AbstractRange } from "./abstract_range.ts";
import { BoundaryPoint } from "./boundary_point.ts";

Exposed(Window);
export class StaticRange extends AbstractRange implements IStaticRange {
  protected override start: BoundaryPoint;
  protected override end: BoundaryPoint;

  constructor(init: StaticRangeInit) {
    const startContainer = init.startContainer;
    const endContainer = init.endContainer;

    // 1. If init["startContainer"] or init["endContainer"] is a DocumentType or Attr node, then throw an "InvalidNodeTypeError" DOMException.
    if (
      isDocumentType(startContainer) || isAttr(startContainer) ||
      isDocumentType(endContainer) || isAttr(endContainer)
    ) {
      throw new DOMException(
        "<message>",
        DOMExceptionName.InvalidNodeTypeError,
      );
    }

    super();
    // 2. Set this’s start to (init["startContainer"], init["startOffset"]) and end to (init["endContainer"], init["endOffset"]).
    this.start = new BoundaryPoint({
      node: startContainer,
      offset: init.startOffset,
    });
    this.end = new BoundaryPoint({
      node: endContainer,
      offset: init.endOffset,
    });
  }
}
