import type { IStaticRange } from "../../interface.d.ts";
import { DOMExceptionName } from "../../webidl/exception.ts";
import { Exposed } from "../../webidl/extended_attribute.ts";
import { isAttr, isDocumentType } from "../nodes/utils.ts";
import { AbstractRange, AbstractRangeInternals } from "./abstract_range.ts";

@Exposed(Window)
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
    this._ = new AbstractRangeInternals([startContainer, init.startOffset], [
      endContainer,
      init.endOffset,
    ]);
  }

  protected override _: AbstractRangeInternals;
}
