import type { IStaticRange } from "../interface.d.ts";
import { internalSlots } from "../internal.ts";
import { DOMExceptionName } from "../_internals/webidl/exception.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import { isDocumentType } from "../nodes/utils/type.ts";
import { isAttr } from "../nodes/utils/attr.ts";
import { AbstractRange, AbstractRangeInternals } from "./abstract_range.ts";

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
    this._ = new AbstractRangeInternals([startContainer, init.startOffset], [
      endContainer,
      init.endOffset,
    ]);
    internalSlots.extends<StaticRange>(this, this._);
  }

  protected override _: AbstractRangeInternals;
}
