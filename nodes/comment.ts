import { NodeType } from "./node.ts";
import { IComment } from "../interface.d.ts";

export class Comment extends CharacterData implements IComment {
  constructor(public data: string) {
    super();
  }

  override get nodeType(): NodeType.COMMENT_NODE {
    return NodeType.COMMENT_NODE;
  }
}
