import { Text } from "./text.ts";
import { NodeType } from "./node.ts";
import type { ICDATASection } from "../interface.d.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#cdatasection)
 */
@Exposed("Window", "CDATASection")
export class CDATASection extends Text implements ICDATASection {
  protected constructor(data: string) {
    super(data);
  }

  override get nodeType(): NodeType.CDATA_SECTION_NODE {
    return NodeType.CDATA_SECTION_NODE;
  }

  override get nodeName(): "#cdata-section" {
    return "#cdata-section";
  }
}
