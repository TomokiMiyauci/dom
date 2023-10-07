import { NodeType } from "./node.ts";
import { CharacterData } from "./character_data.ts";
import { IComment } from "../../interface.d.ts";
import { $ } from "../../internal.ts";

export class Comment extends CharacterData implements IComment {
  /**
   * @see https://dom.spec.whatwg.org/#dom-comment-comment
   */
  constructor(data: string = "") {
    data = String(data);
    super(data);

    // set this’s data to data and this’s node document to current global object’s associated Document.
    $<Comment>(this).data = data,
      $<Comment>(this).nodeDocument = globalThis.document;
  }

  override get nodeType(): NodeType.COMMENT_NODE {
    return NodeType.COMMENT_NODE;
  }

  override get nodeName(): "#comment" {
    return "#comment";
  }

  protected override clone(document: Document): Comment {
    const comment = new Comment($<Comment>(this).data);
    $(comment).nodeDocument = document;

    return comment;
  }
}
