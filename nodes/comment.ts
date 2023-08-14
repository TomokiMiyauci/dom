import { type Document } from "./document.ts";
import { Node, NodeType } from "./node.ts";
import { CharacterData } from "./character_data.ts";
import { UnImplemented } from "./utils.ts";
import { IComment } from "../interface.d.ts";

export class Comment extends CharacterData implements IComment {
  /**
   * @see https://dom.spec.whatwg.org/#dom-comment-comment
   */
  constructor(data: string = "") {
    // set this’s data to data and this’s node document to current global object’s associated Document.
    super(data, globalThis.document);
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

  protected override clone(document: Document): Node {
    return new Comment(this.data, document);
  }
}
