import { Node, NodeType } from "./node.ts";
import { ParentNode } from "./parent_node.ts";
import { type Document } from "./document.ts";
import { NonElementParentNode } from "./non_element_parent_node.ts";
import { UnImplemented } from "./utils.ts";
import type { IDocumentFragment } from "../interface.d.ts";
import { $host, $nodeDocument } from "./internal.ts";

@ParentNode
export class DocumentFragment extends Node implements IDocumentFragment {
  [$host]: Element | null = null;
  override [$nodeDocument]: Document;

  constructor(document: Document) {
    super();

    this[$nodeDocument] = document;
  }

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

  protected override clone(document: Document): DocumentFragment {
    return new DocumentFragment(document);
  }
}

export interface DocumentFragment extends ParentNode, NonElementParentNode {}
