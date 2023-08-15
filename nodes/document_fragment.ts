import { Node, NodeStates, NodeType } from "./node.ts";
import { ParentNode } from "./parent_node.ts";
import { type Document } from "./document.ts";
import { NonElementParentNode } from "./non_element_parent_node.ts";
import { UnImplemented } from "./utils.ts";
import type { IDocumentFragment } from "../interface.d.ts";
import { $create, $host, $nodeDocument } from "./internal.ts";

@ParentNode
/**
 * @see https://dom.spec.whatwg.org/#interface-documentfragment
 */
export class DocumentFragment extends Node implements IDocumentFragment {
  [$host]: Element | null = null;
  override [$nodeDocument]!: Document;

  static [$create](states: NodeStates): DocumentFragment {
    const node = new DocumentFragment();
    node[$nodeDocument] = states.nodeDocument;

    return node;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodetype
   */
  override get nodeType(): NodeType.DOCUMENT_FRAGMENT_NODE {
    return NodeType.DOCUMENT_FRAGMENT_NODE;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodename
   */
  override get nodeName(): "#document-fragment" {
    return "#document-fragment";
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override get nodeValue(): null {
    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-nodevalue
   */
  override set nodeValue(_: unknown) {
    // noop
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override get textContent(): null {
    return null;
  }

  /**
   * @see https://dom.spec.whatwg.org/#dom-node-textcontent
   */
  override set textContent(value: string | null) {
    throw new UnImplemented();
  }

  override isEqualNode(otherNode: Node | null): boolean {
    throw new UnImplemented();
  }

  protected override clone(document: Document): DocumentFragment {
    return DocumentFragment[$create]({ nodeDocument: document });
  }
}

export interface DocumentFragment extends ParentNode, NonElementParentNode {}

// Algorithm
// [isHostIncludingInclusiveAncestorOf](./algorithm.ts)
