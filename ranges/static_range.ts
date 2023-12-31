import type { IStaticRange } from "../interface.d.ts";
import { DOMExceptionName } from "../_internals/webidl/exception.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { isDocumentType } from "../nodes/utils/type.ts";
import { isAttr } from "../nodes/utils/attr.ts";
import { AbstractRange } from "./abstract_range.ts";
import { end, start } from "../symbol.ts";
import type { BoundaryPoint, StaticRangeInit } from "../i.ts";

@Exposed("Window", "StaticRange")
export class StaticRange extends AbstractRange implements IStaticRange {
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
    this[start] = [startContainer, init.startOffset],
      this[end] = [endContainer, init.endOffset];
  }

  [start]: BoundaryPoint;
  [end]: BoundaryPoint;
}
