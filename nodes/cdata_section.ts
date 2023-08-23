import { Text } from "./text.ts";
import { NodeType } from "./node.ts";
import type { ICDATASection } from "../interface.d.ts";

export class CDATASection extends Text implements ICDATASection {
  constructor() {
    super();
  }

  override get nodeType(): NodeType.CDATA_SECTION_NODE {
    return NodeType.CDATA_SECTION_NODE;
  }

  override get nodeName(): "#cdata-section" {
    return "#cdata-section";
  }
}
