import { NodeType } from "./node.ts";
import { CharacterData } from "./character_data.ts";
import { IComment } from "../interface.d.ts";
import { $ } from "../internal.ts";
import { data } from "../symbol.ts";
import { Exposed } from "../_internals/webidl/extended_attribute.ts";
import * as $$ from "../symbol.ts";

/**
 * @see [DOM Living Standard](https://dom.spec.whatwg.org/#comment)
 */
@Exposed("Window", "Comment")
export class Comment extends CharacterData implements IComment {
  /**
   * @see https://dom.spec.whatwg.org/#dom-comment-comment
   */
  constructor(data: string = "") {
    data = String(data);
    super();

    // set this’s data to data and this’s node document to current global object’s associated Document.
    this[$$.data] = data, $<Comment>(this).nodeDocument = globalThis.document;
  }

  override get nodeType(): NodeType.COMMENT_NODE {
    return NodeType.COMMENT_NODE;
  }

  override get nodeName(): "#comment" {
    return "#comment";
  }

  protected override clone(document: Document): Comment {
    const comment = new Comment(this[data]);
    $(comment).nodeDocument = document;

    return comment;
  }

  [$$.data]: string;
}
