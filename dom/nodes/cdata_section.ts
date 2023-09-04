import { Text } from "./text.ts";
import { type NodeStates } from "./node.ts";
import { NodeType } from "./node.ts";
import { $create, $data, $nodeDocument } from "./internal.ts";
import { type CharacterDataStates } from "./character_data.ts";
import type { ICDATASection } from "../../interface.d.ts";

export class CDATASection extends Text implements ICDATASection {
  static [$create](
    { data, nodeDocument }: CharacterDataStates & NodeStates,
  ): CDATASection {
    const node = new CDATASection();

    node[$data] = data;
    node[$nodeDocument] = nodeDocument;

    return node;
  }

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
