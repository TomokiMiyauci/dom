import { Node, NodeType } from "./node.ts";
import { CharacterData } from "./character_data.ts";
import { UnImplemented } from "./utils.ts";
import { IComment } from "../interface.d.ts";

export class Comment extends CharacterData implements IComment {
  constructor(data: string) {
    super();
  }

  override get nodeType(): NodeType.COMMENT_NODE {
    return NodeType.COMMENT_NODE;
  }

  override get nodeName(): "#comment" {
    return "#comment";
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }
}
