import { Node, NodeType } from "./node.ts";
import { ParentNode } from "./parent_node.ts";
import { Document } from "./document.ts";
import { NonElementParentNode } from "./non_element_parent_node.ts";
import { UnImplemented } from "./utils.ts";
import type { IDocumentFragment } from "../interface.d.ts";

@ParentNode
export class DocumentFragment extends Node implements IDocumentFragment {
  override nodeDocument: Document = new Document();

  override get nodeType(): NodeType.DOCUMENT_FRAGMENT_NODE {
    return NodeType.DOCUMENT_FRAGMENT_NODE;
  }

  override get nodeName(): "#document-fragment" {
    return "#document-fragment";
  }

  override get nodeValue(): null {
    return null;
  }

  override set nodeValue(value: string | null) {
    throw new UnImplemented();
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): null {
    return null;
  }

  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }
}

export interface DocumentFragment extends ParentNode, NonElementParentNode {}
