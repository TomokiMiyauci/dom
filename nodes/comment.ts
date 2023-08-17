import { type Document } from "./document.ts";
import { NodeStates, NodeType } from "./node.ts";
import { CharacterData, type CharacterDataStates } from "./character_data.ts";
import { IComment } from "../interface.d.ts";
import { $create, $data, $nodeDocument } from "./internal.ts";

export class Comment extends CharacterData implements IComment {
  static [$create](
    { data, nodeDocument }: CharacterDataStates & NodeStates,
  ): Comment {
    const node = new Comment(data);

    node[$nodeDocument] = nodeDocument;

    return node;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-comment-comment
   */
  constructor(data: string = "") {
    // set this’s data to data and this’s node document to current global object’s associated Document.
    super(data, globalThis.document as Document);
  }

  override get nodeType(): NodeType.COMMENT_NODE {
    return NodeType.COMMENT_NODE;
  }

  override get nodeName(): "#comment" {
    return "#comment";
  }

  protected override equals(other: this): boolean {
    return this[$data] === other[$data];
  }

  protected override clone(document: Document): Comment {
    return Comment[$create]({ data: this[$data], nodeDocument: document });
  }
}
