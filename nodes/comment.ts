import { Node, NodeType } from "./node.ts";
import { CharacterData } from "./character_data.ts";
import { UnImplemented } from "./utils.ts";
import { IComment } from "../interface.d.ts";

export class Comment extends CharacterData implements IComment {
  constructor(public data: string) {
    super();
  }

  override get nodeType(): NodeType.COMMENT_NODE {
    return NodeType.COMMENT_NODE;
  }

  override get nodeName(): "#comment" {
    return "#comment";
  }

  override get textContent(): string | null {
    throw new UnImplemented();
  }
  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }
}
